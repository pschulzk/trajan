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
import { AppErrorHandler } from '../../../core/error-handler/app-error-handler.service';

export interface ContentDatabaseIndices {
  meshSchemaResponse: 'uuid';
  meshMicroschemaReference: 'jobUuid';
  meshNodeFieldMicronode: 'uuid';
  projectReferenceFromServer: 'uuid';
  meshNodeReferenceFromServer: 'uuid';
  userNodeReference: 'uuid';
  meshUser: 'uuid';
  meshRole: 'uuid';
  meshGroup: 'uuid';
  meshTagFamily: 'uuid';
  meshTag: 'uuid' | 'tagFamily';
  meshNodeChildrenFromServer: 'schemaUuid';
  meshNode:
    | 'uuid'
    | 'schema'
    | '[tags]'
    | 'creator'
    | 'editor'
    | 'fields.content'
    | 'fields.name';
}

/**
 * Managing entities in IndexedDB
 * @param E is BTO interface enveloped in MeshNode DTO
 */
@Injectable({
  providedIn: 'root'
})
export class ContentDatabaseService<E> extends Dexie {
  /** IndexedDB table definitions */
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
    meshNode: [
      'uuid',
      'schema',
      '[tags]',
      'creator',
      'editor',
      'fields.content',
      'fields.name'
    ].join(',')
  };

  /** This IndexedDB's string identifier */
  private _dataBaseName: string;

  /** IndexedDB table instances */
  private _storeTables: Dexie.Table<MeshSchemaType<E>, string>[] = [];

  /** Normalization utility class instance */
  private _normalizrSchemas: NormalizrMeshSchemas<E>;

  ////////////////////////////////////////////////////////////////////////////////////////

  constructor(
    private configurationService: ConfigurationService,
    private errorHandler: AppErrorHandler
  ) {
    // construct service with parameter from external configuration
    super(configurationService.configData.indexedDbName);
    this._dataBaseName = this.configurationService.configData.indexedDbName;
    this._storeInit(1);
    this._normalizrSchemas = new NormalizrMeshSchemas<E>();
  }

  ////////////////////////////////////////////////////////////////////////////////////////

  async storeNodes(nodes: NodeResponse<E>[]): Promise<void[]> {
    const normalizedData = normalize(nodes, [this._normalizrSchemas.meshNode]);
    return this._entitiesPut(normalizedData);
  }

  async storeTagFamilies(tagFamilies: TagFamily[]): Promise<void[]> {
    const normalizedData = normalize(tagFamilies, [
      this._normalizrSchemas.meshTagFamily
    ]);
    return this._entitiesPut(normalizedData);
  }

  async storeTags(tags: Tag[]): Promise<void[]> {
    const normalizedData = normalize(tags, [this._normalizrSchemas.meshTag]);
    return this._entitiesPut(normalizedData);
  }

  ////////////////////////////////////////////////////////////////////////////////////////

  async getMeshSchema(uuid: string): Promise<SchemaResponse | Error> {
    return this._tableEntityGetByUuid('meshSchemaResponse', uuid);
  }

  async getMeshSchemaAll(
    filter?: {
      attributes:
        | ContentDatabaseIndices['meshSchemaResponse']
        | Array<ContentDatabaseIndices['meshSchemaResponse']>;
      values: any | any[];
    },
    filterFn?: (row: SchemaResponse) => boolean
  ): Promise<SchemaResponse[]> {
    return this._tableEntitiesGet('meshSchemaResponse', filter, filterFn);
  }

  async getMeshMicroschema(
    uuid: string
  ): Promise<MicroschemaReference | Error> {
    return this._tableEntityGetByUuid('meshMicroschemaReference', uuid);
  }

  async getMeshMicroschemaAll(
    filter?: {
      attributes:
        | ContentDatabaseIndices['meshMicroschemaReference']
        | Array<ContentDatabaseIndices['meshMicroschemaReference']>;
      values: any | any[];
    },
    filterFn?: (row: MicroschemaReference) => boolean
  ): Promise<MicroschemaReference[]> {
    return this._tableEntitiesGet('meshMicroschemaReference', filter, filterFn);
  }

  async getMeshNodeFieldMicronode(
    uuid: string
  ): Promise<NodeFieldMicronode | Error> {
    return this._tableEntityGetByUuid('meshNodeFieldMicronode', uuid);
  }

  async getMeshNodeFieldMicronodeAll(
    filter?: {
      attributes:
        | ContentDatabaseIndices['meshNodeFieldMicronode']
        | Array<ContentDatabaseIndices['meshNodeFieldMicronode']>;
      values: any | any[];
    },
    filterFn?: (row: NodeFieldMicronode) => boolean
  ): Promise<NodeFieldMicronode[]> {
    return this._tableEntitiesGet('meshNodeFieldMicronode', filter, filterFn);
  }

  async getProjectReferenceFromServer(
    uuid: string
  ): Promise<ProjectReferenceFromServer | Error> {
    return this._tableEntityGetByUuid('projectReferenceFromServer', uuid);
  }

  async getProjectReferenceFromServerAll(
    filter?: {
      attributes:
        | ContentDatabaseIndices['projectReferenceFromServer']
        | Array<ContentDatabaseIndices['projectReferenceFromServer']>;
      values: any | any[];
    },
    filterFn?: (row: ProjectReferenceFromServer) => boolean
  ): Promise<ProjectReferenceFromServer[]> {
    return this._tableEntitiesGet(
      'projectReferenceFromServer',
      filter,
      filterFn
    );
  }

  async getMeshNodeReferenceFromServer(
    uuid: string
  ): Promise<NodeReferenceFromServer | Error> {
    return this._tableEntityGetByUuid('meshNodeReferenceFromServer', uuid);
  }

  async getMeshNodeReferenceFromServerAll(
    filter?: {
      attributes:
        | ContentDatabaseIndices['meshNodeReferenceFromServer']
        | Array<ContentDatabaseIndices['meshNodeReferenceFromServer']>;
      values: any | any[];
    },
    filterFn?: (row: NodeReferenceFromServer) => boolean
  ): Promise<NodeReferenceFromServer[]> {
    return this._tableEntitiesGet(
      'meshNodeReferenceFromServer',
      filter,
      filterFn
    );
  }

  async getUserNodeReference(uuid: string): Promise<UserNodeReference | Error> {
    return this._tableEntityGetByUuid('userNodeReference', uuid);
  }

  async getUserNodeReferenceAll(
    filter?: {
      attributes:
        | ContentDatabaseIndices['userNodeReference']
        | Array<ContentDatabaseIndices['userNodeReference']>;
      values: any | any[];
    },
    filterFn?: (row: UserNodeReference) => boolean
  ): Promise<UserNodeReference[]> {
    return this._tableEntitiesGet('userNodeReference', filter, filterFn);
  }

  async getMeshUser(uuid: string): Promise<User | Error> {
    return this._tableEntityGetByUuid('meshUser', uuid);
  }

  async getMeshUserAll(
    filter?: {
      attributes:
        | ContentDatabaseIndices['meshUser']
        | Array<ContentDatabaseIndices['meshUser']>;
      values: any | any[];
    },
    filterFn?: (row: User) => boolean
  ): Promise<User[]> {
    return this._tableEntitiesGet('meshUser', filter, filterFn);
  }

  async getMeshRole(uuid: string): Promise<Role | Error> {
    return this._tableEntityGetByUuid('meshRole', uuid);
  }

  async getMeshRoleAll(
    filter?: {
      attributes:
        | ContentDatabaseIndices['meshRole']
        | Array<ContentDatabaseIndices['meshRole']>;
      values: any | any[];
    },
    filterFn?: (row: Role) => boolean
  ): Promise<Role[]> {
    return this._tableEntitiesGet('meshRole', filter, filterFn);
  }

  async getMeshGroup(uuid: string): Promise<Group | Error> {
    return this._tableEntityGetByUuid('meshGroup', uuid);
  }

  async getMeshGroupAll(
    filter?: {
      attributes:
        | ContentDatabaseIndices['meshGroup']
        | Array<ContentDatabaseIndices['meshGroup']>;
      values: any | any[];
    },
    filterFn?: (row: Group) => boolean
  ): Promise<Group[]> {
    return this._tableEntitiesGet('meshGroup', filter, filterFn);
  }

  async getMeshTagFamily(uuid: string): Promise<TagFamily | Error> {
    return this._tableEntityGetByUuid('meshTagFamily', uuid);
  }

  async getMeshTagFamilyAll(
    filter?: {
      attributes:
        | ContentDatabaseIndices['meshTagFamily']
        | Array<ContentDatabaseIndices['meshTagFamily']>;
      values: any | any[];
    },
    filterFn?: (row: TagFamily) => boolean
  ): Promise<TagFamily[]> {
    return this._tableEntitiesGet('meshTagFamily', filter, filterFn);
  }

  async getMeshTag(uuid: string): Promise<Tag | Error> {
    return this._tableEntityGetByUuid('meshTag', uuid);
  }

  async getMeshTagAll(
    filter?: {
      attributes:
        | ContentDatabaseIndices['meshTag']
        | Array<ContentDatabaseIndices['meshTag']>;
      values: any | any[];
    },
    filterFn?: (row: Tag) => boolean
  ): Promise<Tag[]> {
    return this._tableEntitiesGet('meshTag', filter, filterFn);
  }

  async getMeshNodeChildrenFromServer(
    uuid: string
  ): Promise<NodeChildrenInfoFromServer | Error> {
    return this._tableEntityGetByUuid('meshNodeChildrenFromServer', uuid);
  }

  async getMeshNodeChildrenFromServerAll(
    filter?: {
      attributes:
        | ContentDatabaseIndices['meshNodeChildrenFromServer']
        | Array<ContentDatabaseIndices['meshNodeChildrenFromServer']>;
      values: any | any[];
    },
    filterFn?: (row: NodeChildrenInfoFromServer) => boolean
  ): Promise<NodeChildrenInfoFromServer[]> {
    return this._tableEntitiesGet(
      'meshNodeChildrenFromServer',
      filter,
      filterFn
    );
  }

  async getMeshNode(uuid: string): Promise<MeshNode<E> | Error> {
    return this._tableEntityGetByUuid('meshNode', uuid);
  }

  async getMeshNodeAll(
    filter?: {
      attributes:
        | ContentDatabaseIndices['meshNode']
        | Array<ContentDatabaseIndices['meshNode']>;
      values: any | any[];
    },
    filterFn?: (row: MeshNode<E>) => boolean
  ): Promise<MeshNode<E>[]> {
    return this._tableEntitiesGet('meshNode', filter, filterFn);
  }

  ////////////////////////////////////////////////////////////////////////////////////////

  /**
   * Initialize IndexedDB.
   * @param versionNumber of the database store to be initialized
   */
  private _storeInit(versionNumber: number): void {
    // initialize database
    this.version(versionNumber).stores(this.storeConfig);
    // initialize IndexedDB tables
    this._storeTables = Object.keys(this.storeConfig).map(entityKey =>
      this.table<MeshSchemaType<E>, string>(entityKey)
    );
  }

  /**
   * Add or update entities to store databases.
   * @param payload Normalized Mesh entities to be added to IndexedDB
   */
  private async _entitiesPut(
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
            this._tableEntityPut(entityTable, entitiesTobeAdded[id])
          );
        });
      }
    });
    return Promise.all(storeActions);
  }

  /**
   * Convenience table getter.
   * @param tableName identifier to select table from store
   */
  private _tableGet(
    tableName: MeshSchemaKey<E>
  ): Dexie.Table<MeshSchemaType<E>, string> {
    return this._storeTables.find(
      (table: Dexie.Table<MeshSchemaType<E>, string>) =>
        table.name === tableName
    );
  }

  /**
   * Get single row from table.
   * @param tableName identifier to select table from store
   * @param uuid unique table row id
   */
  private _tableEntityGetByUuid<
    K extends MeshSchemaKey<E>,
    T extends MeshSchemaTypeMap<T>[K]
  >(tableName: K, uuid: string): Promise<T | Error> {
    return this._tableGet(tableName)
      .where('uuid')
      .equals(uuid)
      .first()
      .then(result => {
        if (result) {
          return result;
        } else {
          this.errorHandler.handleErrorEntityNotFound();
          throw new Error(
            `Entity with UUID ${uuid} not found in table ${tableName}.`
          );
        }
      }) as Dexie.Promise<T>;
  }

  /**
   * Get multiple rows from table. If no filter is defined, get all table rows.
   * @param tableName identifier to select table from store
   * @param filter by attribute values (optional)
   * @param filterFn to refine filtered result (using compound indices instead is recommended)
   */
  private _tableEntitiesGet<
    K extends MeshSchemaKey<E>,
    T extends MeshSchemaTypeMap<T>[K]
  >(
    tableName: K,
    filter?: {
      // attributes: keyof T | Array<keyof T>,
      attributes: ContentDatabaseIndices[K] | Array<ContentDatabaseIndices[K]>;
      values: any | any[];
    },
    filterFn?: (row: T) => boolean
  ): Promise<T[]> {
    const table = this._tableGet(tableName);
    let result: Dexie.Promise<any[]>;
    if (filter) {
      if (Array.isArray(filter.values)) {
        result = table
          .where(filter.attributes)
          .anyOfIgnoreCase(filter.values)
          .and(filterFn || (() => true))
          .toArray();
      } else {
        result = table
          .where(filter.attributes)
          .equals(filter.values)
          .and(filterFn || (() => true))
          .toArray();
      }
    } else {
      result = table.toArray();
    }
    return result as Dexie.Promise<T[]>;
  }

  /**
   * Add or update row in table.
   * @param tableName identifier to select table from store
   * @param entity to be added or updated
   */
  private async _tableEntityPut(
    tableName: Dexie.Table<MeshSchemaType<E>, string>,
    entity: MeshSchemaType<E>
  ): Promise<void> {
    return tableName.put(entity).then(
      () => {},
      (error: Dexie.DexieError) => {
        throw new Error(error.inner.message);
      }
    );
  }

  /**
   * Iterate through all tables and delete all their rows.
   */
  private async _clearTables(): Promise<void[]> {
    const storeActions = this._storeTables.map(
      (table: Dexie.Table<MeshSchemaType<E>, string>) => table.clear()
    );
    return Promise.all(storeActions);
  }

  /**
   * Delete entire store with all databases.
   */
  private async _clearDatabase(): Promise<void> {
    return Dexie.delete(this._dataBaseName);
  }
}
