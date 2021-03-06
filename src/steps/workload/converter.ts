import {
  createIntegrationEntity,
  createDirectRelationship,
  Entity,
  RelationshipClass,
  Relationship,
  assignTags,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { SecureWorkloadInterface, SecureWorkloadProject } from '../../types';

import { createHash } from 'crypto';

export function createProjectEntity(project: SecureWorkloadProject): Entity {
  return createIntegrationEntity({
    entityData: {
      source: project,
      assign: {
        _type: Entities.WORKLOAD._type,
        _class: Entities.WORKLOAD._class,
        _key: project.uuid,
        agentType: project.agent_type,
        hostName: project.host_name,
        lastSoftwareUpdate: project.last_software_update,
        platform: project.platform,
        uuid: project.uuid,
        windowsEnforcementMode: project.windows_enforcement_mode,
        name: project.host_name,
        displayName: project.host_name,
      },
    },
  });
}

export function createInterfaceEntity(
  csw_interface: SecureWorkloadInterface,
  workloadUUID: string,
): Entity {
  const entity = createIntegrationEntity({
    entityData: {
      source: csw_interface,
      assign: {
        _type: Entities.INTERFACE._type,
        _class: Entities.INTERFACE._class,
        _key:
          workloadUUID +
          createHash('sha256')
            .update(JSON.stringify(csw_interface))
            .digest('hex'),
        ip: csw_interface.ip,
        mac: csw_interface.mac,
        name: csw_interface.name,
        netmask: csw_interface.netmask,
        pcapOpened: csw_interface.pcap_opened,
        tagsScopeID: csw_interface.tags_scope_id,
        vrf: csw_interface.vrf,
        vrfID: csw_interface.vrf_id,
      },
    },
  });
  if (csw_interface.tags) {
    assignTags(
      entity,
      Object.entries(csw_interface.tags).map(([key, value]) => ({
        key,
        value: (Array.isArray(value) ? value.join(', ') : value) as string,
      })),
    );
  }
  return entity;
}

export function createInterfaceScopeRelationship(
  csw_interface: Entity,
  scope: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: csw_interface,
    to: scope,
  });
}

export function createWorkloadInterfaceRelationship(
  workload: Entity,
  csw_interface: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: workload,
    to: csw_interface,
  });
}
