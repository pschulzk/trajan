import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '../../../environments/environment';

export interface AppConfigData {
  indexedDbName: string;
  tagFamilyIngedrientsUuid: string;
  tagFamilyReceiptsUuid: string;
}

@Injectable()
export class ConfigurationService {
  private readonly configUrlPath = env.appConfUrl;
  private _configData: AppConfigData;

  constructor(private http: HttpClient) {}

  loadConfigurationData() {
    this.http
      .get<AppConfigData>(this.configUrlPath)
      .subscribe((result: AppConfigData) => {
        this._configData = result;
        console.log('!!! ConfigurationService.configData:', this._configData);
      });
  }

  get configData(): AppConfigData {
    return this._configData;
  }
}
