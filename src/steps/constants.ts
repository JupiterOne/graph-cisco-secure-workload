import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const Steps = {
  ACCOUNT: 'fetch-account',
  USERS: 'fetch-users',
};

export const Entities: Record<'ACCOUNT' | 'USER', StepEntityMetadata> = {
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
};

export const Relationships: Record<
  'ACCOUNT_HAS_USER',
  StepRelationshipMetadata
> = {
  ACCOUNT_HAS_USER: {
    _type: 'csw_account_has_user',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER._type,
  },
};
