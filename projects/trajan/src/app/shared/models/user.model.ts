import { SchemaReference } from './common.model';
import {
  PermissionInfoFromServer,
  UserReferenceFromServer,
  UserResponse
} from './server-models';

export interface UserNodeReference {
  projectName: string;
  uuid: string;
  displayName: string;
  schema: SchemaReference;
}

export interface User extends UserResponse {
  // TODO: these should not be needed after resolving https://github.com/gentics/mesh-model-generator/issues/13
  editor: UserReferenceFromServer;
  rolePerms: PermissionInfoFromServer;
  // This is being overridden from the UserResponse because the interface
  // for nodeReference is incomplete in the RAML
  // See: https://github.com/gentics/mesh/issues/399
  nodeReference?: UserNodeReference;
}
