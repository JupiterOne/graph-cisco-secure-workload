import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const scopeSpec: StepSpec<IntegrationConfig>[] = [
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
    dependsOn: [],
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
    id: 'build-user-scope-relationships',
    name: 'Build User -> Scope Relationships',
    entities: [],
    relationships: [
      {
        _type: 'csw_user_assigned_scope',
        sourceType: 'csw_user',
        _class: RelationshipClass.ASSIGNED,
        targetType: 'csw_scope',
      },
    ],
    dependsOn: ['fetch-scopes', 'fetch-users'],
    implemented: true,
  },
];
