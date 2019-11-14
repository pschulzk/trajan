import { AppState } from '../core.module';

export const NIGHT_MODE_THEME = 'BLACK-THEME';

export type Language = 'en' | 'sk' | 'de' | 'fr' | 'es' | 'pt-br' | 'he';

export interface SettingsState {
  autoNightMode: boolean;
  elementsAnimations: boolean;
  hour: number;
  language: string;
  nightTheme: string;
  online: boolean;
  pageAnimations: boolean;
  pageAnimationsDisabled: boolean;
  stickyHeader: boolean;
  theme: string;
}

export interface State extends AppState {
  settings: SettingsState;
}
