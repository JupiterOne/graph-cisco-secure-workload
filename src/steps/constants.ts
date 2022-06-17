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
  USER_SCOPE_RELATIONSHIPS: 'build-user-scope-relationships',
  WORKLOADS: 'fetch-workloads',
  INTERFACE_SCOPE_RELATIONSHIPS: 'build-interface-scope-relationships',
};

export const Entities: Record<
  'ACCOUNT' | 'USER' | 'SCOPE' | 'WORKLOAD' | 'INTERFACE',
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
  WORKLOAD: {
    resourceName: 'Workload',
    _type: 'csw_project',
    _class: ['Project'],
    schema: {
      properties: {
        agentType: { type: 'string' },
        hostName: { type: 'string' },
        lastSoftwareUpdate: { type: 'string' },
        platform: { type: 'string' },
        uuid: { type: 'string' },
        windowsEnforcementMode: { type: 'string' },
      },
      required: ['uuid'],
    },
  },
  INTERFACE: {
    resourceName: 'Interface',
    _type: 'csw_interface',
    _class: ['Application'],
    schema: {
      properties: {
        ip: { type: 'string' },
        mac: { type: 'string' },
        name: { type: 'string' },
        netmask: { type: 'string' },
        pcapOpened: { type: 'boolean' },
        tagsScopeID: { type: ['string', 'array'] },
        vrf: { type: 'string' },
        vrfID: { type: 'number' },
      },
      required: [],
    },
  },
};

export const Relationships: Record<
  | 'ACCOUNT_HAS_USER'
  | 'SCOPE_HAS_SCOPE'
  | 'USER_ASSIGNED_SCOPE'
  | 'INTERFACE_HAS_SCOPE'
  | 'WORKLOAD_HAS_INTERFACE',
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
  USER_ASSIGNED_SCOPE: {
    _type: 'csw_user_assigned_scope',
    sourceType: Entities.USER._type,
    _class: RelationshipClass.ASSIGNED,
    targetType: Entities.SCOPE._type,
  },
  INTERFACE_HAS_SCOPE: {
    _type: 'csw_interface_has_scope',
    sourceType: Entities.INTERFACE._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.SCOPE._type,
  },
  WORKLOAD_HAS_INTERFACE: {
    _type: 'csw_project_has_interface',
    sourceType: Entities.WORKLOAD._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.INTERFACE._type,
  },
};
