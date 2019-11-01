import { AppState } from '../core.module';
import { Receipt } from '../../shared/models/receipt.model';
import { NodeResponse } from '../../shared/models/server-models';

export interface EntitiesState {
  receipt: { [uuid: string]: NodeResponse<Receipt> };
}

export interface State extends AppState {
  entities: EntitiesState;
}
