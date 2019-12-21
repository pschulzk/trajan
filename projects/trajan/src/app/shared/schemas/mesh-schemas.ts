import { schema } from 'normalizr';
import { MeshNode, NodeFieldMicronode } from '../models/node.model';
import { MicroschemaReference } from '../models/common.model';
import {
  ProjectReferenceFromServer,
  NodeChildrenInfoFromServer,
  SchemaResponse,
  NodeReferenceFromServer
} from '../models/server-models';
import { UserNodeReference, User } from '../models/user.model';
import { TagFamily } from '../models/tag-family.model';
import { Tag } from '../models/tag.model';
import { Role } from '../models/role.model';
import { Group } from '../models/group.model';

export interface MeshSchemaTypeMap<T> {
  meshSchemaResponse: SchemaResponse;
  meshMicroschemaReference: MicroschemaReference;
  meshNodeFieldMicronode: NodeFieldMicronode;
  projectReferenceFromServer: ProjectReferenceFromServer;
  meshNodeReferenceFromServer: NodeReferenceFromServer;
  userNodeReference: UserNodeReference;
  meshUser: User;
  meshRole: Role;
  meshGroup: Group;
  meshTagFamily: TagFamily;
  meshTag: Tag;
  meshNodeChildrenFromServer: NodeChildrenInfoFromServer;
  meshNode: MeshNode<T>;
}

export type MeshSchemaKey<T> = keyof MeshSchemaTypeMap<T>;

export type MeshSchemaType<T> = MeshSchemaTypeMap<T>[MeshSchemaKey<T>];

/**
 * # Normalizr schemas for Mesh entities
 */
export class NormalizrMeshSchemas<T> {
  optionsIndexedByUuid = {
    idAttribute: 'uuid'
  };

  optionsIndexedbyJobUuid = {
    idAttribute: 'jobUuid'
  };

  optionsIndexedBySchemaUuid = {
    idAttribute: 'schemaUuid'
  };

  meshSchemaResponse: schema.Entity<SchemaResponse>;

  meshMicroschemaReference: schema.Entity<MicroschemaReference>;

  meshNodeFieldMicronode: schema.Entity<NodeFieldMicronode>;

  projectReferenceFromServer: schema.Entity<ProjectReferenceFromServer>;

  meshNodeReferenceFromServer: schema.Entity<NodeReferenceFromServer>;

  userNodeReference: schema.Entity<UserNodeReference>;

  meshUser: schema.Entity<User>;

  meshRole: schema.Entity<Role>;

  meshGroup: schema.Entity<Group>;

  meshTagFamily: schema.Entity<TagFamily>;

  meshTag: schema.Entity<Tag>;

  meshNodeChildrenFromServer: schema.Entity<NodeChildrenInfoFromServer>;

  meshNode: schema.Entity<MeshNode<T>>;

  constructor() {
    /**
     * ## Normalizr Schemas
     */
    this.meshSchemaResponse = new schema.Entity<SchemaResponse>(
      'meshSchemaResponse',
      {
        // creator: meshUser, // defined later
        // editor: meshUser, // defined later
      },
      this.optionsIndexedByUuid
    );

    this.meshMicroschemaReference = new schema.Entity<MicroschemaReference>(
      'meshMicroschemaReference',
      {},
      this.optionsIndexedbyJobUuid
    );

    this.meshNodeFieldMicronode = new schema.Entity<NodeFieldMicronode>(
      'meshNodeFieldMicronode',
      {
        microschema: this.meshMicroschemaReference
      },
      this.optionsIndexedByUuid
    );

    this.projectReferenceFromServer = new schema.Entity<
      ProjectReferenceFromServer
    >('projectReferenceFromServer', {}, this.optionsIndexedByUuid);

    this.meshNodeReferenceFromServer = new schema.Entity<
      NodeReferenceFromServer
    >(
      'meshNodeReferenceFromServer',
      {
        schema: this.meshSchemaResponse
      },
      this.optionsIndexedByUuid
    );

    this.userNodeReference = new schema.Entity<UserNodeReference>(
      'userNodeReference',
      {
        schema: this.meshSchemaResponse
      },
      this.optionsIndexedByUuid
    );

    this.meshUser = new schema.Entity<User>(
      'meshUser',
      {
        // nodeReference: userNodeReference,
      },
      this.optionsIndexedByUuid
    );

    this.meshSchemaResponse.define({
      creator: this.meshUser,
      editor: this.meshUser
    });

    this.meshRole = new schema.Entity<Role>(
      'meshRole',
      {},
      this.optionsIndexedByUuid
    );

    this.meshGroup = new schema.Entity<Group>(
      'meshGroup',
      {
        creator: this.meshUser,
        editor: this.meshUser,
        roles: [this.meshRole]
      },
      this.optionsIndexedByUuid
    );

    this.meshTagFamily = new schema.Entity<TagFamily>(
      'meshTagFamily',
      {
        creator: this.meshUser,
        editor: this.meshUser
      },
      this.optionsIndexedByUuid
    );

    this.meshTag = new schema.Entity<Tag>(
      'meshTag',
      {
        creator: this.meshUser,
        editor: this.meshUser,
        tagFamily: this.meshTagFamily
      },
      this.optionsIndexedByUuid
    );

    this.meshNodeChildrenFromServer = new schema.Entity<
      NodeChildrenInfoFromServer
    >('meshNodeChildrenFromServer', {}, this.optionsIndexedBySchemaUuid);

    this.meshNode = new schema.Entity<MeshNode<T>>(
      'meshNode',
      {
        availableLanguages: {
          publisher: this.meshUser
        },
        breadcrumb: [this.meshNodeReferenceFromServer],
        childrenInfo: this.meshNodeChildrenFromServer,
        creator: this.meshUser,
        editor: this.meshUser,
        schema: this.meshSchemaResponse,
        project: this.projectReferenceFromServer,
        tags: [this.meshTag]
      },
      this.optionsIndexedByUuid
    );
    this.meshNode.define({ parentNode: this.meshNode });
  }
}
