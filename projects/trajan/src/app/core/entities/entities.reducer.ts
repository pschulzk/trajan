import { EntitiesState } from './entities.model';
import {
  actionEntitiesTagAdd,
  actionEntitiesTagFamilyAdd,
  actionEntitiesReceiptAdd
} from './entities.actions';
import { Action, createReducer, on } from '@ngrx/store';

export const initialState: EntitiesState = {
  receipt: undefined,
  tag: undefined,
  tagFamily: undefined
};

/** Entity State reducer */
const reducer = createReducer(
  initialState,
  on(
    actionEntitiesReceiptAdd,
    actionEntitiesTagAdd,
    actionEntitiesTagFamilyAdd,
    (state, action) =>
      Object.keys(action)
        .map((key: string) => {
          if (!['receipt', 'tag', 'tagFamily'].includes(key)) {
            return;
          }
          const newState = { ...state };
          if (!newState[key]) {
            newState[key] = {};
          }
          newState[key][action[key].uuid] = action[key];
          return newState;
        })
        .reduce((p, c) => ({ ...p, ...c }), { ...state })
  )
);

/** Entity State reducer method */
export function entitiesReducer(
  state: EntitiesState | undefined,
  action: Action
) {
  return reducer(state, action);
}
