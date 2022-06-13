import {
  createIntegrationEntity,
  createDirectRelationship,
  Entity,
  RelationshipClass,
  Relationship,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { SecureWorkloadScope, SecureWorkloadUser } from '../../types';

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

export function createScopeEntity(scope: SecureWorkloadScope): Entity {
  return createIntegrationEntity({
    entityData: {
      source: scope,
      assign: {
        _type: Entities.SCOPE._type,
        _class: Entities.SCOPE._class,
        _key: scope.id,
        id: scope.id,
        shortName: scope.short_name,
        name: scope.name,
        description: scope.description || '', // Must be string by entity schema
        vrfID: scope.vrf_id,
        parentAppScopeID: scope.parent_app_scope_id,
        childAppScopeIDs: scope.child_app_scope_ids,
        displayName: scope.short_name,
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

export function createScopeRelationship(
  scope: Entity,
  childScope: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: scope,
    to: childScope,
  });
}

export function createScopeUserRelationship(
  scope: Entity,
  user: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.ASSIGNED,
    from: scope,
    to: user,
  });
}
