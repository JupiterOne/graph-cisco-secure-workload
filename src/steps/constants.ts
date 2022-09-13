import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const Steps = {
  ACCOUNT: 'fetch-account',
  USERS: 'fetch-users',
  ROLES: 'fetch-roles',
  USER_ROLE_RELATIONSHIPS: 'build-user-role-relationships',
  SCOPES: 'fetch-scopes',
  SCOPE_RELATIONSHIPS: 'build-scope-relationships',
  USER_SCOPE_RELATIONSHIPS: 'build-user-scope-relationships',
  ROLE_SCOPE_RELATIONSHIPS: 'build-role-scope-relationships',
  POLICY_SCOPE_RELATIONSHIPS: 'build-policy-scope-relationships',
  WORKLOADS: 'fetch-workloads',
  INTERFACE_SCOPE_RELATIONSHIPS: 'build-interface-scope-relationships',
  PACKAGES: 'fetch-packages',
  WORKLOAD_FINDINGS: 'fetch-workload-findings',
  POLICIES: 'fetch-policies',
};

export const Entities: Record<
  | 'ACCOUNT'
  | 'USER'
  | 'ROLE'
  | 'SCOPE'
  | 'WORKLOAD'
  | 'INTERFACE'
  | 'PACKAGE'
  | 'WORKLOAD_FINDING'
  | 'POLICY',
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
  ROLE: {
    resourceName: 'Role',
    _type: 'csw_role',
    _class: ['AccessRole'],
    schema: {
      properties: {
        id: { type: 'string' },
        app_scope_id: { type: 'string' },
        name: { type: 'string' },
        description: { type: ['string', 'null'] },
      },
      required: ['id'],
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
  PACKAGE: {
    resourceName: 'Package',
    _type: 'csw_package',
    _class: ['CodeModule'],
    schema: {
      properties: {
        architecture: { type: 'string' },
        name: { type: 'string' },
        publisher: { type: 'string' },
        version: { type: 'string' },
      },
      required: ['name'],
    },
  },
  WORKLOAD_FINDING: {
    resourceName: 'Workload Vulnerability',
    _type: 'csw_workload_finding',
    _class: ['Finding'],
    schema: {
      properties: {
        cveID: { type: 'string' },
        v2Score: { type: 'number' },
        v2AccessComplexity: { type: 'string' },
        v2AccessVector: { type: 'string' },
        v2Authentication: { type: 'string' },
        v2AvailabilityImpact: { type: 'string' },
        v2ConfidentialityImpact: { type: 'string' },
        v2IntegrityImpact: { type: 'string' },
        v2Severity: { type: 'string' },
        v3Score: { type: 'number' },
        v3AttackComplexity: { type: 'string' },
        v3AttackVector: { type: 'string' },
        v3AvailabilityImpact: { type: 'string' },
        v3BaseSeverety: { type: 'string' },
        v3ConfidentialityImpact: { type: 'string' },
        v3IntegrityImpact: { type: 'string' },
        v3PrivilegesRequired: { type: 'string' },
        v3Scope: { type: 'string' },
        v3UserInteraction: { type: 'string' },
      },
    },
  },
  POLICY: {
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
};

export const Relationships: Record<
  | 'ACCOUNT_HAS_USER'
  | 'ACCOUNT_HAS_ROLE'
  | 'ACCOUNT_HAS_POLICY'
  | 'USER_HAS_ROLE'
  | 'SCOPE_HAS_SCOPE'
  | 'USER_ASSIGNED_SCOPE'
  | 'ROLE_USES_SCOPE'
  | 'INTERFACE_HAS_SCOPE'
  | 'WORKLOAD_HAS_INTERFACE'
  | 'WORKLOAD_HAS_PACKAGE'
  | 'WORKLOAD_HAS_WORKLOAD_FINDING'
  | 'PACKAGE_HAS_WORKLOAD_FINDING'
  | 'POLICY_HAS_SCOPE',
  StepRelationshipMetadata
> = {
  ACCOUNT_HAS_USER: {
    _type: 'csw_account_has_user',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER._type,
  },
  ACCOUNT_HAS_ROLE: {
    _type: 'csw_account_has_role',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.ROLE._type,
  },
  ACCOUNT_HAS_POLICY: {
    _type: 'csw_account_has_policy',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.POLICY._type,
  },
  USER_HAS_ROLE: {
    _type: 'csw_user_has_role',
    sourceType: Entities.USER._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.ROLE._type,
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
  ROLE_USES_SCOPE: {
    _type: 'csw_role_uses_scope',
    sourceType: Entities.ROLE._type,
    _class: RelationshipClass.USES,
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
  WORKLOAD_HAS_PACKAGE: {
    _type: 'csw_project_has_package',
    sourceType: Entities.WORKLOAD._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.PACKAGE._type,
  },
  WORKLOAD_HAS_WORKLOAD_FINDING: {
    _type: 'csw_project_has_workload_finding',
    sourceType: Entities.WORKLOAD._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.WORKLOAD_FINDING._type,
  },
  PACKAGE_HAS_WORKLOAD_FINDING: {
    _type: 'csw_package_has_workload_finding',
    sourceType: Entities.PACKAGE._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.WORKLOAD_FINDING._type,
  },
  POLICY_HAS_SCOPE: {
    _type: 'csw_policy_has_scope',
    sourceType: Entities.POLICY._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.SCOPE._type,
  },
};
