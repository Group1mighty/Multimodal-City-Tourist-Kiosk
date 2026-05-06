import { useCallback, useRef, useEffect } from 'react';

export interface SpeechSynthesisOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
}

/**
 * useSpeechSynthesis
 * Wraps the Web Speech API's SpeechSynthesis interface.
 * Provides a `speak` function and a `cancel` function.
 */
export function useSpeechSynthesis(options: SpeechSynthesisOptions = {}) {
  const { rate = 0.95, pitch = 1.05, volume = 1, lang = 'en-US' } = options;
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Cancel any ongoing speech on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const cancel = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const speak = useCallback(
    (
      text: string,
      callbacks?: {
        onStart?: () => void;
        onEnd?: () => void;
        onError?: () => void;
      }
    ) => {
      if (!window.speechSynthesis) {
        callbacks?.onError?.();
        return;
      }

      // Cancel any current speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;

      // Prefer a natural English voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice =
        voices.find(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha'))
        ) || voices.find((v) => v.lang.startsWith('en'));
      if (preferredVoice) utterance.voice = preferredVoice;

      utterance.onstart = () => callbacks?.onStart?.();
      utterance.onend = () => callbacks?.onEnd?.();
      utterance.onerror = () => callbacks?.onError?.();

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [lang, rate, pitch, volume]
  );

  const isSpeaking = useCallback(() => {
    return window.speechSynthesis?.speaking ?? false;
  }, []);

  return { speak, cancel, isSpeaking };
}
