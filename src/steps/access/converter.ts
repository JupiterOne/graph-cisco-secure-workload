import {
  createIntegrationEntity,
  createDirectRelationship,
  Entity,
  RelationshipClass,
  Relationship,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { SecureWorkloadUser } from '../../types';

export function createUserEntity(user: SecureWorkloadUser): Entity {
  return createIntegrationEntity({
    entityData: {
      source: user,
      assign: {
        _type: Entities.USER._type,
        _class: Entities.USER._class,
        _key: user.id,
        username: user.id,
        email: user.email,
        active: true,
        firstName: user.first_name,
        lastName: user.last_name,
        appScopeID: user.app_scope_id,
        roleIDs: user.role_ids,
        bypassExternalAuth: user.bypass_external_auth,
        disabledAt: user.disabled_at,
        name: user.id,
        displayName: `${user.first_name} ${user.last_name}`,
      },
    },
  });
}

export function createAccountUserRelationship(
  account: Entity,
  user: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: account,
    to: user,
  });
}

export function createUserRoleRelationship(
  user: Entity,
  role: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: user,
    to: role,
  });
}
