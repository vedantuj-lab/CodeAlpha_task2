import React, { useState, useEffect } from 'react';
import { Sliders, Save, Check, RefreshCw } from 'lucide-react';
import { adminService } from '../services/adminService';
import { useAuth } from '../context/AuthContext';
import { AppConfigSettings } from '../types';

export const AdminSettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [config, setConfig] = useState<AppConfigSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    setLoading(true);
    const data = await adminService.getAppConfig();
    setConfig(data);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;

    setSaving(true);
    await adminService.saveAppConfig(config, user?.id || 'admin');
    setSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  if (loading || !config) {
    return (
      <div className="p-12 text-center text-xs text-[var(--text-secondary)]">
        Loading calculator configuration...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-heading font-bold text-[var(--text-primary)]">
          Calculator Configuration
        </h1>
        <p className="text-xs text-[var(--text-secondary)]">
          Configure default application policies and mathematical environment parameters.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-600 text-xs text-emerald-400 flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Application configuration updated and recorded in activity log.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="p-6 rounded-2xl bg-[var(--surface-calc)] border border-[var(--border-primary)] space-y-6">
        <div className="space-y-4 text-xs">
          {/* Default Theme */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3 border-b border-[var(--border-subtle)]">
            <div>
              <p className="font-semibold text-[var(--text-primary)]">Global Default Theme</p>
              <p className="text-[var(--text-secondary)]">Initial theme loaded for first-time visitors</p>
            </div>
            <select
              value={config.defaultTheme}
              onChange={(e) => setConfig({ ...config, defaultTheme: e.target.value as any })}
              className="px-3 py-1.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-primary)] text-[var(--text-primary)] text-xs focus:outline-none"
            >
              <option value="dark">Dark Theme (#151715)</option>
              <option value="light">Light Theme (#F7F6F0)</option>
            </select>
          </div>

          {/* Default Calculator Mode */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3 border-b border-[var(--border-subtle)]">
            <div>
              <p className="font-semibold text-[var(--text-primary)]">Default Calculator Layout</p>
              <p className="text-[var(--text-secondary)]">Standard arithmetic or full scientific panel</p>
            </div>
            <select
              value={config.defaultCalculatorMode}
              onChange={(e) => setConfig({ ...config, defaultCalculatorMode: e.target.value as any })}
              className="px-3 py-1.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-primary)] text-[var(--text-primary)] text-xs focus:outline-none"
            >
              <option value="standard">Standard Calculator</option>
              <option value="scientific">Scientific Calculator</option>
            </select>
          </div>

          {/* Default Angle Mode */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3 border-b border-[var(--border-subtle)]">
            <div>
              <p className="font-semibold text-[var(--text-primary)]">Default Angular Mode</p>
              <p className="text-[var(--text-secondary)]">Angle unit used for trigonometric evaluations</p>
            </div>
            <select
              value={config.defaultAngleMode}
              onChange={(e) => setConfig({ ...config, defaultAngleMode: e.target.value as any })}
              className="px-3 py-1.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-primary)] text-[var(--text-primary)] text-xs focus:outline-none"
            >
              <option value="deg">Degrees (DEG)</option>
              <option value="rad">Radians (RAD)</option>
            </select>
          </div>

          {/* Max Stored History */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3 border-b border-[var(--border-subtle)]">
            <div>
              <p className="font-semibold text-[var(--text-primary)]">Max Stored History Limit</p>
              <p className="text-[var(--text-secondary)]">Maximum equations retained per user ledger</p>
            </div>
            <input
              type="number"
              min={10}
              max={500}
              value={config.maxStoredHistoryEntries}
              onChange={(e) =>
                setConfig({ ...config, maxStoredHistoryEntries: parseInt(e.target.value) || 100 })
              }
              className="w-24 px-3 py-1.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-primary)] text-[var(--text-primary)] text-xs font-mono focus:outline-none"
            />
          </div>

          {/* Feature toggles */}
          <div className="flex items-center justify-between py-3 border-b border-[var(--border-subtle)]">
            <div>
              <p className="font-semibold text-[var(--text-primary)]">Enable Scientific Functions</p>
              <p className="text-[var(--text-secondary)]">Allow users to access trigonometry, logarithms & powers</p>
            </div>
            <input
              type="checkbox"
              checked={config.enableScientificMode}
              onChange={(e) => setConfig({ ...config, enableScientificMode: e.target.checked })}
              className="w-4 h-4 accent-[var(--accent-orange)] rounded"
            />
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-semibold text-[var(--text-primary)]">Enable Saved Calculations</p>
              <p className="text-[var(--text-secondary)]">Allow bookmarking calculations to user profile</p>
            </div>
            <input
              type="checkbox"
              checked={config.enableSavedCalculations}
              onChange={(e) => setConfig({ ...config, enableSavedCalculations: e.target.checked })}
              className="w-4 h-4 accent-[var(--accent-orange)] rounded"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-[var(--accent-orange)] text-[#151715] hover:bg-[var(--accent-orange-hover)] transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            {saving ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
