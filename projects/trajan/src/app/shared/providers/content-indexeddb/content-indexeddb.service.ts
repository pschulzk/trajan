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

@Injectable()
export class ContentIndexedDbService extends Dexie {
  constructor() {
    super('Entities');
    this.version(1).stores({
      meshSchema: 'uuid',
      meshMicroschema: 'jobUuid',
      meshNodeFieldMicronode: 'uuid',
      projectReference: 'uuid',
      userNodeReference: 'uuid',
      meshUser: 'uuid',
      meshRole: 'uuid',
      meshGroup: 'uuid',
      meshNodeChildren: 'schemaUuid',
      meshNode: 'uuid',
      meshTagFamily: 'uuid',
      meshTag: 'uuid'
    });
  }
}
