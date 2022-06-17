import {
  getRawData,
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { SecureWorkloadProject } from '../../types';
import { Entities, Relationships, Steps } from '../constants';
import {
  createPackageEntity,
  createWorkloadPackageRelationship,
} from './converter';

export async function fetchPackages({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);
  await jobState.iterateEntities(
    { _type: Entities.WORKLOAD._type },
    async (workloadEntity) => {
      const workload = getRawData<SecureWorkloadProject>(workloadEntity);

      if (!workload) {
        logger.warn(
          { _key: workloadEntity._key },
          'Could not get raw data for workload entity',
        );
        return;
      }

      const packages = await apiClient.fetchPackages(workload.uuid);

      for (const csw_package of packages) {
        const packageEntity = createPackageEntity(csw_package, workload.uuid);
        jobState.addEntity(packageEntity);
        jobState.addRelationship(
          createWorkloadPackageRelationship(workloadEntity, packageEntity),
        );
      }
    },
  );
}

export const packageSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.PACKAGES,
    name: 'Fetch Packages',
    entities: [Entities.PACKAGE],
    relationships: [Relationships.WORKLOAD_HAS_PACKAGE],
    dependsOn: [Steps.WORKLOADS],
    executionHandler: fetchPackages,
  },
];
