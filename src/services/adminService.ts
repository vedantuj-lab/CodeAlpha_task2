import { AdminActivityItem, AppConfigSettings, UserProfile } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const ADMIN_ACTIVITY_KEY = 'calcora_admin_activity';
const APP_CONFIG_KEY = 'calcora_app_config';
const LOCAL_USERS_KEY = 'calcora_local_users';

const DEFAULT_CONFIG: AppConfigSettings = {
  defaultTheme: 'dark',
  defaultCalculatorMode: 'standard',
  defaultAngleMode: 'deg',
  maxStoredHistoryEntries: 100,
  enableScientificMode: true,
  enableSavedCalculations: true,
  updatedAt: new Date().toISOString(),
};

export const adminService = {
  async getAdminStats(): Promise<{
    registeredUsersCount: number;
    savedCalculationsCount: number;
    historyCalculationsCount: number;
    adminActivityCount: number;
  }> {
    if (isSupabaseConfigured && supabase) {
      try {
        const [usersRes, savedRes, histRes, actRes] = await Promise.all([
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
          supabase.from('saved_calculations').select('id', { count: 'exact', head: true }),
          supabase.from('calculation_history').select('id', { count: 'exact', head: true }),
          supabase.from('admin_activity').select('id', { count: 'exact', head: true }),
        ]);

        return {
          registeredUsersCount: usersRes.count ?? 0,
          savedCalculationsCount: savedRes.count ?? 0,
          historyCalculationsCount: histRes.count ?? 0,
          adminActivityCount: actRes.count ?? 0,
        };
      } catch (e) {
        console.warn('Supabase stats query failed, reading local fallback stats:', e);
      }
    }

    // Local mode stats
    const users = this.getLocalUsers();
    const act = this.getLocalActivity();
    let savedCount = 0;
    let histCount = 0;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i) || '';
      if (key.startsWith('calcora_saved_')) {
        try {
          const items = JSON.parse(localStorage.getItem(key) || '[]');
          savedCount += items.length;
        } catch {}
      } else if (key.startsWith('calcora_history_')) {
        try {
          const items = JSON.parse(localStorage.getItem(key) || '[]');
          histCount += items.length;
        } catch {}
      }
    }

    return {
      registeredUsersCount: users.length,
      savedCalculationsCount: savedCount,
      historyCalculationsCount: histCount,
      adminActivityCount: act.length,
    };
  },

  async getUsers(): Promise<UserProfile[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map((d: any) => ({
            id: d.id,
            email: d.email || `${d.display_name.toLowerCase().replace(/\s+/g, '')}@calcora.io`,
            displayName: d.display_name,
            role: d.role,
            createdAt: d.created_at,
            updatedAt: d.updated_at,
          }));
        }
      } catch (e) {
        console.warn('Supabase fetch profiles failed:', e);
      }
    }

    return this.getLocalUsers();
  },

  async updateUserRole(
    userId: string,
    newRole: 'member' | 'admin',
    actorUserId: string
  ): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ role: newRole, updated_at: new Date().toISOString() })
          .eq('id', userId);

        if (!error) {
          await this.logActivity(actorUserId, 'ROLE_UPDATE', 'user_profile', userId, { newRole });
          return true;
        }
      } catch (e) {
        console.warn('Supabase role update failed:', e);
      }
    }

    // Local fallback
    const users = this.getLocalUsers();
    const updated = users.map((u) => (u.id === userId ? { ...u, role: newRole, updatedAt: new Date().toISOString() } : u));
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(updated));
    await this.logActivity(actorUserId, 'ROLE_UPDATE', 'user_profile', userId, { newRole });
    return true;
  },

  async getActivityLogs(): Promise<AdminActivityItem[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('admin_activity')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);

        if (!error && data) {
          return data.map((d: any) => ({
            id: d.id,
            actorUserId: d.actor_user_id,
            action: d.action,
            targetType: d.target_type,
            targetId: d.target_id,
            metadata: d.metadata,
            createdAt: d.created_at,
          }));
        }
      } catch (e) {
        console.warn('Supabase activity logs fetch failed:', e);
      }
    }

    return this.getLocalActivity();
  },

  async logActivity(
    actorUserId: string,
    action: string,
    targetType: string,
    targetId?: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    const item: AdminActivityItem = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `act_${Date.now()}`,
      actorUserId,
      action,
      targetType,
      targetId,
      metadata,
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('admin_activity').insert({
          actor_user_id: actorUserId,
          action,
          target_type: targetType,
          target_id: targetId,
          metadata: metadata || {},
        });
      } catch (e) {
        console.warn('Supabase log activity error:', e);
      }
    }

    // Local mirror
    const current = this.getLocalActivity();
    localStorage.setItem(ADMIN_ACTIVITY_KEY, JSON.stringify([item, ...current].slice(0, 50)));
  },

  async getAppConfig(): Promise<AppConfigSettings> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('app_config')
          .select('*')
          .eq('id', 'global_config')
          .single();

        if (!error && data) {
          return {
            defaultTheme: data.default_theme,
            defaultCalculatorMode: data.default_calculator_mode,
            defaultAngleMode: data.default_angle_mode,
            maxStoredHistoryEntries: data.max_stored_history_entries,
            enableScientificMode: data.enable_scientific_mode,
            enableSavedCalculations: data.enable_saved_calculations,
            updatedAt: data.updated_at,
          };
        }
      } catch (e) {
        console.warn('Supabase config fetch failed:', e);
      }
    }

    try {
      const raw = localStorage.getItem(APP_CONFIG_KEY);
      if (!raw) return DEFAULT_CONFIG;
      return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
    } catch {
      return DEFAULT_CONFIG;
    }
  },

  async saveAppConfig(config: Partial<AppConfigSettings>, actorUserId: string): Promise<AppConfigSettings> {
    const current = await this.getAppConfig();
    const updated: AppConfigSettings = {
      ...current,
      ...config,
      updatedAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('app_config').upsert({
          id: 'global_config',
          default_theme: updated.defaultTheme,
          default_calculator_mode: updated.defaultCalculatorMode,
          default_angle_mode: updated.defaultAngleMode,
          max_stored_history_entries: updated.maxStoredHistoryEntries,
          enable_scientific_mode: updated.enableScientificMode,
          enable_saved_calculations: updated.enableSavedCalculations,
          updated_at: updated.updatedAt,
        });
      } catch (e) {
        console.warn('Supabase save config failed:', e);
      }
    }

    localStorage.setItem(APP_CONFIG_KEY, JSON.stringify(updated));
    await this.logActivity(actorUserId, 'CONFIG_UPDATED', 'app_config', 'global_config', { config });
    return updated;
  },

  // Helpers for local users storage
  getLocalUsers(): UserProfile[] {
    try {
      const raw = localStorage.getItem(LOCAL_USERS_KEY);
      if (!raw) {
        // Seed default local demo accounts if none exist
        const initialUsers: UserProfile[] = [
          {
            id: 'demo-admin-id',
            email: 'admin@calcora.io',
            displayName: 'System Admin',
            role: 'admin',
            createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'demo-member-id',
            email: 'member@calcora.io',
            displayName: 'Alex Carter',
            role: 'member',
            createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];
        localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(initialUsers));
        return initialUsers;
      }
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  getLocalActivity(): AdminActivityItem[] {
    try {
      const raw = localStorage.getItem(ADMIN_ACTIVITY_KEY);
      if (!raw) return [];
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },
};
