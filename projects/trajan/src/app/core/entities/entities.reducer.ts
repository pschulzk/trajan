import { EntitiesState } from './entities.model';
import {
  actionEntitiesAddReceipt,
} from './entities.actions';
import { Action, createReducer, on } from '@ngrx/store';

export const initialState: EntitiesState = {
  receipt: undefined,
};

const reducer = createReducer(
  initialState,
  on(
    actionEntitiesAddReceipt,
    (state, action) => {
      const newState = { ...state };
      if (!newState.receipt) {
        newState.receipt = {};
      }
      newState.receipt[action.receipt.uuid] = action.receipt;
      return newState;
    }
  ),
);

export function entitiesReducer(
  state: EntitiesState | undefined,
  action: Action
) {
  return reducer(state, action);
}
