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
import { ConfigurationService } from '../../../core/configuration/configuration.service';

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
    meshTag: 'uuid, tagFamily',
    meshNodeChildrenFromServer: 'schemaUuid',
    meshNode: 'uuid, schema, [tags], creator, editor'
  };

  private _dataBaseName: string;

  private _storeTables: Dexie.Table<MeshSchemaType<E>, string>[] = [];

  private _normalizrSchemas: NormalizrMeshSchemas<E>;

  constructor(private configurationService: ConfigurationService) {
    // construct service with parameter from external configuration
    super(configurationService.configData.indexedDbName);
    this._dataBaseName = this.configurationService.configData.indexedDbName;

    // initialize database
    this.version(1).stores(this.storeConfig);
    // initialize IndexedDB tables
    this._storeTables = Object.keys(this.storeConfig).map(entityKey =>
      this.table<MeshSchemaType<E>, string>(entityKey)
    );

    this._normalizrSchemas = new NormalizrMeshSchemas<E>();
  }

  async storeNodes(nodes: NodeResponse<E>[]): Promise<void[]> {
    const normalizedData = normalize(nodes, [this._normalizrSchemas.meshNode]);
    return this._storeEntities(normalizedData);
  }

  async storeTagFamilies(tagFamilies: TagFamily[]): Promise<void[]> {
    const normalizedData = normalize(tagFamilies, [
      this._normalizrSchemas.meshTagFamily
    ]);
    return this._storeEntities(normalizedData);
  }

  async storeTags(tags: Tag[]): Promise<void[]> {
    const normalizedData = normalize(tags, [this._normalizrSchemas.meshTag]);
    return this._storeEntities(normalizedData);
  }

  ////////////////////////////////////////////////////////////////////////////////////////

  async getMeshSchema(uuid: string): Promise<SchemaResponse> {
    return this._entityGetFromTableByUuid('meshSchemaResponse', uuid);
  }

  async getMeshSchemaAll(filter?: {
    attribute: keyof SchemaResponse;
    value: any;
  }): Promise<SchemaResponse[]> {
    return this._entitiesGetFromTable('meshSchemaResponse', filter);
  }

  async getMeshMicroschema(uuid: string): Promise<MicroschemaReference> {
    return this._entityGetFromTableByUuid('meshMicroschemaReference', uuid);
  }

  async getMeshMicroschemaAll(filter?: {
    attribute: keyof MicroschemaReference;
    value: any;
  }): Promise<MicroschemaReference[]> {
    return this._entitiesGetFromTable('meshMicroschemaReference', filter);
  }

  async getMeshNodeFieldMicronode(uuid: string): Promise<NodeFieldMicronode> {
    return this._entityGetFromTableByUuid('meshNodeFieldMicronode', uuid);
  }

  async getMeshNodeFieldMicronodeAll(filter?: {
    attribute: keyof NodeFieldMicronode;
    value: any;
  }): Promise<NodeFieldMicronode[]> {
    return this._entitiesGetFromTable('meshNodeFieldMicronode', filter);
  }

  async getProjectReferenceFromServer(
    uuid: string
  ): Promise<ProjectReferenceFromServer> {
    return this._entityGetFromTableByUuid('projectReferenceFromServer', uuid);
  }

  async getProjectReferenceFromServerAll(filter?: {
    attribute: keyof ProjectReferenceFromServer;
    value: any;
  }): Promise<ProjectReferenceFromServer[]> {
    return this._entitiesGetFromTable('projectReferenceFromServer', filter);
  }

  async getMeshNodeReferenceFromServer(
    uuid: string
  ): Promise<NodeReferenceFromServer> {
    return this._entityGetFromTableByUuid('meshNodeReferenceFromServer', uuid);
  }

  async getMeshNodeReferenceFromServerAll(filter?: {
    attribute: keyof NodeReferenceFromServer;
    value: any;
  }): Promise<NodeReferenceFromServer[]> {
    return this._entitiesGetFromTable('meshNodeReferenceFromServer', filter);
  }

  async getUserNodeReference(uuid: string): Promise<UserNodeReference> {
    return this._entityGetFromTableByUuid('userNodeReference', uuid);
  }

  async getUserNodeReferenceAll(filter?: {
    attribute: keyof UserNodeReference;
    value: any;
  }): Promise<UserNodeReference[]> {
    return this._entitiesGetFromTable('userNodeReference', filter);
  }

  async getMeshUser(uuid: string): Promise<User> {
    return this._entityGetFromTableByUuid('meshUser', uuid);
  }

  async getMeshUserAll(filter?: {
    attribute: keyof User;
    value: any;
  }): Promise<User[]> {
    return this._entitiesGetFromTable('meshUser', filter);
  }

  async getMeshRole(uuid: string): Promise<Role> {
    return this._entityGetFromTableByUuid('meshRole', uuid);
  }

  async getMeshRoleAll(filter?: {
    attribute: keyof Role;
    value: any;
  }): Promise<Role[]> {
    return this._entitiesGetFromTable('meshRole', filter);
  }

  async getMeshGroup(uuid: string): Promise<Group> {
    return this._entityGetFromTableByUuid('meshGroup', uuid);
  }

  async getMeshGroupAll(filter?: {
    attribute: keyof Group;
    value: any;
  }): Promise<Group[]> {
    return this._entitiesGetFromTable('meshGroup', filter);
  }

  async getMeshTagFamily(uuid: string): Promise<TagFamily> {
    return this._entityGetFromTableByUuid('meshTagFamily', uuid);
  }

  async getMeshTagFamilyAll(filter?: {
    attribute: keyof TagFamily;
    value: any;
  }): Promise<TagFamily[]> {
    return this._entitiesGetFromTable('meshTagFamily', filter);
  }

  async getMeshTag(uuid: string): Promise<Tag> {
    return this._entityGetFromTableByUuid('meshTag', uuid);
  }

  async getMeshTagAll(filter?: {
    attribute: keyof Tag;
    value: any;
  }): Promise<Tag[]> {
    return this._entitiesGetFromTable('meshTag', filter)
      .then(success => success)
      .catch(error =>
        console.log(`!!! ${this.constructor.name}.error:`, error)
      ) as Promise<Tag[]>;
  }

  // async getMeshTagsByTagFamily(
  //   filter?: {
  //     attribute: keyof Tag,
  //     value: any,
  //   },
  // ): Promise<Tag[]> {
  //   return this._entitiesGetFromTable('meshTag', filter);
  // }

  async getMeshNodeChildrenFromServer(
    uuid: string
  ): Promise<NodeChildrenInfoFromServer> {
    return this._entityGetFromTableByUuid('meshNodeChildrenFromServer', uuid);
  }

  async getMeshNodeChildrenFromServerAll(filter?: {
    attribute: keyof NodeChildrenInfoFromServer;
    value: any;
  }): Promise<NodeChildrenInfoFromServer[]> {
    return this._entitiesGetFromTable('meshNodeChildrenFromServer', filter);
  }

  async getMeshNode(uuid: string): Promise<MeshNode<E>> {
    return this._entityGetFromTableByUuid('meshNode', uuid);
  }

  async getMeshNodeAll(filter?: {
    attribute: keyof MeshNode<E>;
    value: any;
  }): Promise<MeshNode<E>[]> {
    return this._entitiesGetFromTable('meshNode', filter);
  }

  async getMeshNodesByTagUuids(tagUuids: string[]): Promise<MeshNode<E>[]> {
    return this._tableGet('meshNode')
      .where('tags')
      .anyOf(tagUuids)
      .toArray() as Dexie.Promise<MeshNode<E>[]>;
  }

  private async _storeEntities(
    payload: NormalizedSchema<
      {
        [key: string]: {
          [key: string]: MeshSchemaType<E>;
        };
      },
      any
    >
  ): Promise<void[]> {
    const storeActions: Promise<void>[] = [];
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
          // ignore empty objects
          if (Object.keys(entitiesTobeAdded[id]).length === 0) {
            return;
          }
          storeActions.push(
            this._tablePutEntity(entityTable, entitiesTobeAdded[id])
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

  // private _entitiesGetFromTable<
  //   K extends MeshSchemaKey<E>,
  //   T extends MeshSchemaTypeMap<T>[K]
  // >(tableName: K): Promise<T[]> {
  //   return this._tableGet(tableName).toArray() as Dexie.Promise<T[]>;
  // }

  private _entitiesGetFromTable<
    K extends MeshSchemaKey<E>,
    T extends MeshSchemaTypeMap<T>[K]
  >(
    tableName: K,
    filter?: {
      attribute: keyof T;
      value: any;
    }
  ): Promise<T[]> {
    if (filter) {
      console.log(
        `!!! ${this.constructor.name}._entitiesGetFromTable:`,
        filter
      );
      return this._tableGet(tableName)
        .where(filter.attribute as string)
        .equals(filter.value)
        .toArray() as Dexie.Promise<T[]>;
      // .catch(error => console.log(`!!! ${this.constructor.name}.error:`, filter)) as Dexie.Promise<T[]>;
    } else {
      return this._tableGet(tableName).toArray() as Dexie.Promise<T[]>;
    }
  }

  private async _tablePutEntity(
    table: Dexie.Table<MeshSchemaType<E>, string>,
    entities: MeshSchemaType<E>
  ): Promise<void> {
    return table.put(entities).then(
      () => {},
      (error: Dexie.DexieError) => {
        throw new Error(error.inner.message);
      }
    );
  }

  private async _clearTables(): Promise<void[]> {
    const storeActions = this._storeTables.map(
      (table: Dexie.Table<MeshSchemaType<E>, string>) => table.clear()
    );
    return Promise.all(storeActions);
  }

  private async _clearDatabase(): Promise<void> {
    Dexie.delete(this._dataBaseName);
  }
}
