import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap, withLatestFrom } from 'rxjs/operators';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { State } from './ui-memory.model';
import { selectUiMemoryState } from '../core.state';
import { actionUiMemoryFeatureListTabOpenIndexSet } from './ui-memory.actions';

export const UiMemory_KEY = 'UI_MEMORY';

@Injectable()
export class UiMemoryEffects {
  constructor(
    private actions$: Actions,
    private store: Store<State>,
    private localStorageService: LocalStorageService
  ) {}

  persistSettings = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actionUiMemoryFeatureListTabOpenIndexSet),
        withLatestFrom(this.store.pipe(select(selectUiMemoryState))),
        tap(([action, uiMemory]) =>
          this.localStorageService.setItem(UiMemory_KEY, uiMemory)
        )
      ),
    { dispatch: false }
  );
}
