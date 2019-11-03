import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

@Injectable({
  providedIn: 'root'
})
export class ContentDataService {
  tags$: Observable<TagResponse[]>;
  tagFamilies$: Observable<TagFamilyResponse[]>;
  receipts$: Observable<NodeResponse<Receipt>[]>;

  tagFamilyReceiptsUuid = '91d53bab0f954a76953bab0f955a7655';
  tagFamilyIngedrientsUuid = 'b9fe4f8fba1f48e4be4f8fba1f78e471';

  constructor(
    private contentApi: ContentApiService,
    private store: Store<AppState>
  ) {
    // load entities
    this.contentApi.getTagFamiliesOfProject().toPromise();
    this.contentApi.getTagsAll().toPromise();
    this.contentApi.getReceiptsOfProject().toPromise();

    // get existing entities from state
    this.tags$ = this.store
      .pipe(select(selectEntitiesTags))
      .pipe(
        map(
          itemsIndexed =>
            itemsIndexed &&
            Object.keys(itemsIndexed).map(key => itemsIndexed[key])
        )
      );
    this.tagFamilies$ = this.store
      .pipe(select(selectEntitiesTagFamilies))
      .pipe(
        map(
          itemsIndexed =>
            itemsIndexed &&
            Object.keys(itemsIndexed).map(key => itemsIndexed[key])
        )
      );
    this.receipts$ = this.store
      .pipe(select(selectEntitiesReceipts))
      .pipe(
        map(
          itemsIndexed =>
            itemsIndexed &&
            Object.keys(itemsIndexed).map(key => itemsIndexed[key])
        )
      );
  }

  getTagFamilies(): Observable<TagFamilyResponse[]> {
    return this.tagFamilies$;
  }

  getTagsOfTagFamily(tagFamilyUuid: string): Observable<TagResponse[]> {
    return this.tags$.pipe(
      map(items => items.filter(item => item.tagFamily.uuid === tagFamilyUuid))
    );
  }

  getReceiptCategories(): Observable<TagResponse[]> {
    return this.getTagsOfTagFamily(this.tagFamilyReceiptsUuid);
  }

  getReceipt(nodeUuid: string): Observable<NodeResponse<Receipt>> {
    return this.store.select(state => state.entities.receipt[nodeUuid]);
    // return this.receipts$.pipe(
    //   map(items => items.find(item => item.uuid === nodeUuid)),
    // );
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
