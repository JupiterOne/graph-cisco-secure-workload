import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const packageSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: [https://localhost/api/v1/workload/{uuid}/packages]
     * PATTERN: Fetch Entities
     */
    id: 'fetch-packages-workload-findings',
    name: 'Fetch Packages And Workload Findings',
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
      {
        resourceName: 'Workload Vulnerability',
        _type: 'csw_workload_finding',
        _class: ['Finding'],
        schema: {
          properties: {
            cveID: { type: 'string' },
            v2Score: { type: 'number' },
            v2AccessComplexity: { type: 'string' },
            v2AccessVector: { type: 'string' },
            v2Authentication: { type: 'string' },
            v2AvailabilityImpact: { type: 'string' },
            v2ConfidentialityImpact: { type: 'string' },
            v2IntegrityImpact: { type: 'string' },
            v2Severity: { type: 'string' },
            v3Score: { type: 'number' },
            v3AttackComplexity: { type: 'string' },
            v3AttackVector: { type: 'string' },
            v3AvailabilityImpact: { type: 'string' },
            v3BaseSeverety: { type: 'string' },
            v3ConfidentialityImpact: { type: 'string' },
            v3IntegrityImpact: { type: 'string' },
            v3PrivilegesRequired: { type: 'string' },
            v3Scope: { type: 'string' },
            v3UserInteraction: { type: 'string' },
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
      {
        _type: 'csw_project_has_workload_finding',
        sourceType: 'csw_project',
        _class: RelationshipClass.HAS,
        targetType: 'csw_workload_finding',
      },
      {
        _type: 'csw_package_has_workload_finding',
        sourceType: 'csw_package',
        _class: RelationshipClass.HAS,
        targetType: 'csw_workload_finding',
      },
    ],
    dependsOn: ['fetch-workloads'],
    implemented: true,
  },
];
