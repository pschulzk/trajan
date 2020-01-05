import { AppState } from '../core.module';

export interface UiMemoryState {
  featureListTabOpenIndex: number;
  isLoading: boolean;
}

export interface State extends AppState {
  uiMemory: UiMemoryState;
}
