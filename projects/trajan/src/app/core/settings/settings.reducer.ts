import { SettingsState, NIGHT_MODE_THEME } from './settings.model';
import {
  actionSettingsChangeAnimationsElements,
  actionSettingsChangeAnimationsPage,
  actionSettingsChangeAnimationsPageDisabled,
  actionSettingsChangeAutoNightMode,
  actionSettingsChangeHour,
  actionSettingsChangeLanguage,
  actionSettingsChangeStickyHeader,
  actionSettingsChangeTheme,
  actionSettingsChangeOnlineState
} from './settings.actions';
import { Action, createReducer, on } from '@ngrx/store';

export const initialState: SettingsState = {
  autoNightMode: false,
  elementsAnimations: true,
  hour: 0,
  language: 'de',
  nightTheme: NIGHT_MODE_THEME,
  online: false,
  pageAnimations: true,
  pageAnimationsDisabled: false,
  stickyHeader: true,
  theme: 'NATURE-THEME'
};

const reducer = createReducer(
  initialState,
  on(
    actionSettingsChangeAnimationsElements,
    actionSettingsChangeAnimationsPage,
    actionSettingsChangeAutoNightMode,
    actionSettingsChangeHour,
    actionSettingsChangeLanguage,
    actionSettingsChangeOnlineState,
    actionSettingsChangeStickyHeader,
    actionSettingsChangeTheme,
    (state, action) => ({ ...state, ...action })
  ),
  on(
    actionSettingsChangeAnimationsPageDisabled,
    (state, { pageAnimationsDisabled }) => ({
      ...state,
      pageAnimationsDisabled,
      pageAnimations: false
    })
  )
);

export function settingsReducer(
  state: SettingsState | undefined,
  action: Action
) {
  return reducer(state, action);
}
