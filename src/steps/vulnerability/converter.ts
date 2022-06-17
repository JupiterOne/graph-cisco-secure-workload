import {
  createIntegrationEntity,
  createDirectRelationship,
  Entity,
  RelationshipClass,
  Relationship,
} from '@jupiterone/integration-sdk-core';
import { SecureWorkloadPackage } from '../../types';

import { Entities } from '../constants';

import { createHash } from 'crypto';

export function createPackageEntity(
  csw_package: SecureWorkloadPackage,
  workloadUUID: string,
): Entity {
  return createIntegrationEntity({
    entityData: {
      source: csw_package,
      assign: {
        _type: Entities.PACKAGE._type,
        _class: Entities.PACKAGE._class,
        _key:
          workloadUUID +
          createHash('sha256')
            .update(JSON.stringify(csw_package))
            .digest('hex'),
        architecture: csw_package.architecture,
        name: csw_package.name,
        publisher: csw_package.publisher,
        version: csw_package.version,
      },
    },
  });
}

export function createWorkloadPackageRelationship(
  workload: Entity,
  csw_package: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: workload,
    to: csw_package,
  });
}
