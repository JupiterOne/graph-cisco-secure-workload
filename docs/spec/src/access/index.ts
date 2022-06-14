import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const accessSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://localhost/api/v1/users
     * PATTERN: Fetch Entities
     */
    id: 'fetch-users',
    name: 'Fetch Users',
    entities: [
      {
        resourceName: 'User',
        _type: 'csw_user',
        _class: ['User'],
      },
    ],
    relationships: [
      {
        _type: 'csw_account_has_user',
        sourceType: 'csw_account',
        _class: RelationshipClass.HAS,
        targetType: 'csw_user',
      },
    ],
    dependsOn: ['fetch-account'],
    implemented: true,
  },
];
