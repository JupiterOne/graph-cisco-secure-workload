import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const Steps = {
  ACCOUNT: 'fetch-account',
  USERS: 'fetch-users',
  GROUPS: 'fetch-groups',
  USER_GROUP_RELATIONSHIPS: 'build-user-group-relationships',
};

export const Entities: Record<
  'ACCOUNT' | 'GROUP' | 'USER',
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
  GROUP: {
    resourceName: 'UserGroup',
    _type: 'csw_group',
    _class: ['UserGroup'],
    schema: {
      properties: {
        email: { type: 'string' },
        logoLink: { type: 'string' },
      },
      required: ['email', 'logoLink'],
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
        disabledAt: { type: 'number' },
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
  'ACCOUNT_HAS_USER' | 'ACCOUNT_HAS_GROUP' | 'USER_HAS_GROUP',
  StepRelationshipMetadata
> = {
  ACCOUNT_HAS_USER: {
    _type: 'csw_account_has_user',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER._type,
  },
  ACCOUNT_HAS_GROUP: {
    _type: 'csw_account_has_group',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.GROUP._type,
  },
  USER_HAS_GROUP: {
    _type: 'csw_user_has_group',
    sourceType: Entities.USER._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.GROUP._type,
  },
};
