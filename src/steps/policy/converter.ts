import {
  createDirectRelationship,
  createIntegrationEntity,
  Entity,
  Relationship,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { SecureWorkloadPolicy } from '../../types';

import { Entities } from '../constants';

function protocolNumberToString(proto: number | null) {
  switch (proto) {
    case 1:
      return 'ICMP';
    case 6:
      return 'TCP';
    case 17:
      return 'UDP';
    case null:
      return 'Any';
    default:
      return `${proto}`;
  }
}

export function createPolicyEntity(csw_policy: SecureWorkloadPolicy): Entity {
  const ports = csw_policy.l4_params?.map((param) => {
    let port = '';
    if (param.proto !== undefined) {
      port += protocolNumberToString(param.proto);
      if (param.port) {
        port += ' : ';
      }
    }
    if (param.port) {
      if (param.port[0] === param.port[1]) {
        port += param.port[0];
      } else {
        port += `${param.port[0]}-${param.port[1]}`;
      }
    }
    if (param.description) {
      port += ` (${param.description})`;
    }
    return port;
  });
  return createIntegrationEntity({
    entityData: {
      source: csw_policy,
      assign: {
        _type: Entities.POLICY._type,
        _class: Entities.POLICY._class,
        _key: csw_policy.id,
        name: csw_policy.id,
        action: csw_policy.action,
        consumer: csw_policy.consumer_filter?.name,
        provider: csw_policy.provider_filter?.name,
        ports,
      },
    },
  });
}

export function createAccountPolicyRelationship(
  account: Entity,
  policy: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: account,
    to: policy,
  });
}

export function createPolicyScopeRelationship(
  policy: Entity,
  scope: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: policy,
    to: scope,
  });
}
