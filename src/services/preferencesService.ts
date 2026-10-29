import { UserPreferences } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'dark',
  defaultCalculatorMode: 'standard',
  defaultAngleMode: 'deg',
  maxStoredHistory: 50,
};

function getStorageKey(userId?: string): string {
  return userId ? `calcora_prefs_${userId}` : 'calcora_guest_prefs';
}

export const preferencesService = {
  async getPreferences(userId?: string): Promise<UserPreferences> {
    if (userId && isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (!error && data) {
          return {
            theme: data.theme || 'dark',
            defaultCalculatorMode: data.calculator_mode || 'standard',
            defaultAngleMode: data.angle_mode || 'deg',
            maxStoredHistory: data.max_stored_history || 50,
          };
        }
      } catch (e) {
        console.warn('Supabase prefs fetch failed:', e);
      }
    }

    try {
      const raw = localStorage.getItem(getStorageKey(userId));
      if (!raw) return DEFAULT_PREFERENCES;
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
    } catch {
      return DEFAULT_PREFERENCES;
    }
  },

  async savePreferences(prefs: Partial<UserPreferences>, userId?: string): Promise<UserPreferences> {
    const current = await this.getPreferences(userId);
    const updated: UserPreferences = { ...current, ...prefs };

    if (userId && isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('user_preferences')
          .upsert({
            user_id: userId,
            theme: updated.theme,
            calculator_mode: updated.defaultCalculatorMode,
            angle_mode: updated.defaultAngleMode,
            max_stored_history: updated.maxStoredHistory,
            updated_at: new Date().toISOString(),
          });
      } catch (e) {
        console.warn('Supabase prefs save failed:', e);
      }
    }

    try {
      localStorage.setItem(getStorageKey(userId), JSON.stringify(updated));
    } catch (e) {
      console.error('LocalStorage write failed:', e);
    }

    return updated;
  },
};
