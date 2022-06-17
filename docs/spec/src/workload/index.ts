import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const workloadSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: [https://localhost/api/v1/inventory/search, https://localhost/api/v1/workload/{uuid}]
     * PATTERN: Fetch Entities
     */
    id: 'fetch-workloads',
    name: 'Fetch Workloads',
    entities: [
      {
        resourceName: 'Workload',
        _type: 'csw_project',
        _class: ['Project'],
        schema: {
          properties: {
            agent_type: { type: 'string' },
            host_name: { type: 'string' },
            last_software_update: { type: 'string' },
            platform: { type: 'string' },
            uuid: { type: 'string' },
            windows_enforcement_modestring: { type: 'string' },
          },
        },
      },
      {
        resourceName: 'Interface',
        _type: 'csw_interface',
        _class: ['Application'],
        schema: {
          properties: {
            ip: { type: 'string' },
            mac: { type: 'string' },
            name: { type: 'string' },
            netmask: { type: 'string' },
            pcapOpened: { type: 'boolean' },
            tagsScopeID: { type: ['string', 'array'] },
            vrf: { type: 'string' },
            vrfID: { type: 'number' },
          },
        },
      },
    ],
    relationships: [
      {
        _type: 'csw_project_has_interface',
        sourceType: 'csw_project',
        _class: RelationshipClass.HAS,
        targetType: 'csw_interface',
      },
    ],
    dependsOn: [],
    implemented: true,
  },
  {
    /**
     * n/a
     * PATTERN: Build Child Relationships
     */
    id: 'build-interface-scope-relationships',
    name: 'Build Interface -> Scope Relationships',
    entities: [],
    relationships: [
      {
        _type: 'csw_interface_has_scope',
        sourceType: 'csw_interface',
        _class: RelationshipClass.HAS,
        targetType: 'csw_scope',
      },
    ],
    dependsOn: ['fetch-scopes', 'fetch-workloads'],
    implemented: true,
  },
];
