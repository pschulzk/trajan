import { Injectable } from '@angular/core';
import { SettingsState } from '../../../core/settings/settings.model';
import { Store } from '@ngrx/store';
import { actionSettingsChangeOnlineState } from '../../../core/settings/settings.actions';

@Injectable({
  providedIn: 'root'
})
export class ConnectionStateService {
  get isOnline() {
    return !!window.navigator.onLine;
  }

  constructor(private store: Store<SettingsState>) {
    window.addEventListener('online', () => this.updateOnlineStatus());
    window.addEventListener('offline', () => this.updateOnlineStatus());

    console.log(`!!! ${this.constructor.name}.isOnline:`, this.isOnline);
  }

  private updateOnlineStatus() {
    this.store.dispatch(
      actionSettingsChangeOnlineState({ online: this.isOnline })
    );
  }
}
