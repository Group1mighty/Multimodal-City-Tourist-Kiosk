export type Category = 'All' | 'Food' | 'Attractions' | 'Transport';

export type SubCategory =
  | 'Restaurant'
  | 'Cafe'
  | 'Bar'
  | 'Museum'
  | 'Park'
  | 'Landmark'
  | 'Bus'
  | 'Metro'
  | 'Train';

export interface Location {
  id: string;
  name: string;
  category: Exclude<Category, 'All'>;
  subCategory: SubCategory;
  rating: number;          // 1–5
  reviewCount: number;
  description: string;
  shortDesc: string;
  address: string;
  openHours: string;
  distance: string;        // e.g. "0.4 km"
  tags: string[];
  imageGradient: string;   // Tailwind gradient classes
  icon: string;            // emoji icon
  imageUrl?: string;       // real picture
  featured?: boolean;
  priceRange?: '$' | '$$' | '$$$' | '$$$$';
  phone?: string;
  website?: string;
}

// ─── App State Types ──────────────────────────────────────────────────────────

export type AppScreen = 'splash' | 'kiosk';

export type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking';

export interface AppState {
  screen: AppScreen;
  activeCategory: Category;
  searchQuery: string;
  selectedLocation: Location | null;
  voiceState: VoiceState;
  transcript: string;
  voiceMessage: string;
}

// ─── Voice Command Types ──────────────────────────────────────────────────────

export interface VoiceCommand {
  patterns: RegExp[];
  action: (dispatch: React.Dispatch<AppAction>) => void;
  feedback: string;
}

// ─── Reducer Action Types ─────────────────────────────────────────────────────

export type AppAction =
  | { type: 'GO_TO_KIOSK' }
  | { type: 'GO_TO_SPLASH' }
  | { type: 'SET_CATEGORY'; payload: Category }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SELECT_LOCATION'; payload: Location | null }
  | { type: 'SET_VOICE_STATE'; payload: VoiceState }
  | { type: 'SET_TRANSCRIPT'; payload: string }
  | { type: 'SET_VOICE_MESSAGE'; payload: string }
  | { type: 'RESET_VOICE' };
