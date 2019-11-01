import { createAction, props } from '@ngrx/store';
import { Receipt } from '../../shared/models/receipt.model';
import { NodeResponse } from '../../shared/models/server-models';

export const actionEntitiesAddReceipt = createAction(
  '[Entities] Add receipt',
  props<{ receipt: NodeResponse<Receipt> }>()
);
