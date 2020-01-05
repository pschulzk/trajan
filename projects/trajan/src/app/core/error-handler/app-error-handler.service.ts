import { Injectable, ErrorHandler } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { NotificationService } from '../notifications/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';

/** Application-wide error handler that adds a UI notification to the error handling
 * provided by the default Angular ErrorHandler.
 */
@Injectable()
export class AppErrorHandler extends ErrorHandler {
  constructor(
    private notificationsService: NotificationService,
    private translateService: TranslateService
  ) {
    super();
  }

  handleError(error: Error | HttpErrorResponse): void {
    let displayMessage = 'An error occurred.';

    if (!environment.production) {
      displayMessage += ' See console for details.';
    }

    this.notificationsService.error(displayMessage);

    super.handleError(error);
  }

  handleErrorEntityNotFound(): Promise<unknown> {
    return this.translateService
      .get('anms.error.notfound.entity')
      .pipe(
        map((displayMessage: string) =>
          this.notificationsService.error(displayMessage)
        )
      )
      .toPromise();
  }
}
