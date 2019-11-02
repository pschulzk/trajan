import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
import { map, tap, filter } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import {
  actionEntitiesReceiptAdd,
  actionEntitiesTagFamilyAdd,
  actionEntitiesTagAdd
} from '../../../core/entities/entities.actions';
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

  tagFamilyReceiptsUuid = '179100da2deb4d0a9100da2debcd0af5';
  tagFamilyIngedrientsUuid = 'ec95a3920a4c42cb95a3920a4c32cba6';

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
        map(itemsIndexed =>
          Object.keys(itemsIndexed).map(key => itemsIndexed[key])
        )
      );
    this.tagFamilies$ = this.store
      .pipe(select(selectEntitiesTagFamilies))
      .pipe(
        map(itemsIndexed =>
          Object.keys(itemsIndexed).map(key => itemsIndexed[key])
        )
      );
    this.receipts$ = this.store
      .pipe(select(selectEntitiesReceipts))
      .pipe(
        map(itemsIndexed =>
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
