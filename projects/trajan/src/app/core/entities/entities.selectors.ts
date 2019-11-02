import { createSelector } from '@ngrx/store';

import { EntitiesState } from './entities.model';
import { selectEntitiesState } from '../core.state';

export const selectEntities = createSelector(
  selectEntitiesState,
  (state: EntitiesState) => state
);

export const selectEntitiesReceipts = createSelector(
  selectEntities,
  (state: EntitiesState) => state.receipt
);

export const selectEntitiesTags = createSelector(
  selectEntities,
  (state: EntitiesState) => state.tag
);

export const selectEntitiesTagFamilies = createSelector(
  selectEntities,
  (state: EntitiesState) => state.tagFamily
);
