import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import {
  NodeResponse,
  TagFamilyResponse,
  TagResponse
} from '../../models/server-models';
import { map, filter } from 'rxjs/operators';
import { ContentApiService } from '../content-api/content-api.service';
import { ContentDatabaseService } from '../content-database/content-database.service';
import { MeshNode } from '../../models/node.model';
import { ConfigurationService } from '../../../core/configuration/configuration.service';

@Injectable({
  providedIn: 'root'
})
export class ContentDataService<E> {
  // tags$: Observable<TagResponse[]>;
  // tagFamilies$: Observable<TagFamilyResponse[]>;
  // receipts$: Observable<MeshNode<E>[]>;

  schemaReceiptUuid: string;
  tagFamilyIngedrientsUuid: string;
  tagFamilyReceiptsUuid: string;

  constructor(
    private configurationService: ConfigurationService,
    private contentApi: ContentApiService<E>,
    private contentDatabase: ContentDatabaseService<E>
  ) {
    // assign external values
    this.schemaReceiptUuid = this.configurationService.configData.schemaReceiptUuid;
    this.tagFamilyIngedrientsUuid = this.configurationService.configData.tagFamilyIngedrientsUuid;
    this.tagFamilyReceiptsUuid = this.configurationService.configData.tagFamilyReceiptsUuid;
    // load entities
    this.contentApi.getTagFamiliesAll().toPromise();
    this.contentApi.getTagsAll().toPromise();
    this.contentApi.getNodesAll().toPromise();

    // // get existing entities from state
    // this.tags$ = from(this.contentDatabase.getMeshTagAll());
    // this.tagFamilies$ = from(this.contentDatabase.getMeshTagFamilyAll());
    // this.receipts$ = from(this.contentDatabase.getMeshNodeAll());

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
    //     (itemsIndexed: { [uuid: string]: NodeResponse<E> }) =>
    //       !!itemsIndexed
    //   ),
    //   map(itemsIndexed => Object.values(itemsIndexed))
    // );
  }

  getTagFamilies(): Promise<TagFamilyResponse[]> {
    // return this.tagFamilies$;
    return this.contentDatabase.getMeshTagFamilyAll();
  }

  getTagsOfTagFamily(tagFamilyUuid: string): Promise<TagResponse[]> {
    return this.contentDatabase.getMeshTagAll({
      attribute: 'tagFamily',
      value: tagFamilyUuid
    });
    // return from(this.contentDatabase.getMeshTagAll()).pipe(
    //   filter(items => Array.isArray(items)),
    //   map(items => items.filter(item => item.tagFamily.uuid === tagFamilyUuid))
    // ).toPromise();
  }

  getReceiptCategories(): Promise<TagResponse[]> {
    return this.getTagsOfTagFamily(this.tagFamilyReceiptsUuid);
  }

  getReceipt(nodeUuid: string): Promise<NodeResponse<E>> {
    return this.contentDatabase.getMeshNode(nodeUuid);
    // return this.store.select(state => state.entities.receipt[nodeUuid]);
  }

  getReceiptsAll(): Promise<NodeResponse<E>[]> {
    return this.contentDatabase.getMeshNodeAll({
      attribute: 'schema',
      value: this.schemaReceiptUuid
    });
  }

  // getReceiptsByTagname(tagName: string): Promise<NodeResponse<E>[]> {
  //   return this.contentDatabase.getMeshNodesByTagUuids([tagName]);
  //   // return from(this.getReceiptsAll()).pipe(
  //   //   map(items =>
  //   //     items.filter(item => item.tags.find(tag => tag.name === tagName))
  //   //   )
  //   // );
  // }

  getNodeFieldBinaryUrl(nodeUuid: string, fieldName: string): string {
    return this.contentApi.getNodeFieldBinaryUrl(nodeUuid, fieldName);
  }

  getReceiptIngredientTags(): Observable<TagResponse[]> {
    return from(this.getTagsOfTagFamily(this.tagFamilyIngedrientsUuid));
  }
}
