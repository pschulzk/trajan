import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../core/core.state';
import { selectUiMemoryIsLoading } from '../../core/ui-memory/ui-memory.selectors';

@Component({
  selector: 'anms-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingScreenComponent implements OnInit {
  /** Indicates whether app displays loading animation hiding entire screen. */
  isLoading$: Observable<boolean>;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.isLoading$ = this.store.pipe(select(selectUiMemoryIsLoading));
  }
}
