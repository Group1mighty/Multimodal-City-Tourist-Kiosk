/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from "react";

export type RecognitionStatus = "idle" | "listening" | "error" | "unsupported";

const ERROR_MESSAGES = {
  notAllowed: "Microphone access denied. Please allow microphone access.",
  noSpeech: "No speech detected. Please try again.",
  network: "Network error. Please check your connection.",
  unsupported: "Speech recognition is not supported in this browser.",
  startFailed: "Failed to start voice recognition.",
} as const;

export interface UseSpeechRecognitionOptions {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onTranscript?: (transcript: string, isFinal: boolean) => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

/**
 * useSpeechRecognition
 * Wraps the Web Speech API's SpeechRecognition interface.
 * Uses `any` for the recognition instance to avoid TypeScript lib version conflicts.
 */
export function useSpeechRecognition(
  options: UseSpeechRecognitionOptions = {},
) {
  const {
    lang = "en-US",
    continuous = false,
    interimResults = true,
    onTranscript,
    onEnd,
    onError,
  } = options;

  const recognitionRef = useRef<any>(null);
  const [status, setStatus] = useState<RecognitionStatus>("idle");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");

  const isSupported = useCallback((): boolean => {
    const hasNativeSupport =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    return !!hasNativeSupport;
  }, []);

  const buildRecognition = useCallback((): any | null => {
    if (!isSupported()) return null;

    const SpeechRecognitionClass: any =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    const recognition = new SpeechRecognitionClass();

    recognition.lang = lang;
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setStatus("listening");
      setFinalTranscript("");
      setInterimTranscript("");
    };

    recognition.onresult = (event: any) => {
      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript: string = result[0].transcript;
        if (result.isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }

      if (interim) {
        setInterimTranscript(interim);
        onTranscript?.(interim, false);
      }
      if (final) {
        setFinalTranscript(final);
        setInterimTranscript("");
        onTranscript?.(final, true);
      }
    };

    recognition.onend = () => {
      setStatus("idle");
      setInterimTranscript("");
      onEnd?.();
    };

    recognition.onerror = (event: any) => {
      let errorMsg: string;

      if (event.error === "not-allowed") {
        errorMsg = ERROR_MESSAGES.notAllowed;
      } else if (event.error === "no-speech") {
        errorMsg = ERROR_MESSAGES.noSpeech;
      } else if (event.error === "network") {
        errorMsg = ERROR_MESSAGES.network;
      } else {
        errorMsg = `Voice recognition error: ${event.error}`;
      }

      setStatus("error");
      onError?.(errorMsg);
    };

    return recognition;
  }, [
    lang,
    continuous,
    interimResults,
    onTranscript,
    onEnd,
    onError,
    isSupported,
  ]);

  const start = useCallback(() => {
    if (!isSupported()) {
      setStatus("unsupported");
      onError?.(ERROR_MESSAGES.unsupported);
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      const recognition = buildRecognition();
      if (!recognition) return;
      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setStatus("error");
      onError?.(ERROR_MESSAGES.startFailed);
    }
  }, [isSupported, buildRecognition, onError]);

  const stop = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setStatus("idle");
    setInterimTranscript("");
  }, []);

  const abort = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }
    setStatus("idle");
    setInterimTranscript("");
  }, []);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  return {
    isSupported: isSupported(),
    isListening: status === "listening",
    status,
    currentTranscript: interimTranscript || finalTranscript,
    finalTranscript,
    interimTranscript,
    start,
    stop,
    abort,
  };
}
