import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Shield, Check, LogOut, Sliders } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { preferencesService } from '../services/preferencesService';
import { AngleMode, CalculatorMode, ThemeMode, UserPreferences } from '../types';

export const MemberProfilePage: React.FC = () => {
  const { user, updateProfileName, logout, isSupabaseConnected } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [nameSaved, setNameSaved] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'dark',
    defaultCalculatorMode: 'standard',
    defaultAngleMode: 'deg',
    maxStoredHistory: 50,
  });
  const [prefSaved, setPrefSaved] = useState(false);

  useEffect(() => {
    if (user?.displayName) {
      setDisplayName(user.displayName);
    }
    preferencesService.getPreferences(user?.id).then(setPreferences);
  }, [user]);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;

    const ok = await updateProfileName(displayName.trim());
    if (ok) {
      setNameSaved(true);
      setTimeout(() => setNameSaved(false), 2000);
    }
  };

  const handleSavePreferences = async (newPrefs: Partial<UserPreferences>) => {
    const updated = await preferencesService.savePreferences(newPrefs, user?.id);
    setPreferences(updated);
    if (newPrefs.theme) {
      setTheme(newPrefs.theme);
    }
    setPrefSaved(true);
    setTimeout(() => setPrefSaved(false), 2000);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-heading font-bold text-[var(--text-primary)]">
          Profile & Preferences
        </h1>
        <p className="text-xs text-[var(--text-secondary)]">
          Manage your personal workspace settings and account details.
        </p>
      </div>

      {/* Account Info Card */}
      <div className="p-6 rounded-2xl bg-[var(--surface-calc)] border border-[var(--border-primary)] space-y-5">
        <h2 className="font-heading font-bold text-base text-[var(--text-primary)] flex items-center gap-2">
          <User className="w-4 h-4 text-[var(--accent-lime)]" />
          <span>Account Credentials</span>
        </h2>

        <form onSubmit={handleUpdateName} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-1 font-semibold">
              Email Address (Authenticated)
            </label>
            <input
              type="text"
              disabled
              value={user?.email || ''}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] font-mono cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-1 font-semibold">
              Display Name
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-primary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-lime)]"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[var(--accent-lime)] text-[#151715] hover:bg-[var(--accent-lime-hover)] transition-colors flex items-center gap-1.5"
              >
                {nameSaved ? <Check className="w-4 h-4" /> : null}
                <span>{nameSaved ? 'Saved' : 'Update Name'}</span>
              </button>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--surface-calc-secondary)] border border-[var(--border-subtle)] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[var(--accent-orange)]" />
              <span>Assigned Security Role:</span>
            </div>
            <span className="font-mono font-bold uppercase text-[var(--accent-lime)]">
              {user?.role || 'member'}
            </span>
          </div>
        </form>
      </div>

      {/* Calculator Personalization Settings */}
      <div className="p-6 rounded-2xl bg-[var(--surface-calc)] border border-[var(--border-primary)] space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-bold text-base text-[var(--text-primary)] flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[var(--accent-lime)]" />
            <span>Calculation Preferences</span>
          </h2>
          {prefSaved && (
            <span className="text-xs text-[var(--accent-lime)] font-mono flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              Preferences synchronized
            </span>
          )}
        </div>

        <div className="space-y-4 text-xs">
          {/* Theme Preference */}
          <div className="flex items-center justify-between py-2 border-b border-[var(--border-subtle)]">
            <div>
              <p className="font-semibold text-[var(--text-primary)]">Interface Theme</p>
              <p className="text-[var(--text-secondary)]">Dark charcoal or high-contrast light mode</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleSavePreferences({ theme: 'dark' })}
                className={`px-3 py-1.5 rounded-lg border font-mono ${
                  preferences.theme === 'dark'
                    ? 'bg-[var(--accent-lime)] text-[#151715] border-[var(--accent-lime)] font-bold'
                    : 'bg-[var(--surface-calc-secondary)] border-[var(--border-subtle)] text-[var(--text-secondary)]'
                }`}
              >
                Dark
              </button>
              <button
                onClick={() => handleSavePreferences({ theme: 'light' })}
                className={`px-3 py-1.5 rounded-lg border font-mono ${
                  preferences.theme === 'light'
                    ? 'bg-[var(--accent-lime)] text-[#151715] border-[var(--accent-lime)] font-bold'
                    : 'bg-[var(--surface-calc-secondary)] border-[var(--border-subtle)] text-[var(--text-secondary)]'
                }`}
              >
                Light
              </button>
            </div>
          </div>

          {/* Default Calculator Mode */}
          <div className="flex items-center justify-between py-2 border-b border-[var(--border-subtle)]">
            <div>
              <p className="font-semibold text-[var(--text-primary)]">Default Calculator Mode</p>
              <p className="text-[var(--text-secondary)]">Choose view upon opening workspace</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleSavePreferences({ defaultCalculatorMode: 'standard' })}
                className={`px-3 py-1.5 rounded-lg border font-mono ${
                  preferences.defaultCalculatorMode === 'standard'
                    ? 'bg-[var(--accent-lime)] text-[#151715] border-[var(--accent-lime)] font-bold'
                    : 'bg-[var(--surface-calc-secondary)] border-[var(--border-subtle)] text-[var(--text-secondary)]'
                }`}
              >
                Standard
              </button>
              <button
                onClick={() => handleSavePreferences({ defaultCalculatorMode: 'scientific' })}
                className={`px-3 py-1.5 rounded-lg border font-mono ${
                  preferences.defaultCalculatorMode === 'scientific'
                    ? 'bg-[var(--accent-lime)] text-[#151715] border-[var(--accent-lime)] font-bold'
                    : 'bg-[var(--surface-calc-secondary)] border-[var(--border-subtle)] text-[var(--text-secondary)]'
                }`}
              >
                Scientific
              </button>
            </div>
          </div>

          {/* Default Angle Mode */}
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-semibold text-[var(--text-primary)]">Trigonometric Angular Unit</p>
              <p className="text-[var(--text-secondary)]">Default angle calculation unit</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleSavePreferences({ defaultAngleMode: 'deg' })}
                className={`px-3 py-1.5 rounded-lg border font-mono ${
                  preferences.defaultAngleMode === 'deg'
                    ? 'bg-[var(--accent-lime)] text-[#151715] border-[var(--accent-lime)] font-bold'
                    : 'bg-[var(--surface-calc-secondary)] border-[var(--border-subtle)] text-[var(--text-secondary)]'
                }`}
              >
                Degrees (DEG)
              </button>
              <button
                onClick={() => handleSavePreferences({ defaultAngleMode: 'rad' })}
                className={`px-3 py-1.5 rounded-lg border font-mono ${
                  preferences.defaultAngleMode === 'rad'
                    ? 'bg-[var(--accent-lime)] text-[#151715] border-[var(--accent-lime)] font-bold'
                    : 'bg-[var(--surface-calc-secondary)] border-[var(--border-subtle)] text-[var(--text-secondary)]'
                }`}
              >
                Radians (RAD)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Action */}
      <div className="pt-2 flex justify-start">
        <button
          onClick={handleLogout}
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#C83C42] border border-[#C83C42]/30 hover:bg-red-500/10 transition-colors flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of Account</span>
        </button>
      </div>
    </div>
  );
};
