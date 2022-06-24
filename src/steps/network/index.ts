import {
  IntegrationMissingKeyError,
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { Entities, Relationships, Steps } from '../constants';
import {
  createNetworkEntity,
  createNetworkFindingEntity,
  createNetworkFindingRelationship,
  createScopeNetworkRelationship,
} from './converter';

export async function fetchNetworks({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  const rootScopeID: string = (await jobState.getData('rootScopeID')) || '';
  const rootScopeEntity = await jobState.findEntity(rootScopeID);

  if (!rootScopeEntity) {
    throw new IntegrationMissingKeyError(
      `Expected scope with key to exist (key=${rootScopeID})`,
    );
  }

  await apiClient.iterateNetworks(rootScopeID, async (network) => {
    const networkEntity = await jobState.addEntity(
      createNetworkEntity(network),
    );

    await jobState.addRelationship(
      createScopeNetworkRelationship(rootScopeEntity, networkEntity),
    );

    for (const finding of network.cve_ids || []) {
      const findingEntity = await jobState.addEntity(
        createNetworkFindingEntity(finding, network),
      );

      await jobState.addRelationship(
        createNetworkFindingRelationship(networkEntity, findingEntity),
      );
    }
  });
}

export const networkSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.NETWORKS,
    name: 'Fetch Networks',
    entities: [Entities.NETWORK, Entities.NETWORK_FINDING],
    relationships: [
      Relationships.SCOPE_HAS_NETWORK,
      Relationships.NETWORK_HAS_NETWORK_FINDING,
    ],
    dependsOn: [Steps.SCOPES],
    executionHandler: fetchNetworks,
  },
];
