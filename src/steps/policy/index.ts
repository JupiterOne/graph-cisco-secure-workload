import {
  Entity,
  getRawData,
  IntegrationMissingKeyError,
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { SecureWorkloadPolicy } from '../../types';
import { ACCOUNT_ENTITY_KEY } from '../account';
import { Entities, Relationships, Steps } from '../constants';
import {
  createAccountPolicyRelationship,
  createPolicyEntity,
  createPolicyScopeRelationship,
} from './converter';

export async function fetchPolicies({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  if (!accountEntity) {
    throw new IntegrationMissingKeyError(`Expected account entity to exist`);
  }

  await apiClient.iteratePolicies(async (policy) => {
    const policyEntity = await jobState.addEntity(createPolicyEntity(policy));
    await jobState.addRelationship(
      createAccountPolicyRelationship(accountEntity, policyEntity),
    );

    if (policy.consumer_filter_id) {
      const scopeEntity = await jobState.findEntity(policy.consumer_filter_id);

      if (!scopeEntity) {
        logger.warn(
          { _key: policy.consumer_filter_id },
          `Expected scope with key to exist (key=${policy.consumer_filter_id})`,
        );
      } else {
        await jobState.addRelationship(
          createPolicyScopeRelationship(policyEntity, scopeEntity),
        );
      }
    }

    if (policy.provider_filter_id) {
      const scopeEntity = await jobState.findEntity(policy.provider_filter_id);

      if (!scopeEntity) {
        logger.warn(
          { _key: policy.provider_filter_id },
          `Expected scope with key to exist (key=${policy.provider_filter_id})`,
        );
      } else {
        await jobState.addRelationship(
          createPolicyScopeRelationship(policyEntity, scopeEntity),
        );
      }
    }
  });
}

export async function buildPolicyScopeRelationships({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  await jobState.iterateEntities(
    { _type: Entities.POLICY._type },
    async (policyEntity) => {
      const policy = getRawData<SecureWorkloadPolicy>(policyEntity);

      if (!policy) {
        logger.warn(
          { _key: policyEntity._key },
          'Could not get raw data for policy entity',
        );
        return;
      }

      if (policy.consumer_filter_id) {
        const scopeEntity = await jobState.findEntity(
          policy.consumer_filter_id,
        );

        if (scopeEntity) {
          await jobState.addRelationship(
            createPolicyScopeRelationship(policyEntity, scopeEntity),
          );
        }
      }

      if (
        policy.provider_filter_id &&
        policy.consumer_filter_id !== policy.provider_filter_id
      ) {
        const scopeEntity = await jobState.findEntity(
          policy.provider_filter_id,
        );

        if (scopeEntity) {
          await jobState.addRelationship(
            createPolicyScopeRelationship(policyEntity, scopeEntity),
          );
        }
      }
    },
  );
}

export const policySteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.POLICIES,
    name: 'Fetch Policies',
    entities: [Entities.POLICY],
    relationships: [Relationships.ACCOUNT_HAS_POLICY],
    dependsOn: [Steps.ACCOUNT],
    executionHandler: fetchPolicies,
  },
  {
    id: Steps.POLICY_SCOPE_RELATIONSHIPS,
    name: 'Build Policy -> Scope Relationships',
    entities: [],
    relationships: [Relationships.POLICY_HAS_SCOPE],
    dependsOn: [Steps.POLICIES, Steps.SCOPES],
    executionHandler: buildPolicyScopeRelationships,
  },
];
