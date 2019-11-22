import { schema } from 'normalizr';
import { MeshNode, NodeFieldMicronode } from '../models/node.model';
import { MicroschemaReference } from '../models/common.model';
import {
  ProjectReferenceFromServer,
  NodeChildrenInfoFromServer,
  SchemaResponse
} from '../models/server-models';
import { UserNodeReference, User } from '../models/user.model';
import { TagFamily } from '../models/tag-family.model';
import { Tag } from '../models/tag.model';
import { Role } from '../models/role.model';
import { Group } from '../models/group.model';

/**
 * # Normalizr schemas for Mesh entities
 */

/**
 * ## predefined Normalizr Schema options for indexing via Mesh properties
 */
const optionsIndexedByUuid = {
  idAttribute: 'uuid'
};

const optionsIndexedbyJobUuid = {
  idAttribute: 'jobUuid'
};

const optionsIndexedBySchemaUuid = {
  idAttribute: 'schemaUuid'
};

/**
 * ## Normalizr Schemas
 */
export const meshSchema = new schema.Entity<SchemaResponse>(
  'meshSchema',
  {
    // creator: meshUser, // defined later
    // editor: meshUser, // defined later
  },
  optionsIndexedByUuid
);

export const meshMicroschema = new schema.Entity<MicroschemaReference>(
  'meshMicroschema',
  {},
  optionsIndexedbyJobUuid
);

export const meshNodeFieldMicronode = new schema.Entity<NodeFieldMicronode>(
  'meshNodeFieldMicronode',
  {
    microschema: meshMicroschema
  },
  optionsIndexedByUuid
);

export const projectReference = new schema.Entity<ProjectReferenceFromServer>(
  'projectReference',
  {},
  optionsIndexedByUuid
);

export const meshNodeReference = new schema.Entity(
  'meshNodeReference',
  {
    schema: meshSchema
  },
  optionsIndexedByUuid
);

export const userNodeReference = new schema.Entity<UserNodeReference>(
  'userNodeReference',
  {
    schema: meshSchema
  },
  optionsIndexedByUuid
);

export const meshUser = new schema.Entity<User>(
  'meshUser',
  {
    // nodeReference: userNodeReference,
  },
  optionsIndexedByUuid
);
// meshUser.define({ editor: meshUser });
meshSchema.define({
  creator: meshUser,
  editor: meshUser
});

export const meshRole = new schema.Entity<Role>(
  'meshRole',
  {},
  optionsIndexedByUuid
);

export const meshGroup = new schema.Entity<Group>(
  'meshGroup',
  {
    creator: meshUser,
    editor: meshUser,
    roles: [meshRole]
  },
  optionsIndexedByUuid
);

export const meshTagFamily = new schema.Entity<TagFamily>(
  'meshTagFamily',
  {
    creator: meshUser,
    editor: meshUser
  },
  optionsIndexedByUuid
);

export const meshTag = new schema.Entity<Tag>(
  'meshTag',
  {
    creator: meshUser,
    editor: meshUser,
    tagFamily: meshTagFamily
  },
  optionsIndexedByUuid
);

export const meshNodeChildren = new schema.Entity<NodeChildrenInfoFromServer>(
  'meshNodeChildren',
  {},
  optionsIndexedBySchemaUuid
);

export const meshNode = new schema.Entity<MeshNode>(
  'meshNode',
  {
    availableLanguages: {
      publisher: meshUser
    },
    breadcrumb: [meshNodeReference],
    childrenInfo: meshNodeChildren,
    creator: meshUser,
    editor: meshUser,
    schema: meshSchema,
    project: projectReference,
    tags: [meshTag]
  },
  optionsIndexedByUuid
);
meshNode.define({ parentNode: meshNode });
