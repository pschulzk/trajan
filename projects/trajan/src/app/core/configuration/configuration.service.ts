import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '../../../environments/environment';

export interface AppConfig {
  indexedDbName: string;
  schemaReceiptUuid: string;
  tagFamilyIngedrientsUuid: string;
  tagFamilyReceiptsUuid: string;
  apiPath: string;
  projectName: string;
}

/**
 * Fetch external configuration JSON data from path
 * defined in `/<project>/src/environments/<environment>.appConfUrl`.
 */
@Injectable()
export class ConfigurationService {
  private readonly configUrlPath = env.appConfUrl;
  private _configData: AppConfig;

  constructor(private http: HttpClient) {}

  loadConfigurationData() {
    this.http
      .get<AppConfig>(this.configUrlPath)
      .subscribe((response: AppConfig) => {
        this._configData = response;
      });
  }

  get configData(): AppConfig {
    return this._configData;
  }
}
