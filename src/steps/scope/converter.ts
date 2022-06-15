import {
  createIntegrationEntity,
  createDirectRelationship,
  Entity,
  RelationshipClass,
  Relationship,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { SecureWorkloadScope } from '../../types';

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
        description: scope.description,
        vrfID: scope.vrf_id,
        parentAppScopeID: scope.parent_app_scope_id,
        childAppScopeIDs: scope.child_app_scope_ids,
        displayName: scope.short_name,
      },
    },
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
