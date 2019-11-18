import { createAction, props } from '@ngrx/store';

export const actionUiMemoryFeatureListTabOpenIndexSet = createAction(
  '[uiMemory] Set FeatureListTabOpenIndex',
  props<{ featureListTabOpenIndex: number }>()
);
