import { AppState } from '../core.module';

export interface UiMemoryState {
  featureListTabOpenIndex: number;
}

export interface State extends AppState {
  uiMemory: UiMemoryState;
}
