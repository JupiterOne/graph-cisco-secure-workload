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
      {
        _type: 'csw_user_has_account',
        sourceType: 'csw_user',
        _class: RelationshipClass.HAS,
        targetType: 'csw_account',
      },
    ],
    dependsOn: ['fetch-account'],
    implemented: true,
  },
  {
    /**
     * ENDPOINT: https://localhost/api/v1/groups
     * PATTERN: Fetch Entities
     */
    id: 'fetch-groups',
    name: 'Fetch Groups',
    entities: [
      {
        resourceName: 'UserGroup',
        _type: 'csw_group',
        _class: ['UserGroup'],
      },
    ],
    relationships: [
      {
        _type: 'csw_account_has_group',
        sourceType: 'csw_account',
        _class: RelationshipClass.HAS,
        targetType: 'csw_group',
      },
    ],
    dependsOn: ['fetch-account'],
    implemented: true,
  },
  {
    /**
     * ENDPOINT: n/a
     * PATTERN: Build Child Relationships
     */
    id: 'build-user-group-relationships',
    name: 'Build User -> Group Relationships',
    entities: [],
    relationships: [
      {
        _type: 'csw_user_has_group',
        sourceType: 'csw_user',
        _class: RelationshipClass.HAS,
        targetType: 'csw_group',
      },
    ],
    dependsOn: ['fetch-groups', 'fetch-users'],
    implemented: true,
  },
];
