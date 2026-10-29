import { HistoryItem } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const GUEST_STORAGE_KEY = 'calcora_guest_history';
const MAX_HISTORY = 100;

function getLocalKey(userId?: string): string {
  return userId ? `calcora_history_${userId}` : GUEST_STORAGE_KEY;
}

export const historyService = {
  async getHistory(userId?: string): Promise<HistoryItem[]> {
    if (userId && isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('calculation_history')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(MAX_HISTORY);

        if (!error && data) {
          return data.map((row: any) => ({
            id: row.id,
            userId: row.user_id,
            expression: row.expression,
            result: row.result,
            numericResult: row.numeric_result,
            mode: row.mode,
            angleMode: row.angle_mode,
            timestamp: new Date(row.created_at).getTime(),
            createdAt: row.created_at,
          }));
        }
      } catch (e) {
        console.warn('Supabase calculation history fetch failed, falling back to local store:', e);
      }
    }

    // LocalStorage fallback
    try {
      const raw = localStorage.getItem(getLocalKey(userId));
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  async addHistory(item: Omit<HistoryItem, 'id'>, userId?: string): Promise<HistoryItem> {
    const newItem: HistoryItem = {
      ...item,
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `hist_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId,
      timestamp: item.timestamp || Date.now(),
      createdAt: new Date().toISOString(),
    };

    if (userId && isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('calculation_history')
          .insert({
            user_id: userId,
            expression: newItem.expression,
            result: newItem.result,
            numeric_result: newItem.numericResult ?? null,
            mode: newItem.mode,
            angle_mode: newItem.angleMode,
          })
          .select()
          .single();

        if (!error && data) {
          newItem.id = data.id;
        }
      } catch (e) {
        console.warn('Supabase history insert failed, saving locally:', e);
      }
    }

    // Always mirror in localStorage for offline resilience & fast cache
    try {
      const current = await this.getHistory(userId);
      // Avoid accidental exact duplicate at the top
      if (current[0]?.expression === newItem.expression && current[0]?.result === newItem.result) {
        return current[0];
      }
      const updated = [newItem, ...current].slice(0, MAX_HISTORY);
      localStorage.setItem(getLocalKey(userId), JSON.stringify(updated));
    } catch (e) {
      console.error('LocalStorage write failed:', e);
    }

    return newItem;
  },

  async deleteItem(id: string, userId?: string): Promise<boolean> {
    if (userId && isSupabaseConfigured && supabase) {
      try {
        await supabase.from('calculation_history').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase history delete failed:', e);
      }
    }

    try {
      const current = await this.getHistory(userId);
      const filtered = current.filter((item) => item.id !== id);
      localStorage.setItem(getLocalKey(userId), JSON.stringify(filtered));
      return true;
    } catch {
      return false;
    }
  },

  async clearHistory(userId?: string): Promise<boolean> {
    if (userId && isSupabaseConfigured && supabase) {
      try {
        await supabase.from('calculation_history').delete().eq('user_id', userId);
      } catch (e) {
        console.warn('Supabase history clear failed:', e);
      }
    }

    try {
      localStorage.removeItem(getLocalKey(userId));
      return true;
    } catch {
      return false;
    }
  },
};
