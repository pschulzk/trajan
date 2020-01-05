import { UiMemoryState } from './ui-memory.model';
import {
  actionUiMemoryFeatureListTabOpenIndexSet,
  actionUiMemoryIsLoading
} from './ui-memory.actions';
import { Action, createReducer, on } from '@ngrx/store';

export const initialState: UiMemoryState = {
  featureListTabOpenIndex: null,
  isLoading: true
};

/** Entity State reducer */
const reducer = createReducer(
  initialState,
  on(
    actionUiMemoryFeatureListTabOpenIndexSet,
    (state, { featureListTabOpenIndex }) => ({
      ...state,
      featureListTabOpenIndex
    })
  ),
  on(actionUiMemoryIsLoading, (state, { isLoading }) => ({
    ...state,
    isLoading
  }))
);

/** Entity State reducer method */
export function UiMemoryReducer(
  state: UiMemoryState | undefined,
  action: Action
) {
  return reducer(state, action);
}
