import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      className={`relative inline-flex items-center justify-center p-2 rounded-lg border border-[var(--border-primary)] bg-[var(--surface-calc)] text-[var(--text-primary)] hover:border-[var(--accent-lime)] hover:text-[var(--accent-lime)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-lime)] ${className}`}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-[#F29B63]" />
      ) : (
        <Moon className="w-4 h-4 text-[#20251F]" />
      )}
    </button>
  );
};
