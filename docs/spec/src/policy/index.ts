import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const policySpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: [https://localhost/api/v1/applications/{policyId}/policies]
     * PATTERN: Fetch Entities
     */
    id: 'fetch-policies',
    name: 'Fetch Policies',
    entities: [
      {
        resourceName: 'Policy',
        _type: 'csw_policy',
        _class: ['ControlPolicy'],
        schema: {
          properties: {
            action: { type: 'string' },
            consumer: { type: 'string' },
            provider: { type: 'string' },
            ports: { type: 'array', items: { type: 'string' } },
          },
        },
      },
    ],
    relationships: [
      {
        _type: 'csw_account_has_policy',
        sourceType: 'csw_account',
        _class: RelationshipClass.HAS,
        targetType: 'csw_policy',
      },
    ],
    dependsOn: ['fetch-account'],
    implemented: true,
  },
  {
    /**
     * ENDPOINT: []
     * PATTERN: Build Child Relationships
     */
    id: 'build-policy-scope-relationships',
    name: 'Build Policy -> Scope Relationships',
    entities: [],
    relationships: [
      {
        _type: 'csw_policy_has_scope',
        sourceType: 'csw_policy',
        _class: RelationshipClass.HAS,
        targetType: 'csw_scope',
      },
    ],
    dependsOn: ['fetch-policies', 'fetch-scopes'],
    implemented: true,
  },
];
