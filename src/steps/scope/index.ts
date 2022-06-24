import {
  getRawData,
  IntegrationMissingKeyError,
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { SecureWorkloadScope, SecureWorkloadUser } from '../../types';
import { Entities, Steps, Relationships } from '../constants';
import {
  createScopeEntity,
  createScopeRelationship,
  createUserScopeRelationship,
} from './converter';

export async function fetchScopes({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await apiClient.iterateScopes(async (scope) => {
    // Sets the rootScopeID for use in networks.
    if (!(await jobState.getData('rootScopeID')) && scope.root_app_scope_id) {
      await jobState.setData('rootScopeID', scope.root_app_scope_id);
    }
    await jobState.addEntity(createScopeEntity(scope));
  });
}

export async function buildScopeRelationships({
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  await jobState.iterateEntities(
    { _type: Entities.SCOPE._type },
    async (scopeEntity) => {
      const scope = getRawData<SecureWorkloadScope>(scopeEntity);

      if (!scope) {
        logger.warn(
          { _key: scopeEntity._key },
          'Could not get raw data for scope entity',
        );
        return;
      }

      for (const childScope of scope.child_app_scope_ids || []) {
        const childScopeEntity = await jobState.findEntity(childScope);

        if (!childScopeEntity) {
          throw new IntegrationMissingKeyError(
            `Expected user with key to exist (key=${childScope})`,
          );
        }

        await jobState.addRelationship(
          createScopeRelationship(scopeEntity, childScopeEntity),
        );
      }
    },
  );
}

export async function buildUserScopeRelationships({
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  await jobState.iterateEntities(
    { _type: Entities.USER._type },
    async (userEntity) => {
      const user = getRawData<SecureWorkloadUser>(userEntity);

      if (!user) {
        logger.warn(
          { _key: userEntity._key },
          'Could not get raw data for user entity',
        );
        return;
      }

      if (!user.app_scope_id) {
        return;
      }

      const scopeEntity = await jobState.findEntity(user.app_scope_id);

      if (!scopeEntity) {
        throw new IntegrationMissingKeyError(
          `Expected scope with key to exist (key=${user.app_scope_id})`,
        );
      }

      await jobState.addRelationship(
        createUserScopeRelationship(userEntity, scopeEntity),
      );
    },
  );
}

export const scopeSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.SCOPES,
    name: 'Fetch Scopes',
    entities: [Entities.SCOPE],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchScopes,
  },
  {
    id: Steps.SCOPE_RELATIONSHIPS,
    name: 'Build Scope -> Scope Relationships',
    entities: [],
    relationships: [Relationships.SCOPE_HAS_SCOPE],
    dependsOn: [Steps.SCOPES],
    executionHandler: buildScopeRelationships,
  },
  {
    id: Steps.USER_SCOPE_RELATIONSHIPS,
    name: 'Build User -> Scope Relationships',
    entities: [],
    relationships: [Relationships.USER_ASSIGNED_SCOPE],
    dependsOn: [Steps.SCOPES, Steps.USERS],
    executionHandler: buildUserScopeRelationships,
  },
];
