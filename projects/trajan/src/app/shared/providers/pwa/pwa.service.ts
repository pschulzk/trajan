import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { BeforeInstallPromptEvent } from '../../models/beforeinstallprompt-event';

/**
 * Download newer version of PWA if available.
 */
@Injectable({
  providedIn: 'root'
})
export class PwaService {
  promptEvent: BeforeInstallPromptEvent;

  constructor(private swUpdate: SwUpdate) {
    this.swUpdate.available.subscribe(() => window.location.reload());

    window.addEventListener(
      'beforeinstallprompt',
      (event: BeforeInstallPromptEvent) => {
        this.promptEvent = event;
      }
    );
  }
}
