import { useState, useCallback } from 'react';
import { SplashScreen } from './components/screens/SplashScreen';
import { KioskScreen } from './components/screens/KioskScreen';
import { useIdleTimer } from './hooks/useIdleTimer';
import { useSoundEffects } from './hooks/useSoundEffects';
import type { AppScreen } from './types';

/**
 * App — Root component for the Nova Crest Multimodal Tourist Kiosk
 *
 * Architecture:
 * ├── App.tsx                        ← Root: screen routing + idle management
 * ├── components/
 * │   ├── screens/
 * │   │   ├── SplashScreen.tsx       ← Welcome / idle screensaver
 * │   │   └── KioskScreen.tsx        ← Main kiosk interface
 * │   └── ui/
 * │       ├── TopBar.tsx             ← Header with clock & branding
 * │       ├── CategorySidebar.tsx    ← Touch category navigation
 * │       ├── SearchBar.tsx          ← Text search input
 * │       ├── LocationCard.tsx       ← Grid card for each location
 * │       ├── LocationDetail.tsx     ← Full-screen detail modal
 * │       ├── VoicePanel.tsx         ← Voice interaction panel
 * │       └── StarRating.tsx         ← Reusable star rating display
 * ├── hooks/
 * │   ├── useSpeechRecognition.ts    ← Web Speech API (input)
 * │   ├── useSpeechSynthesis.ts      ← Web Speech API (output)
 * │   ├── useSoundEffects.ts         ← Web Audio API sound generation
 * │   └── useIdleTimer.ts            ← Inactivity detection → screensaver
 * ├── data/
 * │   └── locations.ts               ← 10 city locations + metadata
 * ├── utils/
 * │   ├── voiceCommands.ts           ← NLP command parser
 * │   └── cn.ts                      ← Tailwind class utility
 * └── types/
 *     └── index.ts                   ← TypeScript type definitions
 */

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('splash');
  const [autoStartVoice, setAutoStartVoice] = useState(false);
  const { playTap } = useSoundEffects();

  const handleEnterKiosk = useCallback(() => {
    playTap();
    setAutoStartVoice(false);
    setScreen('kiosk');
  }, [playTap]);

  const handleEnterKioskWithVoice = useCallback(() => {
    playTap();
    setAutoStartVoice(true);
    setScreen('kiosk');
  }, [playTap]);

  const handleReturnToSplash = useCallback(() => {
    setAutoStartVoice(false);
    setScreen('splash');
  }, []);

  // Idle timer — only active on the kiosk screen
  const { resetTimer } = useIdleTimer(handleReturnToSplash, 60_000, screen === 'kiosk');

  return (
    <div className="min-h-screen bg-slate-950 text-white antialiased">
      {screen === 'splash' && (
        <SplashScreen
          onEnter={handleEnterKiosk}
          onEnterWithVoice={handleEnterKioskWithVoice}
        />
      )}
      {screen === 'kiosk' && (
        <KioskScreen 
          onIdle={handleReturnToSplash} 
          autoStartVoice={autoStartVoice}
          onResetIdleTimer={resetTimer} 
        />
      )}
    </div>
  );
}
