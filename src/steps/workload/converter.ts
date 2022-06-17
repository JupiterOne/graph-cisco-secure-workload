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
        windowsEnforcementModestring: project.windows_enforcement_modestring,
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
  const tags = csw_interface.tags;
  delete csw_interface.tags;
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
  if (tags) {
    assignTags(
      entity,
      Object.entries(tags).map(([key, value]) => ({
        /**
         * 1: Converts snake_case to camelCase
         * 2: Converts / to .
         * Example:
         * example_tag_1/example_Tag__2 => exampleTag1.exampleTag2
         */
        key: key
          .replace(/_([a-z])/g, (_, $1) => $1.toUpperCase())
          .replace(/_/g, '')
          .replace(/\//g, '.'),
        value: (Array.isArray(value) ? value.join(', ') : value) as string,
      })),
    );
    csw_interface.tags = tags;
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
