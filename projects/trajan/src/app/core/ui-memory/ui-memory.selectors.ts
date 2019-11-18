import { createSelector } from '@ngrx/store';
import { UiMemoryState } from './ui-memory.model';
import { selectUiMemoryState } from '../core.state';

export const selectUiMemory = createSelector(
  selectUiMemoryState,
  (state: UiMemoryState) => state
);

export const selectUiMemoryFeatureListTabOpenIndex = createSelector(
  selectUiMemoryState,
  (state: UiMemoryState) => state.featureListTabOpenIndex
);
