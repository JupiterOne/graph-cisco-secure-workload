import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const Steps = {
  ACCOUNT: 'fetch-account',
  USERS: 'fetch-users',
  SCOPES: 'fetch-scopes',
  SCOPE_RELATIONSHIPS: 'build-scope-relationships',
  SCOPE_USER_RELATIONSHIPS: 'build-scope-user-relationships',
};

export const Entities: Record<
  'ACCOUNT' | 'USER' | 'SCOPE',
  StepEntityMetadata
> = {
  ACCOUNT: {
    resourceName: 'Account',
    _type: 'csw_account',
    _class: ['Account'],
    schema: {
      properties: {},
      required: [],
    },
  },
  USER: {
    resourceName: 'User',
    _type: 'csw_user',
    _class: ['User'],
    schema: {
      properties: {
        id: { type: 'string' },
        email: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        appScopeID: { type: 'string' },
        roleIDs: { type: 'array', items: { type: 'string' } },
        bypassExternalAuth: { type: 'boolean' },
        disabledAt: { type: ['number', 'null'] },
      },
      required: [
        'id',
        'email',
        'firstName',
        'lastName',
        'roleIDs',
        'bypassExternalAuth',
      ],
    },
  },
  SCOPE: {
    resourceName: 'Scope',
    _type: 'csw_scope',
    _class: ['Group'],
    schema: {
      properties: {
        id: { type: 'string' },
        shortName: { type: 'string' },
        name: { type: 'string' },
        description: { type: ['string', 'null'] },
        vrfID: { type: 'number' },
        parentAppScopeID: { type: 'string' },
        childAppScopeIDs: { type: 'array', items: { type: 'string' } },
      },
      required: [
        'id',
        'shortName',
        'name',
        'vrfID',
        'parentAppScopeID',
        'childAppScopeIDs',
      ],
    },
  },
};

export const Relationships: Record<
  'ACCOUNT_HAS_USER' | 'SCOPE_HAS_SCOPE' | 'SCOPE_ASSIGNED_USER',
  StepRelationshipMetadata
> = {
  ACCOUNT_HAS_USER: {
    _type: 'csw_account_has_user',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER._type,
  },
  SCOPE_HAS_SCOPE: {
    _type: 'csw_scope_has_scope',
    sourceType: Entities.SCOPE._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.SCOPE._type,
  },
  SCOPE_ASSIGNED_USER: {
    _type: 'csw_scope_assigned_user',
    sourceType: Entities.SCOPE._type,
    _class: RelationshipClass.ASSIGNED,
    targetType: Entities.USER._type,
  },
};
