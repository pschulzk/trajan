import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { LocalStorageService } from '../local-storage/local-storage.service';

import {
  actionEntitiesAddReceipt,
} from './entities.actions';

import { State } from './entities.model';
import { selectEntitiesState } from '../core.state';

export const ENTITIES_KEY = 'ENTITIES';

@Injectable()
export class EntitiesEffects {
  constructor(
    private actions$: Actions,
    private store: Store<State>,
    private localStorageService: LocalStorageService,
  ) {}

  persistSettings = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          actionEntitiesAddReceipt,
        ),
        withLatestFrom(this.store.pipe(select(selectEntitiesState))),
        tap(([action, entities]) =>
          this.localStorageService.setItem(ENTITIES_KEY, entities)
        )
      ),
    { dispatch: false }
  );

}
