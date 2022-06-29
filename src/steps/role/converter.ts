import {
  createIntegrationEntity,
  createDirectRelationship,
  Entity,
  RelationshipClass,
  Relationship,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { SecureWorkloadRole } from '../../types';

export function createRoleEntity(role: SecureWorkloadRole): Entity {
  return createIntegrationEntity({
    entityData: {
      source: role,
      assign: {
        _type: Entities.ROLE._type,
        _class: Entities.ROLE._class,
        _key: role.id,
        appScopeID: role.app_scope_id,
        displayName: role.name,
        name: role.name,
        description: role.description,
        id: role.id,
      },
    },
  });
}

export function createAccountRoleRelationship(
  account: Entity,
  role: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: account,
    to: role,
  });
}
