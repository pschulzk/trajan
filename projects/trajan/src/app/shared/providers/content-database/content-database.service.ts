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
  MeshSchemaKey,
  MeshSchemaType,
  MeshSchemaTypeMap,
  NormalizrMeshSchemas
} from '../../schemas/mesh-schemas';
import {
  NodeResponse,
  SchemaResponse,
  ProjectReferenceFromServer,
  NodeReferenceFromServer,
  NodeChildrenInfoFromServer
} from '../../models/server-models';
import { User, UserNodeReference } from '../../models/user.model';
import { MicroschemaReference } from '../../models/common.model';
import { NodeFieldMicronode, MeshNode } from '../../models/node.model';
import { Role } from '../../models/role.model';
import { Group } from '../../models/group.model';
import { TagFamily } from '../../models/tag-family.model';
import { Tag } from '../../models/tag.model';

/**
 * # ContentDatabaseService
 * Managing entities in IndexedDB
 * @param E is BTO interface encapsuled in MeshNode DTO
 */

@Injectable({
  providedIn: 'root'
})
export class ContentDatabaseService<E> extends Dexie {
  storeConfig: { [key in MeshSchemaKey<E>]: string } = {
    meshSchemaResponse: 'uuid',
    meshMicroschemaReference: 'jobUuid',
    meshNodeFieldMicronode: 'uuid',
    projectReferenceFromServer: 'uuid',
    meshNodeReferenceFromServer: 'uuid',
    userNodeReference: 'uuid',
    meshUser: 'uuid',
    meshRole: 'uuid',
    meshGroup: 'uuid',
    meshTagFamily: 'uuid',
    meshTag: 'uuid',
    meshNodeChildrenFromServer: 'schemaUuid',
    meshNode: 'uuid'
  };

  private _storeTables: Dexie.Table<MeshSchemaType<E>, string>[] = [];

  private _normalizrSchemas: NormalizrMeshSchemas<E>;

  constructor() {
    super('Entities');
    // initialize database
    this.version(1).stores(this.storeConfig);
    // initialize IndexedDB tables
    this._storeTables = Object.keys(this.storeConfig).map(entityKey =>
      this.table<MeshSchemaType<E>, string>(entityKey)
    );
    // Dexie.exists(dbName)
    // clear tables to prepare for new data !!!
    this._clearTables();

    this._normalizrSchemas = new NormalizrMeshSchemas<E>();
  }

  async storeNodes(nodes: NodeResponse<E>[]): Promise<void[]> {
    const normalizedData = normalize(nodes, [this._normalizrSchemas.meshNode]);
    return this._storeEntities(normalizedData as any);
  }

  async storeTagFamilies(tagFamilies: TagFamily[]): Promise<void[]> {
    const normalizedData = normalize(tagFamilies, [
      this._normalizrSchemas.meshTagFamily
    ]);
    return this._storeEntities(normalizedData as any);
  }

  async storeTags(tags: NodeResponse<E>[]): Promise<void[]> {
    const normalizedData = normalize(tags, [this._normalizrSchemas.meshTag]);
    return this._storeEntities(normalizedData as any);
  }

  ////////////////////////////////////////////////////////////////////////////////////////

  async getMeshSchema(uuid: string): Promise<SchemaResponse> {
    return this._entityGetFromTableByUuid('meshSchemaResponse', uuid);
  }

  async getMeshSchemaAll(): Promise<SchemaResponse[]> {
    return this._entitiesGetFromTable('meshSchemaResponse');
  }

  async getMeshMicroschema(uuid: string): Promise<MicroschemaReference> {
    return this._entityGetFromTableByUuid('meshMicroschemaReference', uuid);
  }

  async getMeshMicroschemaAll(): Promise<MicroschemaReference[]> {
    return this._entitiesGetFromTable('meshMicroschemaReference');
  }

  async getMeshNodeFieldMicronode(uuid: string): Promise<NodeFieldMicronode> {
    return this._entityGetFromTableByUuid('meshNodeFieldMicronode', uuid);
  }

  async getMeshNodeFieldMicronodeAll(): Promise<NodeFieldMicronode[]> {
    return this._entitiesGetFromTable('meshNodeFieldMicronode');
  }

  async getProjectReferenceFromServer(
    uuid: string
  ): Promise<ProjectReferenceFromServer> {
    return this._entityGetFromTableByUuid('projectReferenceFromServer', uuid);
  }

  async getProjectReferenceFromServerAll(): Promise<
    ProjectReferenceFromServer[]
  > {
    return this._entitiesGetFromTable('projectReferenceFromServer');
  }

  async getMeshNodeReferenceFromServer(
    uuid: string
  ): Promise<NodeReferenceFromServer> {
    return this._entityGetFromTableByUuid('meshNodeReferenceFromServer', uuid);
  }

  async getMeshNodeReferenceFromServerAll(): Promise<
    NodeReferenceFromServer[]
  > {
    return this._entitiesGetFromTable('meshNodeReferenceFromServer');
  }

  async getUserNodeReference(uuid: string): Promise<UserNodeReference> {
    return this._entityGetFromTableByUuid('userNodeReference', uuid);
  }

  async getUserNodeReferenceAll(): Promise<UserNodeReference[]> {
    return this._entitiesGetFromTable('userNodeReference');
  }

  async getMeshUser(uuid: string): Promise<User> {
    return this._entityGetFromTableByUuid('meshUser', uuid);
  }

  async getMeshUserAll(): Promise<User[]> {
    return this._entitiesGetFromTable('meshUser');
  }

  async getMeshRole(uuid: string): Promise<Role> {
    return this._entityGetFromTableByUuid('meshRole', uuid);
  }

  async getMeshRoleAll(): Promise<Role[]> {
    return this._entitiesGetFromTable('meshRole');
  }

  async getMeshGroup(uuid: string): Promise<Group> {
    return this._entityGetFromTableByUuid('meshGroup', uuid);
  }

  async getMeshGroupAll(): Promise<Group[]> {
    return this._entitiesGetFromTable('meshGroup');
  }

  async getMeshTagFamily(uuid: string): Promise<TagFamily> {
    return this._entityGetFromTableByUuid('meshTagFamily', uuid);
  }

  async getMeshTagFamilyAll(): Promise<TagFamily[]> {
    return this._entitiesGetFromTable('meshTagFamily');
  }

  async getMeshTag(uuid: string): Promise<Tag> {
    return this._entityGetFromTableByUuid('meshTag', uuid);
  }

  async getMeshTagAll(): Promise<Tag[]> {
    return this._entitiesGetFromTable('meshTag');
  }

  async getMeshNodeChildrenFromServer(
    uuid: string
  ): Promise<NodeChildrenInfoFromServer> {
    return this._entityGetFromTableByUuid('meshNodeChildrenFromServer', uuid);
  }

  async getMeshNodeChildrenFromServerAll(): Promise<
    NodeChildrenInfoFromServer[]
  > {
    return this._entitiesGetFromTable('meshNodeChildrenFromServer');
  }

  async getMeshNode(uuid: string): Promise<MeshNode<E>> {
    return this._entityGetFromTableByUuid('meshNode', uuid);
  }

  async getMeshNodeAll(): Promise<MeshNode<E>[]> {
    return this._entitiesGetFromTable('meshNode');
  }

  private async _storeEntities(payload: {
    entities: NormalizedSchema<
      { [key: string]: { [uuid: string]: MeshSchemaType<E> } },
      any
    >;
  }): Promise<void[]> {
    const storeActions: Promise<any>[] = [];
    Object.keys(payload.entities).forEach((entityKey: MeshSchemaKey<E>) => {
      if (!Object.keys(this.storeConfig).includes(entityKey)) {
        return;
      }
      const entityTable = this._storeTables.find(
        (table: Dexie.Table<MeshSchemaType<E>, string>) =>
          table.name === entityKey
      );
      if (!entityTable) {
        throw new Error(`No table found matching key: ${entityKey}`);
      }
      const entitiesTobeAdded = payload.entities[entityKey];
      if (entitiesTobeAdded && Object.keys(entitiesTobeAdded).length > 0) {
        Object.keys(entitiesTobeAdded).forEach(id => {
          storeActions.push(
            this._tableAddEntity(
              entityTable.name,
              entityTable,
              entitiesTobeAdded[id]
            )
          );
        });
      }
    });
    return Promise.all(storeActions);
  }

  private _tableGet(
    tableName: MeshSchemaKey<E>
  ): Dexie.Table<MeshSchemaType<E>, string> {
    return this._storeTables.find(
      (table: Dexie.Table<MeshSchemaType<E>, string>) =>
        table.name === tableName
    );
  }

  private _entityGetFromTableByUuid<
    K extends MeshSchemaKey<E>,
    T extends MeshSchemaTypeMap<T>[K]
  >(tableName: K, uuid: string): Promise<T> {
    return this._tableGet(tableName)
      .where(':uuid')
      .equals(uuid)
      .first() as Dexie.Promise<T>;
  }

  private _entitiesGetFromTable<
    K extends MeshSchemaKey<E>,
    T extends MeshSchemaTypeMap<T>[K]
  >(tableName: K): Promise<T[]> {
    return this._tableGet(tableName).toArray() as Dexie.Promise<T[]>;
  }

  private async _tableAddEntity(
    tableKey: string,
    table: Dexie.Table<MeshSchemaType<E>, string>,
    entities: MeshSchemaType<E>
  ): Promise<void> {
    return table.put(entities, tableKey).then(
      () => {},
      (error: Dexie.DexieError) => {
        if (error instanceof Dexie.ConstraintError) {
          // ignore if entity already exists
          return;
        } else {
          throw new Error(error.inner.message);
        }
      }
    );
  }

  private async _clearTables(): Promise<void[]> {
    const storeActions = this._storeTables.map(
      (table: Dexie.Table<MeshSchemaType<E>, string>) => table.clear()
    );
    return Promise.all(storeActions);
  }
}
