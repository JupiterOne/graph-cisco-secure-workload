import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const roleSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://localhost/api/v1/roles
     * PATTERN: Fetch Entities
     */
    id: 'fetch-roles',
    name: 'Fetch Roles',
    entities: [
      {
        resourceName: 'Role',
        _type: 'csw_role',
        _class: ['AccessRole'],
      },
    ],
    relationships: [
      {
        _type: 'csw_account_has_role',
        sourceType: 'csw_account',
        _class: RelationshipClass.HAS,
        targetType: 'csw_role',
      },
    ],
    dependsOn: ['fetch-account'],
    implemented: true,
  },
];
