import {
  createIntegrationEntity,
  createDirectRelationship,
  Entity,
  RelationshipClass,
  Relationship,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { SecureWorkloadNetworkFinding } from '../../types';

export function createNetworkEntity(
  network: SecureWorkloadNetworkFinding,
): Entity {
  return createIntegrationEntity({
    entityData: {
      source: network,
      assign: {
        _type: Entities.NETWORK._type,
        _class: Entities.NETWORK._class,
        _key: network.ip,
        ip: network.ip,
      },
    },
  });
}

export function createNetworkFindingEntity(
  cve_id: string,
  network: SecureWorkloadNetworkFinding,
): Entity {
  return createIntegrationEntity({
    entityData: {
      source: network,
      assign: {
        _type: Entities.NETWORK_FINDING._type,
        _class: Entities.NETWORK_FINDING._class,
        _key: `${network.ip}:${cve_id}`,
        cveId: cve_id,
      },
    },
  });
}

export function createScopeNetworkRelationship(
  scope: Entity,
  network: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: scope,
    to: network,
  });
}

export function createWorkloadNetworkRelationship(
  workload: Entity,
  network: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.CONNECTS,
    from: workload,
    to: network,
  });
}

export function createNetworkFindingRelationship(
  network: Entity,
  network_finding: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: network,
    to: network_finding,
  });
}
