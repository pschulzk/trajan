/**
 *
 * # Concept for generic IndexedDB data storing
 *
 * ## normalize response
 *
 * ## extract normalized entities
 *
 * ## create indexDB from normalized entities
 *
 * ## store normalized data in indexedDB
 *
 */

import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { normalize, NormalizedSchema } from 'normalizr';
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
  meshNode,
  MeshSchemaKey,
  MeshSchemaType
} from '../../schemas/mesh-schemas';
import {
  NodeResponse,
  TagResponse,
  TagFamilyResponse
} from '../../models/server-models';

@Injectable()
export class ContentDatabaseService extends Dexie {
  private _storeConfig: { [key in MeshSchemaKey]: string } = {
    meshSchema: 'uuid',
    meshMicroschema: 'jobUuid',
    meshNodeFieldMicronode: 'uuid',
    projectReference: 'uuid',
    meshNodeReference: 'uuid',
    userNodeReference: 'uuid',
    meshUser: 'uuid',
    meshRole: 'uuid',
    meshGroup: 'uuid',
    meshTagFamily: 'uuid',
    meshTag: 'uuid',
    meshNodeChildren: 'schemaUuid',
    meshNode: 'uuid'
  };

  private _storeTables: Dexie.Table<any, any>[] = [];

  constructor() {
    super('Entities');
    // initialize database
    this.version(1).stores(this._storeConfig);
    // initialize IndexedDB tables
    this._storeTables = Object.keys(this._storeConfig).map(entityKey =>
      this.table(entityKey)
    );
    console.log('!!! _storeTables:', this._storeTables);
  }

  storeNodes(nodes: NodeResponse<any>[]): Promise<any> {
    // console.log('!!! nodes:', nodes);
    const normalizedData = normalize(nodes, [meshNode]);
    console.log('!!! normalizedData:', normalizedData);
    return this._storeEntities(normalizedData);
  }

  getNode(uuid: string): Promise<NodeResponse<any>> {
    return this._getTable('meshNode')
      .where(':id')
      .equals(uuid)
      .first();
  }

  getNodes(): Promise<NodeResponse<any>[]> {
    return this._getTable('meshNode').toArray();
  }

  storeTags(tags: TagResponse[]): Promise<any> {
    // console.log('!!! tags:', tags);
    const normalizedData = normalize(tags, [meshTag]);
    console.log('!!! normalizedData:', normalizedData);
    return this._storeEntities(normalizedData);
  }

  getTag(uuid: string): Promise<TagResponse> {
    return this._getTable('meshTag')
      .where(':id')
      .equals(uuid)
      .first();
  }

  getTags(): Promise<TagResponse[]> {
    return this._getTable('meshTag').toArray();
  }

  storeTagFamilies(tagFamilies: TagFamilyResponse[]): Promise<any> {
    // console.log('!!! tagFamilies:', tagFamilies);
    const normalizedData = normalize(tagFamilies, [meshTagFamily]);
    console.log('!!! normalizedData:', normalizedData);
    return this._storeEntities(normalizedData);
  }

  getTagFamily(uuid: string): Promise<TagFamilyResponse> {
    return this._getTable('meshTagFamily')
      .where(':id')
      .equals(uuid)
      .first();
  }

  getTagFamilies(): Promise<TagFamilyResponse[]> {
    return this._getTable('meshTagFamily').toArray();
  }

  private _storeEntities(
    entities: NormalizedSchema<
      { [key: string]: { [uuid: string]: MeshSchemaType } },
      any
    >
  ): Promise<any> {
    const storeActions: Promise<any>[] = [];
    Object.keys(entities).forEach((entityKey: MeshSchemaKey) => {
      if (Object.keys(this._storeConfig).includes(entityKey)) {
        const entityTable = this._storeTables.find(
          (table: Dexie.Table<any, any>) => table.name === entityKey
        );
        if (!entityTable) {
          throw new Error(`No table found matching key: ${entityKey}`);
        }
        const entitiesTobeAdded = entities[entityKey];
        if (entitiesTobeAdded && Object.keys(entitiesTobeAdded).length > 0) {
          Object.keys(entitiesTobeAdded).forEach(id => {
            console.log(
              '!!! entitiesTobeAdded[id], id:',
              entitiesTobeAdded[id],
              id
            );
            storeActions.push(entityTable.add(entitiesTobeAdded[id], id));
          });
        }
      }
    });
    return Promise.all(storeActions);
  }

  private _getTable(key: MeshSchemaKey): Dexie.Table<any, any> {
    return this._storeTables.find(table => table.name === key);
  }
}
