import {
  getRawData,
  IntegrationMissingKeyError,
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { SecureWorkloadInterface } from '../../types';
import { Entities, Relationships, Steps } from '../constants';
import {
  createInterfaceEntity,
  createInterfaceScopeRelationship,
  createProjectEntity,
  createWorkloadInterfaceRelationship,
} from './converter';

export async function fetchWorkloads({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await apiClient.iterateWorkloads(async (workload) => {
    const workloadEntity = await jobState.addEntity(
      createProjectEntity(workload),
    );

    for (const csw_interface of workload.interfaces || []) {
      const interfaceEntity = await jobState.addEntity(
        createInterfaceEntity(csw_interface, workload.uuid),
      );

      await jobState.addRelationship(
        createWorkloadInterfaceRelationship(workloadEntity, interfaceEntity),
      );
    }
  });
}

export async function buildInterfaceScopeRelationships({
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  await jobState.iterateEntities(
    { _type: Entities.INTERFACE._type },
    async (interfaceEntity) => {
      const csw_interface =
        getRawData<SecureWorkloadInterface>(interfaceEntity);

      if (!csw_interface) {
        logger.warn(
          { _key: interfaceEntity._key },
          'Could not get raw data for interface entity',
        );
        return;
      }

      if (!csw_interface.tags_scope_id) {
        return;
      }

      const scope_ids = Array.isArray(csw_interface.tags_scope_id)
        ? csw_interface.tags_scope_id
        : [csw_interface.tags_scope_id];

      for (const scope_id of scope_ids) {
        const scopeEntity = await jobState.findEntity(scope_id);

        if (!scopeEntity) {
          throw new IntegrationMissingKeyError(
            `Expected scope with key to exist (key=${scope_id})`,
          );
        }

        await jobState.addRelationship(
          createInterfaceScopeRelationship(interfaceEntity, scopeEntity),
        );
      }
    },
  );
}

export const workloadSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.WORKLOADS,
    name: 'Fetch Workloads',
    entities: [Entities.WORKLOAD, Entities.INTERFACE],
    relationships: [Relationships.WORKLOAD_HAS_INTERFACE],
    dependsOn: [],
    executionHandler: fetchWorkloads,
  },
  {
    id: Steps.INTERFACE_SCOPE_RELATIONSHIPS,
    name: 'Build Interface -> Scope Relationships',
    entities: [],
    relationships: [Relationships.INTERFACE_HAS_SCOPE],
    dependsOn: [Steps.SCOPES, Steps.WORKLOADS],
    executionHandler: buildInterfaceScopeRelationships,
  },
];
