import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import {
  NodeResponse,
  NodeListResponse,
  TagFamilyListResponse,
  TagListResponse,
  TagFamilyResponse,
  TagResponse
} from '../../models/server-models';
import { Receipt } from '../../models/receipt.model';
import { HttpClient } from '@angular/common/http';
import { map, tap, mergeMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import {
  actionEntitiesReceiptAdd,
  actionEntitiesTagFamilyAdd,
  actionEntitiesTagAdd
} from '../../../core/entities/entities.actions';
import { AppState } from '../../../core/core.state';

@Injectable({
  providedIn: 'root'
})
export class ContentApiService {
  apiPath = 'api/v1';
  projectName = 'trajan';
  apiUri: string;
  apiNodeUri: string;
  apiTagfamilyUri: string;
  apiTagUri: string;
  apiSearchUri = '/api/v2/search';
  apiSearchNodesUri: string;

  tagFamilyReceiptsUuid = '91d53bab0f954a76953bab0f955a7655';
  tagFamilyIngedrientsUuid = 'b9fe4f8fba1f48e4be4f8fba1f78e471';

  constructor(private httpClient: HttpClient, private store: Store<AppState>) {
    // assemble URIs
    this.apiUri = `/${this.apiPath}/${this.projectName}`;
    this.apiNodeUri = `/${this.apiPath}/${this.projectName}/nodes`;
    this.apiTagfamilyUri = `/${this.apiPath}/${this.projectName}/tagFamilies`;
    this.apiTagUri = `/${this.apiPath}/${this.projectName}/tags`;
    this.apiSearchNodesUri = `${this.apiSearchUri}/nodes`;
  }

  getTagFamiliesOfProject(): Observable<TagFamilyResponse[]> {
    return this.httpClient
      .get<TagFamilyListResponse>(`${this.apiTagfamilyUri}`)
      .pipe(
        map((items: TagFamilyListResponse) => items.data),
        tap((items: TagFamilyResponse[]) =>
          items.forEach(item =>
            this.store.dispatch(actionEntitiesTagFamilyAdd({ tagFamily: item }))
          )
        )
      );
  }

  getTagsOfTagFamily(tagFamilyUuid: string): Observable<TagResponse[]> {
    return this.httpClient
      .get<TagListResponse>(`${this.apiTagfamilyUri}/${tagFamilyUuid}/tags`)
      .pipe(
        map((item: TagListResponse) => item.data),
        tap((items: TagResponse[]) =>
          items.forEach(item =>
            this.store.dispatch(actionEntitiesTagAdd({ tag: item }))
          )
        )
      );
  }

  getTagsAll(): Observable<TagResponse[]> {
    return this.getTagFamiliesOfProject().pipe(
      mergeMap((items: TagFamilyResponse[]) =>
        forkJoin(
          items.map((item: TagFamilyResponse) => {
            return this.getTagsOfTagFamily(item.uuid);
          })
        )
      ),
      map((items: TagResponse[][]) => [].concat(...items))
    );
  }

  getReceiptCategories(): Observable<TagResponse[]> {
    return this.getTagsOfTagFamily(this.tagFamilyReceiptsUuid).pipe(
      tap((items: TagResponse[]) =>
        items.forEach(item =>
          this.store.dispatch(actionEntitiesTagAdd({ tag: item }))
        )
      )
    );
  }

  getReceipt(nodeUuid: string): Observable<NodeResponse<Receipt>> {
    return this.httpClient
      .get<NodeResponse<Receipt>>(`${this.apiNodeUri}/${nodeUuid}`)
      .pipe(
        tap((item: NodeResponse<Receipt>) =>
          this.store.dispatch(actionEntitiesReceiptAdd({ receipt: item }))
        )
      );
  }

  getReceiptsOfProject(): Observable<NodeResponse<Receipt>[]> {
    return this.httpClient.get<NodeListResponse<Receipt>>(this.apiNodeUri).pipe(
      map((res: NodeListResponse<Receipt>) => res.data),
      map(
        (items: NodeResponse<Receipt>[]) =>
          items.filter(item => item.schema.name === 'Rezept') as NodeResponse<
            Receipt
          >[]
      ),
      tap((items: NodeResponse<Receipt>[]) =>
        items.forEach(item =>
          this.store.dispatch(actionEntitiesReceiptAdd({ receipt: item }))
        )
      )
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
    return this.httpClient
      .post<NodeListResponse<Receipt>>(this.apiSearchNodesUri, payload)
      .pipe(
        map((res: NodeListResponse<Receipt>) => res.data),
        map(
          (items: NodeResponse<any>[]) =>
            items.filter(item => item.schema.name === 'Rezept') as NodeResponse<
              Receipt
            >[]
        ),
        tap((items: NodeResponse<Receipt>[]) =>
          items.forEach(item =>
            this.store.dispatch(actionEntitiesReceiptAdd({ receipt: item }))
          )
        )
      );
  }

  getNodeFieldBinaryUrl(nodeUuid: string, fieldName: string): string {
    return `${this.apiNodeUri}/${nodeUuid}/binary/${fieldName}`;
  }
}
