import { UiMemoryState } from './ui-memory.model';
import { actionUiMemoryFeatureListTabOpenIndexSet } from './ui-memory.actions';
import { Action, createReducer, on } from '@ngrx/store';

export const initialState: UiMemoryState = {
  featureListTabOpenIndex: null
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
  )
);

/** Entity State reducer method */
export function UiMemoryReducer(
  state: UiMemoryState | undefined,
  action: Action
) {
  return reducer(state, action);
}
