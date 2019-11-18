import browser from 'browser-detect';
import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { fromEvent, Observable } from 'rxjs';

import { environment as env } from '../../environments/environment';

import {
  authLogin,
  authLogout,
  routeAnimations,
  AppState,
  LocalStorageService,
  // selectIsAuthenticated,
  selectSettingsStickyHeader,
  selectSettingsLanguage,
  selectEffectiveTheme
} from '../core/core.module';
import {
  actionSettingsChangeAnimationsPageDisabled,
  actionSettingsChangeLanguage
} from '../core/settings/settings.actions';
import { DOCUMENT } from '@angular/common';
import { WINDOW } from '../shared/providers/window/window.service';
import { throttleTime, map } from 'rxjs/operators';

@Component({
  selector: 'anms-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeAnimations]
})
export class AppComponent implements AfterViewInit, OnInit {
  isProd = env.production;
  envName = env.envName;
  version = env.versions.app;
  year = new Date().getFullYear();
  // logo = require('../../assets/logo.png');
  languages = ['de', 'en', 'sk', 'fr', 'es', 'pt-br', 'zh-cn', 'he'];
  navigation = [{ link: 'feature-list', label: 'anms.menu.receipts' }];
  navigationSideMenu = [
    ...this.navigation,
    { link: 'settings', label: 'anms.menu.settings' }
  ];

  // isAuthenticated$: Observable<boolean>;
  stickyHeader$: Observable<boolean>;
  language$: Observable<string>;
  theme$: Observable<string>;

  /** scroll distance from top */
  userHasScrolled$: Observable<boolean>;

  brandName = 'HabIchDaheim';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW) private window: Window,
    private store: Store<AppState>,
    private storageService: LocalStorageService
  ) {}

  private static isIEorEdgeOrSafari(): boolean {
    return ['ie', 'edge', 'safari'].includes(browser().name);
  }

  ngOnInit(): void {
    this.storageService.testLocalStorage();
    if (AppComponent.isIEorEdgeOrSafari()) {
      this.store.dispatch(
        actionSettingsChangeAnimationsPageDisabled({
          pageAnimationsDisabled: true
        })
      );
    }

    // this.isAuthenticated$ = this.store.pipe(select(selectIsAuthenticated));
    this.stickyHeader$ = this.store.pipe(select(selectSettingsStickyHeader));
    this.language$ = this.store.pipe(select(selectSettingsLanguage));
    this.theme$ = this.store.pipe(select(selectEffectiveTheme));
  }

  ngAfterViewInit(): void {
    // get scroll distance from top (windows.offsetY won't work)
    const content = document.querySelector('.mat-sidenav-content');
    this.userHasScrolled$ = fromEvent(content, 'scroll').pipe(
      throttleTime(10), // only emit every 10 ms
      map(() => content.scrollTop > 0) // get vertical scroll position
    );
  }

  onLoginClick() {
    this.store.dispatch(authLogin());
  }

  onLogoutClick() {
    this.store.dispatch(authLogout());
  }

  onLanguageSelect({ value: language }) {
    this.store.dispatch(actionSettingsChangeLanguage({ language }));
  }
}
