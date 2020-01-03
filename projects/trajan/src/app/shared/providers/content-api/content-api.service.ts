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
import { ContentDatabaseService } from '../content-database/content-database.service';
import { MeshNode } from '../../models/node.model';
import { ConfigurationService } from '../../../core/configuration/configuration.service';

@Injectable({
  providedIn: 'root'
})
export class ContentApiService<E> {
  apiPath: string;
  projectName: string;
  apiUri: string;
  apiNodeUri: string;
  apiTagfamilyUri: string;
  apiTagUri: string;
  apiSearchNodesUri: string;

  tagFamilyReceiptsUuid: string;
  tagFamilyIngedrientsUuid: string;

  constructor(
    private httpClient: HttpClient,
    private configurationService: ConfigurationService,
    private contentDatabase: ContentDatabaseService<E>
  ) {
    // assign external values
    this.apiPath = this.configurationService.configData.apiPath;
    this.projectName = this.configurationService.configData.projectName;
    this.tagFamilyIngedrientsUuid = this.configurationService.configData.tagFamilyIngedrientsUuid;
    this.tagFamilyReceiptsUuid = this.configurationService.configData.tagFamilyReceiptsUuid;
    // assemble URIs
    this.apiUri = `${this.apiPath}/${this.projectName}`;
    this.apiNodeUri = `${this.apiUri}/nodes`;
    this.apiTagfamilyUri = `${this.apiUri}/tagFamilies`;
    this.apiTagUri = `${this.apiUri}/tags`;
    this.apiSearchNodesUri = `${this.apiUri}/search/nodes`;
  }

  getTagFamiliesAll(): Observable<TagFamilyResponse[]> {
    return this.httpClient
      .get<TagFamilyListResponse>(`${this.apiTagfamilyUri}`)
      .pipe(
        map((items: TagFamilyListResponse) => items.data),
        tap(
          (items: TagFamilyResponse[]) =>
            this.contentDatabase.storeTagFamilies(items)
          // items.forEach(item =>
          //   this.store.dispatch(actionEntitiesTagFamilyAdd({ tagFamily: item }))
          // )
        )
      );
  }

  getTagsOfTagFamily(tagFamilyUuid: string): Observable<TagResponse[]> {
    return this.httpClient
      .get<TagListResponse>(`${this.apiTagfamilyUri}/${tagFamilyUuid}/tags`)
      .pipe(
        map((item: TagListResponse) => item.data),
        tap(
          (items: TagResponse[]) => this.contentDatabase.storeTags(items)
          // items.forEach(item =>
          // this.store.dispatch(actionEntitiesTagAdd({ tag: item }))
          // )
        )
      );
  }

  getTagsAll(): Observable<TagResponse[]> {
    return this.getTagFamiliesAll().pipe(
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
      tap(
        (items: TagResponse[]) => this.contentDatabase.storeTags(items)
        // items.forEach(item =>
        // this.store.dispatch(actionEntitiesTagAdd({ tag: item }))
        // )
      )
    );
  }

  getReceipt(nodeUuid: string): Observable<MeshNode<E>> {
    return this.httpClient
      .get<MeshNode<E>>(`${this.apiNodeUri}/${nodeUuid}`)
      .pipe(
        tap(
          (item: MeshNode<E>) => this.contentDatabase.storeNodes([item])
          // this.store.dispatch(actionEntitiesReceiptAdd({ receipt: item }))
        )
      );
  }

  getNodesAll(): Observable<MeshNode<E>[]> {
    return this.httpClient.get<NodeListResponse<E>>(this.apiNodeUri).pipe(
      map((res: NodeListResponse<E>) => res.data),
      map((items: MeshNode<E>[]) =>
        items.filter(item => item.schema.name === 'Rezept')
      ),
      tap(
        (items: MeshNode<E>[]) => this.contentDatabase.storeNodes(items)
        // items.forEach(item =>
        // this.store.dispatch(actionEntitiesReceiptAdd({ receipt: item }))
        // )
      )
    );
  }

  getReceiptsByTagname(tagName: string): Observable<NodeResponse<E>[]> {
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
      .post<NodeListResponse<E>>(this.apiSearchNodesUri, payload)
      .pipe(
        map((res: NodeListResponse<E>) => res.data),
        map(
          (items: MeshNode<any>[]) =>
            items.filter(item => item.schema.name === 'Rezept') as MeshNode<
              Receipt
            >[]
        ),
        tap(
          (items: MeshNode<E>[]) =>
            this.contentDatabase.storeNodes(items as MeshNode<E>[])
          // items.forEach(item =>
          //   this.store.dispatch(actionEntitiesReceiptAdd({ receipt: item }))
          // )
        )
      );
  }

  getNodeFieldBinaryUrl(nodeUuid: string, fieldName: string): string {
    return `${this.apiNodeUri}/${nodeUuid}/binary/${fieldName}`;
  }
}
