import { createAction, props } from '@ngrx/store';
import { Receipt } from '../../shared/models/receipt.model';
import {
  NodeResponse,
  TagResponse,
  TagFamilyResponse
} from '../../shared/models/server-models';

export const actionEntitiesReceiptAdd = createAction(
  '[Entities] Add receipt',
  props<{ receipt: NodeResponse<Receipt> }>()
);

export const actionEntitiesTagAdd = createAction(
  '[Entities] Add tag',
  props<{ tag: TagResponse }>()
);

export const actionEntitiesTagFamilyAdd = createAction(
  '[Entities] Add tagFamily',
  props<{ tagFamily: TagFamilyResponse }>()
);
