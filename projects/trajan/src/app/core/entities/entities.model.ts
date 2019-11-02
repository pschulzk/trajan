import { AppState } from '../core.module';
import { Receipt } from '../../shared/models/receipt.model';
import {
  NodeResponse,
  TagResponse,
  TagFamilyResponse
} from '../../shared/models/server-models';

export interface EntitiesState {
  tag: { [uuid: string]: TagResponse };
  tagFamily: { [uuid: string]: TagFamilyResponse };
  receipt: { [uuid: string]: NodeResponse<Receipt> };
}

export interface State extends AppState {
  entities: EntitiesState;
}
