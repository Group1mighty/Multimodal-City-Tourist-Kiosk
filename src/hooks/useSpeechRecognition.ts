/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from 'react';

export type RecognitionStatus = 'idle' | 'listening' | 'error' | 'unsupported';

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
export function useSpeechRecognition(options: UseSpeechRecognitionOptions = {}) {
  const {
    lang = 'en-US',
    continuous = false,
    interimResults = true,
    onTranscript,
    onEnd,
    onError,
  } = options;

  const recognitionRef = useRef<any>(null);
  const [status, setStatus] = useState<RecognitionStatus>('idle');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');

  const isSupported = useCallback((): boolean => {
    return !!(
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition
    );
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
      setStatus('listening');
      setFinalTranscript('');
      setInterimTranscript('');
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';

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
        setInterimTranscript('');
        onTranscript?.(final, true);
      }
    };

    recognition.onend = () => {
      setStatus('idle');
      setInterimTranscript('');
      onEnd?.();
    };

    recognition.onerror = (event: any) => {
      const errorMsg =
        event.error === 'not-allowed'
          ? 'Microphone access denied. Please allow microphone access.'
          : event.error === 'no-speech'
          ? 'No speech detected. Please try again.'
          : event.error === 'network'
          ? 'Network error. Please check your connection.'
          : `Voice recognition error: ${event.error}`;

      setStatus('error');
      onError?.(errorMsg);
    };

    return recognition;
  }, [lang, continuous, interimResults, onTranscript, onEnd, onError, isSupported]);

  const start = useCallback(() => {
    if (!isSupported()) {
      setStatus('unsupported');
      onError?.('Speech recognition is not supported in this browser.');
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
      setStatus('error');
      onError?.('Failed to start voice recognition.');
    }
  }, [isSupported, buildRecognition, onError]);

  const stop = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setStatus('idle');
    setInterimTranscript('');
  }, []);

  const abort = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }
    setStatus('idle');
    setInterimTranscript('');
  }, []);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  return {
    status,
    finalTranscript,
    interimTranscript,
    currentTranscript: interimTranscript || finalTranscript,
    isListening: status === 'listening',
    isSupported: isSupported(),
    start,
    stop,
    abort,
  };
}
