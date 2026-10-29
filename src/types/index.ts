export type AngleMode = 'deg' | 'rad';
export type CalculatorMode = 'standard' | 'scientific';
export type ThemeMode = 'dark' | 'light';
export type UserRole = 'member' | 'admin';

export interface HistoryItem {
  id: string;
  userId?: string;
  expression: string;
  result: string;
  numericResult?: number;
  mode: CalculatorMode;
  angleMode: AngleMode;
  timestamp: number; // Unix timestamp
  createdAt?: string;
}

export interface SavedCalculation {
  id: string;
  userId?: string;
  title: string;
  expression: string;
  result: string;
  numericResult?: number;
  mode: CalculatorMode;
  angleMode: AngleMode;
  createdAt: number;
  updatedAt: number;
}

export interface UserPreferences {
  theme: ThemeMode;
  defaultCalculatorMode: CalculatorMode;
  defaultAngleMode: AngleMode;
  maxStoredHistory: number;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AdminActivityItem {
  id: string;
  actorUserId: string;
  actorEmail?: string;
  action: string;
  targetType: string;
  targetId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface AppConfigSettings {
  defaultTheme: ThemeMode;
  defaultCalculatorMode: CalculatorMode;
  defaultAngleMode: AngleMode;
  maxStoredHistoryEntries: number;
  enableScientificMode: boolean;
  enableSavedCalculations: boolean;
  updatedAt: string;
}
