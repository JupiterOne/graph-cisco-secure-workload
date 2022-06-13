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
  {
    /**
     * ENDPOINT: https://localhost/api/v1/app_scopes
     * PATTERN: Fetch Entities
     */
    id: 'fetch-scopes',
    name: 'Fetch Scopes',
    entities: [
      {
        resourceName: 'Scope',
        _type: 'csw_scope',
        _class: ['Group'],
      },
    ],
    relationships: [],
    dependsOn: ['fetch-users'],
    implemented: true,
  },
  {
    /**
     * n/a
     * PATTERN: Build Child Relationships
     */
    id: 'build-scope-relationships',
    name: 'Build Scope -> Scope Relationships',
    entities: [],
    relationships: [
      {
        _type: 'csw_scope_has_scope',
        sourceType: 'csw_scope',
        _class: RelationshipClass.HAS,
        targetType: 'csw_scope',
      },
    ],
    dependsOn: ['fetch-scopes'],
    implemented: true,
  },
  {
    /**
     * n/a
     * PATTERN: Build Child Relationships
     */
    id: 'build-scope-user-relationships',
    name: 'Build Scope -> User Relationships',
    entities: [],
    relationships: [
      {
        _type: 'csw_scope_assigned_user',
        sourceType: 'csw_scope',
        _class: RelationshipClass.ASSIGNED,
        targetType: 'csw_user',
      },
    ],
    dependsOn: ['fetch-scopes'],
    implemented: true,
  },
];
