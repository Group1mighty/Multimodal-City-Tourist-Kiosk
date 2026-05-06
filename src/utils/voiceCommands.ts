import type { Category, AppAction } from '../types';

// ─── Voice Command Definitions ─────────────────────────────────────────────────

export interface ParsedCommand {
  action: AppAction;
  feedback: string;
}

interface CommandRule {
  patterns: RegExp[];
  parse: (transcript: string) => ParsedCommand | null;
}

const commandRules: CommandRule[] = [
  // ── Navigation: Show All ──────────────────────────────────────────────────
  {
    patterns: [
      /\b(show|see|display|view)\b.*\b(all|everything|everything)\b/i,
      /\bshow all\b/i,
      /\bhome\b/i,
      /\breset\b/i,
    ],
    parse: () => ({
      action: { type: 'SET_CATEGORY', payload: 'All' as Category },
      feedback:
        'Showing you all locations in Nova Crest. Browse through food, attractions, and transport options.',
    }),
  },

  // ── Navigation: Food ─────────────────────────────────────────────────────
  {
    patterns: [
      /\b(food|restaurant|restaurants|eat|eating|dinner|lunch|breakfast|cafe|cafes|coffee|bar|bars|drink|drinks)\b/i,
      /\bwhere (can|to) (i |we )?(eat|dine|drink)\b/i,
      /\b(hungry|thirsty)\b/i,
    ],
    parse: () => ({
      action: { type: 'SET_CATEGORY', payload: 'Food' as Category },
      feedback:
        'Great choice! Showing you the top-rated food spots in Nova Crest, from fine dining to cozy cafés.',
    }),
  },

  // ── Navigation: Attractions ───────────────────────────────────────────────
  {
    patterns: [
      /\b(attraction|attractions|museum|museums|park|parks|landmark|landmarks|things to do|sightseeing|sight|sights|tour|tours)\b/i,
      /\bwhat (is there|can i|can we) (do|see|visit)\b/i,
      /\b(visit|visiting|explore|exploring)\b/i,
    ],
    parse: () => ({
      action: { type: 'SET_CATEGORY', payload: 'Attractions' as Category },
      feedback:
        'Showing you the best attractions in Nova Crest, including museums, parks, and iconic landmarks.',
    }),
  },

  // ── Navigation: Transport ─────────────────────────────────────────────────
  {
    patterns: [
      /\b(transport|transportation|transit|bus|buses|metro|subway|train|trains|ferry|ferries|taxi|taxis|get around|travel)\b/i,
      /\bhow (do i|can i|to) (get|travel|go)\b/i,
      /\bget (around|there|back)\b/i,
    ],
    parse: () => ({
      action: { type: 'SET_CATEGORY', payload: 'Transport' as Category },
      feedback:
        'Here are the transport options in Nova Crest, including metro, buses, and ferry services.',
    }),
  },

  // ── Search: Generic ───────────────────────────────────────────────────────
  {
    patterns: [
      /\b(search|find|look for|looking for|where is|where are|show me)\b\s+(.+)/i,
    ],
    parse: (transcript: string) => {
      const match = transcript.match(
        /\b(?:search|find|look for|looking for|where is|where are|show me)\b\s+(.+)/i
      );
      if (match && match[1]) {
        const query = match[1].trim().replace(/[?.!,]$/, '');
        return {
          action: { type: 'SET_SEARCH', payload: query },
          feedback: `Searching for "${query}" across Nova Crest. Here are the results I found.`,
        };
      }
      return null;
    },
  },

  // ── Help ──────────────────────────────────────────────────────────────────
  {
    patterns: [/\b(help|assist|assist me|what can (you|i)|commands|options)\b/i],
    parse: () => ({
      action: { type: 'SET_VOICE_MESSAGE', payload: 'help' },
      feedback:
        'You can say things like: "Show me restaurants", "Find parks", "Where is the metro", or "Search for coffee". Just speak naturally and I will help you explore Nova Crest!',
    }),
  },

  // ── Go Back / Close ───────────────────────────────────────────────────────
  {
    patterns: [/\b(go back|close|dismiss|exit|cancel|clear)\b/i],
    parse: () => ({
      action: { type: 'SELECT_LOCATION', payload: null },
      feedback: 'Going back to the main view.',
    }),
  },
];

/**
 * processVoiceCommand
 * Takes a raw transcript string and returns a ParsedCommand or null.
 */
export function processVoiceCommand(transcript: string): ParsedCommand | null {
  const normalised = transcript.toLowerCase().trim();

  for (const rule of commandRules) {
    const matches = rule.patterns.some((pattern) => pattern.test(normalised));
    if (matches) {
      const result = rule.parse(transcript);
      if (result) return result;
    }
  }

  // Fallback: treat the whole transcript as a search query
  if (normalised.length > 2) {
    return {
      action: { type: 'SET_SEARCH', payload: normalised },
      feedback: `Searching Nova Crest for "${transcript}". Here is what I found.`,
    };
  }

  return null;
}
