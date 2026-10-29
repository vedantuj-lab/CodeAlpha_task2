import { SavedCalculation } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const GUEST_SAVED_KEY = 'calcora_guest_saved';

function getLocalKey(userId?: string): string {
  return userId ? `calcora_saved_${userId}` : GUEST_SAVED_KEY;
}

export const savedCalculationsService = {
  async getSaved(userId?: string): Promise<SavedCalculation[]> {
    if (userId && isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('saved_calculations')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map((row: any) => ({
            id: row.id,
            userId: row.user_id,
            title: row.title,
            expression: row.expression,
            result: row.result,
            numericResult: row.numeric_result,
            mode: row.mode,
            angleMode: row.angle_mode,
            createdAt: new Date(row.created_at).getTime(),
            updatedAt: new Date(row.updated_at).getTime(),
          }));
        }
      } catch (e) {
        console.warn('Supabase saved calculations fetch error, falling back locally:', e);
      }
    }

    try {
      const raw = localStorage.getItem(getLocalKey(userId));
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  async addSaved(
    item: Omit<SavedCalculation, 'id' | 'createdAt' | 'updatedAt'>,
    userId?: string
  ): Promise<SavedCalculation> {
    const now = Date.now();
    const newSaved: SavedCalculation = {
      ...item,
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `save_${now}_${Math.random().toString(36).substring(2, 7)}`,
      userId,
      createdAt: now,
      updatedAt: now,
    };

    if (userId && isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('saved_calculations')
          .insert({
            user_id: userId,
            title: newSaved.title,
            expression: newSaved.expression,
            result: newSaved.result,
            numeric_result: newSaved.numericResult ?? null,
            mode: newSaved.mode,
            angle_mode: newSaved.angleMode,
          })
          .select()
          .single();

        if (!error && data) {
          newSaved.id = data.id;
        }
      } catch (e) {
        console.warn('Supabase saved calc insert error, saving locally:', e);
      }
    }

    try {
      const current = await this.getSaved(userId);
      const updated = [newSaved, ...current];
      localStorage.setItem(getLocalKey(userId), JSON.stringify(updated));
    } catch (e) {
      console.error('LocalStorage write failed:', e);
    }

    return newSaved;
  },

  async updateSavedTitle(id: string, title: string, userId?: string): Promise<boolean> {
    if (userId && isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('saved_calculations')
          .update({ title, updated_at: new Date().toISOString() })
          .eq('id', id);
      } catch (e) {
        console.warn('Supabase update error:', e);
      }
    }

    try {
      const current = await this.getSaved(userId);
      const updated = current.map((item) =>
        item.id === id ? { ...item, title, updatedAt: Date.now() } : item
      );
      localStorage.setItem(getLocalKey(userId), JSON.stringify(updated));
      return true;
    } catch {
      return false;
    }
  },

  async deleteSaved(id: string, userId?: string): Promise<boolean> {
    if (userId && isSupabaseConfigured && supabase) {
      try {
        await supabase.from('saved_calculations').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase delete error:', e);
      }
    }

    try {
      const current = await this.getSaved(userId);
      const filtered = current.filter((item) => item.id !== id);
      localStorage.setItem(getLocalKey(userId), JSON.stringify(filtered));
      return true;
    } catch {
      return false;
    }
  },
};
