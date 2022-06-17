import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const packageSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: [https://localhost/api/v1/workload/{uuid}/packages]
     * PATTERN: Fetch Entities
     */
    id: 'fetch-packages',
    name: 'Fetch Packages',
    entities: [
      {
        resourceName: 'Package',
        _type: 'csw_package',
        _class: ['CodeModule'],
        schema: {
          properties: {
            architecture: { type: 'string' },
            name: { type: 'string' },
            publisher: { type: 'string' },
            version: { type: 'string' },
          },
        },
      },
    ],
    relationships: [
      {
        _type: 'csw_project_has_package',
        sourceType: 'csw_project',
        _class: RelationshipClass.HAS,
        targetType: 'csw_package',
      },
    ],
    dependsOn: ['fetch-workloads'],
    implemented: true,
  },
];
