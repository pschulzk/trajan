import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import {
  NodeResponse,
  TagFamilyResponse,
  TagResponse
} from '../../models/server-models';
import { ContentApiService } from '../content-api/content-api.service';
import { ContentDatabaseService } from '../content-database/content-database.service';
import { MeshNode } from '../../models/node.model';
import { ConfigurationService } from '../../../core/configuration/configuration.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../core/core.state';
import { actionUiMemoryIsLoading } from '../../../core/ui-memory/ui-memory.actions';

@Injectable({
  providedIn: 'root'
})
export class ContentDataService<E> {
  schemaReceiptUuid: string;
  tagFamilyIngedrientsUuid: string;
  tagFamilyReceiptsUuid: string;

  constructor(
    private configurationService: ConfigurationService,
    private contentApi: ContentApiService<E>,
    private contentDatabase: ContentDatabaseService<E>,
    private store: Store<AppState>
  ) {
    // assign external values
    this.schemaReceiptUuid = this.configurationService.configData.schemaReceiptUuid;
    this.tagFamilyIngedrientsUuid = this.configurationService.configData.tagFamilyIngedrientsUuid;
    this.tagFamilyReceiptsUuid = this.configurationService.configData.tagFamilyReceiptsUuid;
    // load entities
    this.dataFetch();
  }

  dataFetch(): any {
    Promise.all([
      this.contentApi.getTagFamiliesAll().toPromise(),
      this.contentApi.getTagsAll().toPromise(),
      this.contentApi.getNodesAll().toPromise()
    ]).then(() =>
      this.store.dispatch(actionUiMemoryIsLoading({ isLoading: false }))
    );
  }

  getTagFamilies(): Promise<TagFamilyResponse[]> {
    // return this.tagFamilies$;
    return this.contentDatabase.getMeshTagFamilyAll();
  }

  getTagsOfTagFamily(tagFamilyUuid: string): Promise<TagResponse[]> {
    return this.contentDatabase.getMeshTagAll({
      attributes: 'tagFamily',
      values: tagFamilyUuid
    });
  }

  getReceiptCategories(): Promise<TagResponse[]> {
    return this.getTagsOfTagFamily(this.tagFamilyReceiptsUuid);
  }

  getReceipt(nodeUuid: string): Promise<NodeResponse<E>> {
    return this.contentDatabase.getMeshNode(nodeUuid);
  }

  getReceiptsAll(
    filterFn?: (row: MeshNode<E>) => boolean
  ): Promise<NodeResponse<E>[]> {
    return this.contentDatabase.getMeshNodeAll(
      {
        attributes: 'schema',
        values: this.schemaReceiptUuid
      },
      filterFn
    );
  }

  getNodeFieldBinaryUrl(nodeUuid: string, fieldName: string): string {
    return this.contentApi.getNodeFieldBinaryUrl(nodeUuid, fieldName);
  }

  getReceiptIngredientTags(): Observable<TagResponse[]> {
    return from(this.getTagsOfTagFamily(this.tagFamilyIngedrientsUuid));
  }
}
