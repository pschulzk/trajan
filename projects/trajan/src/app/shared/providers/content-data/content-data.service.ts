import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { normalize, schema } from 'normalizr';
// import normalize from 'json-api-normalizer';
import {
  NodeResponse,
  TagFamilyResponse,
  TagResponse
} from '../../models/server-models';
import { Receipt } from '../../models/receipt.model';
import { map, tap, filter } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../core/core.state';
import { ContentApiService } from '../content-api/content-api.service';
import {
  selectEntitiesTags,
  selectEntitiesTagFamilies,
  selectEntitiesReceipts
} from '../../../core/entities/entities.selectors';
import { ContentIndexedDbService } from '../content-indexeddb/content-indexeddb.service';
import {
  meshSchema,
  meshMicroschema,
  meshNodeFieldMicronode,
  projectReference,
  meshNodeReference,
  userNodeReference,
  meshUser,
  meshRole,
  meshGroup,
  meshTagFamily,
  meshTag,
  meshNodeChildren,
  meshNode
} from '../../schemas/mesh-schemas';

@Injectable({
  providedIn: 'root'
})
export class ContentDataService {
  tags$: Observable<TagResponse[]>;
  indexedDbServiceTags: ContentIndexedDbService;

  tagFamilies$: Observable<TagFamilyResponse[]>;
  indexedDbServiceTagFamilies: ContentIndexedDbService;

  receipts$: Observable<NodeResponse<Receipt>[]>;
  indexedDbServiceReceipts: ContentIndexedDbService;

  tagFamilyReceiptsUuid = '91d53bab0f954a76953bab0f955a7655';
  tagFamilyIngedrientsUuid = 'b9fe4f8fba1f48e4be4f8fba1f78e471';

  // getSchemaObjectKeysFromJson(data: Object): any {
  //   const objectKeys = [];
  //   const parseObject = (obj: Object): void => {
  //     Object.keys(obj).forEach((key: string) => {
  //       const objCheck = obj[key];
  //       if (objCheck instanceof Object) {
  //         objectKeys.push(key);
  //         if (Object.keys(objCheck).length > 0) {
  //           parseObject(objCheck);
  //         }
  //       } else if (objCheck instanceof Array) {
  //         objectKeys.push(key);
  //         if (objCheck.length > 0) {
  //           parseObject(objCheck[0]);
  //         }
  //       } else {
  //         return;
  //       }
  //     });
  //   }
  //   parseObject(data);
  //   return objectKeys;
  // }

  constructor(
    private contentApi: ContentApiService,
    private store: Store<AppState>
  ) {
    // load entities
    this.contentApi.getTagFamiliesOfProject().toPromise();
    this.contentApi.getTagsAll().toPromise();
    this.contentApi
      .getReceiptsOfProject()
      .toPromise()
      .then((receipts: NodeResponse<Receipt>[]) => {
        console.log('!!! receipts:', receipts);
        const normalizedData = normalize(receipts, [meshNode]);
        console.log('!!! normalizedData:', normalizedData);
      });

    // get existing entities from state
    this.tags$ = this.store.pipe(select(selectEntitiesTags)).pipe(
      filter((itemsIndexed: { [uuid: string]: TagResponse }) => !!itemsIndexed),
      map(itemsIndexed => Object.values(itemsIndexed))
    );
    this.tagFamilies$ = this.store.pipe(select(selectEntitiesTagFamilies)).pipe(
      filter(
        (itemsIndexed: { [uuid: string]: TagFamilyResponse }) => !!itemsIndexed
      ),
      map(itemsIndexed => Object.values(itemsIndexed))
    );
    this.receipts$ = this.store.pipe(select(selectEntitiesReceipts)).pipe(
      filter(
        (itemsIndexed: { [uuid: string]: NodeResponse<Receipt> }) =>
          !!itemsIndexed
      ),
      map(itemsIndexed => Object.values(itemsIndexed))
    );
  }

  getTagFamilies(): Observable<TagFamilyResponse[]> {
    return this.tagFamilies$;
  }

  getTagsOfTagFamily(tagFamilyUuid: string): Observable<TagResponse[]> {
    return this.tags$.pipe(
      filter(items => Array.isArray(items)),
      map(items => items.filter(item => item.tagFamily.uuid === tagFamilyUuid))
    );
  }

  getReceiptCategories(): Observable<TagResponse[]> {
    return this.getTagsOfTagFamily(this.tagFamilyReceiptsUuid);
  }

  getReceipt(nodeUuid: string): Observable<NodeResponse<Receipt>> {
    return this.store.select(state => state.entities.receipt[nodeUuid]);
  }

  getReceiptsAll(): Observable<NodeResponse<Receipt>[]> {
    return this.receipts$;
  }

  getReceiptsByTagname(tagName: string): Observable<NodeResponse<Receipt>[]> {
    return this.receipts$.pipe(
      map(items =>
        items.filter(item => item.tags.find(tag => tag.name === tagName))
      )
    );
  }

  getNodeFieldBinaryUrl(nodeUuid: string, fieldName: string): string {
    return this.contentApi.getNodeFieldBinaryUrl(nodeUuid, fieldName);
  }
}
