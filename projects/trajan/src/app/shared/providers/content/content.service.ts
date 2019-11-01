import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NodeResponse, NodeListResponse, TagFamilyListResponse, TagListResponse, TagFamilyResponse, TagResponse } from '../../models/server-models';
import { Receipt } from '../../models/receipt.model';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { EntitiesState } from '../../../core/entities/entities.model';
import { actionEntitiesAddReceipt } from '../../../core/entities/entities.actions';
import { AppState } from '../../../core/core.state';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  apiPath = 'api/v1';
  projectName = 'trajan';
  apiUri: string;
  apiNodeUri: string;
  apiTagfamilyUri: string;
  apiTagUri: string;
  apiSearchUri = '/api/v2/search';
  apiSearchNodesUri: string;

  tagFamilyReceiptsUuid = '179100da2deb4d0a9100da2debcd0af5';
  tagFamilyIngedrientsUuid = 'ec95a3920a4c42cb95a3920a4c32cba6';

  constructor(
    private httpClient: HttpClient,
    private store: Store<AppState>,
  ) {
    // assemble URIs
    this.apiUri = `/${this.apiPath}/${this.projectName}`;
    this.apiNodeUri = `/${this.apiPath}/${this.projectName}/nodes`;
    this.apiTagfamilyUri = `/${this.apiPath}/${this.projectName}/tagFamilies`;
    this.apiTagUri = `/${this.apiPath}/${this.projectName}/tags`;
    this.apiSearchNodesUri = `${this.apiSearchUri}/nodes`;
  }

  getTagFamiliesOfProject(): Observable<TagFamilyResponse[]> {
    return this.httpClient.get<TagFamilyListResponse>(`${this.apiTagfamilyUri}`).pipe(
      map((tagFamilies: TagFamilyListResponse) => tagFamilies.data),
      // tap((tagFamilies: TagFamilyResponse[]) => console.log('!!! ContentService.getTagFamilies:', tagFamilies)),
    );
  }

  getTagsOfTagFamily(tagFamilyUuid: string): Observable<TagResponse[]> {
    return this.httpClient.get<TagListResponse>(`${this.apiTagfamilyUri}/${tagFamilyUuid}/tags`).pipe(
      map((tags: TagListResponse) => tags.data),
      // tap((tags: TagResponse[]) => console.log('!!! ContentService.getTagsOfTagFamily:', tags)),
    );
  }

  getReceiptCategories(): Observable<TagResponse[]> {
    return this.getTagsOfTagFamily(this.tagFamilyReceiptsUuid).pipe(
      // tap((tags: TagResponse[]) => console.log('!!! ContentService.getReceiptCategories:', tags)),
    );
  }

  getReceipt(nodeUuid: string): Observable<NodeResponse<Receipt>> {
    return this.httpClient.get<NodeResponse<Receipt>>(`${this.apiNodeUri}/${nodeUuid}`);
  }

  getReceiptsOfProject(): Observable<NodeResponse<Receipt>[]> {
    return this.httpClient.get<NodeListResponse<Receipt>>(this.apiNodeUri).pipe(
      map((res: NodeListResponse<Receipt>) => res.data),
      map((nodes: NodeResponse<any>[]) => nodes.filter(node => node.schema.name === 'Rezept') as NodeResponse<Receipt>[]),
      tap((nodes: NodeResponse<any>[]) => nodes.forEach(node => this.store.dispatch(actionEntitiesAddReceipt({ receipt: node })))),
    );
  }

  getReceiptsByTagname(tagName: string): Observable<NodeResponse<Receipt>[]> {
    const payload = {
      query: {
        nested: {
          path: 'tags',
          query: {
            bool: {
              must: [
                {
                  match_phrase: {
                    'tags.name': tagName
                  }
                }
              ]
            }
          }
        }
      }
    };
    return this.httpClient.post<NodeListResponse<Receipt>>(this.apiSearchNodesUri, payload).pipe(
      map((res: NodeListResponse<Receipt>) => res.data),
      map((nodes: NodeResponse<any>[]) => nodes.filter(node => node.schema.name === 'Rezept') as NodeResponse<Receipt>[]),
    );
  }

  getNodeFieldBinaryUrl(nodeUuid: string, fieldName: string): string {
    return `${this.apiNodeUri}/${nodeUuid}/binary/${fieldName}`;
  }

}
