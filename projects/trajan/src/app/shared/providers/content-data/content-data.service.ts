import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import {
  NodeResponse,
  TagFamilyResponse,
  TagResponse
} from '../../models/server-models';
import { Receipt } from '../../models/receipt.model';
import { map, tap, filter } from 'rxjs/operators';
import { ContentApiService } from '../content-api/content-api.service';
import { ContentDatabaseService } from '../content-database/content-database.service';
import { MeshNode } from '../../models/node.model';

@Injectable({
  providedIn: 'root'
})
export class ContentDataService<E> {
  tags$: Observable<TagResponse[]>;
  tagFamilies$: Observable<TagFamilyResponse[]>;
  receipts$: Observable<MeshNode<Receipt>[]>;

  tagFamilyReceiptsUuid = '91d53bab0f954a76953bab0f955a7655';
  tagFamilyIngedrientsUuid = 'b9fe4f8fba1f48e4be4f8fba1f78e471';

  constructor(
    private contentApi: ContentApiService<E>,
    private contentDatabase: ContentDatabaseService<E>
  ) {
    // load entities
    this.contentApi.getTagFamiliesOfProject().toPromise();
    this.contentApi.getTagsAll().toPromise();
    this.contentApi.getReceiptsOfProject().toPromise();

    // get existing entities from state
    this.tags$ = from(this.contentDatabase.getMeshTagAll());
    this.tagFamilies$ = from(this.contentDatabase.getMeshTagFamilyAll());
    this.receipts$ = from(this.contentDatabase.getMeshNodeAll());

    // this.tags$ = this.store.pipe(select(selectEntitiesTags)).pipe(
    //   filter((itemsIndexed: { [uuid: string]: TagResponse }) => !!itemsIndexed),
    //   map(itemsIndexed => Object.values(itemsIndexed))
    // );
    // this.tagFamilies$ = this.store.pipe(select(selectEntitiesTagFamilies)).pipe(
    //   filter(
    //     (itemsIndexed: { [uuid: string]: TagFamilyResponse }) => !!itemsIndexed
    //   ),
    //   map(itemsIndexed => Object.values(itemsIndexed))
    // );
    // this.receipts$ = this.store.pipe(select(selectEntitiesReceipts)).pipe(
    //   filter(
    //     (itemsIndexed: { [uuid: string]: NodeResponse<Receipt> }) =>
    //       !!itemsIndexed
    //   ),
    //   map(itemsIndexed => Object.values(itemsIndexed))
    // );
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
    return from(this.contentDatabase.getMeshNode(nodeUuid));
    // return this.store.select(state => state.entities.receipt[nodeUuid]);
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
