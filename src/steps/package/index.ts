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
  createPackageWorkloadFindingRelationship,
  createWorkloadFindingEntity,
  createWorkloadFindingRelationship,
  createWorkloadPackageRelationship,
} from './converter';

import { createHash } from 'crypto';

export async function fetchPackagesWorkloadFindings({
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

      /**
       * Contains a mapping of package info to set of package keys
       *
       * Key format: name:version
       * Value format: Set<string>
       */
      const packageKeys = {};

      // Iterates packages in the workload and creates
      // Workload -> Package relationships.
      await apiClient.iteratePackages(async (csw_package) => {
        const package_key = createHash('sha256')
          .update(JSON.stringify(csw_package))
          .digest('hex');

        let packageEntity = await jobState.findEntity(package_key);
        if (!packageEntity) {
          packageEntity = createPackageEntity(csw_package);
          await jobState.addEntity(packageEntity);
        }

        await jobState.addRelationship(
          createWorkloadPackageRelationship(workloadEntity, packageEntity),
        );

        // Adds the packageEntity's key to the packageKey object's set
        const key = `${csw_package.name}:${csw_package.version}`;

        if (!packageKeys[key]) {
          packageKeys[key] = new Set<string>();
        }

        packageKeys[key].add(packageEntity._key);
      }, workload.uuid);

      // Iterates findings in the workload and creates relationships
      // between Workloads, Packages, and Workload Findings.
      await apiClient.iterateWorkloadFindings(async (workloadFinding) => {
        const workloadFindingEntity = await jobState.addEntity(
          createWorkloadFindingEntity(workloadFinding, workload.uuid),
        );

        await jobState.addRelationship(
          createWorkloadFindingRelationship(
            workloadEntity,
            workloadFindingEntity,
          ),
        );

        // Iterates over each package the finding relates to.
        for (const package_info of workloadFinding.package_infos || []) {
          // Iterates over each package used by this workload
          // with the matching name and version.
          for (const package_key of packageKeys[
            `${package_info.name}:${package_info.version}`
          ]) {
            const package_entity = await jobState.findEntity(package_key);

            if (!package_entity) {
              continue;
            }

            await jobState.addRelationship(
              createPackageWorkloadFindingRelationship(
                package_entity,
                workloadFindingEntity,
              ),
            );
          }
        }
      }, workload.uuid);
    },
  );
}

export const packageSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.PACKAGES_WORKLOAD_FINDINGS,
    name: 'Fetch Packages And Workload Findings',
    entities: [Entities.PACKAGE, Entities.WORKLOAD_FINDING],
    relationships: [
      Relationships.WORKLOAD_HAS_PACKAGE,
      Relationships.WORKLOAD_HAS_WORKLOAD_FINDING,
      Relationships.PACKAGE_HAS_WORKLOAD_FINDING,
    ],
    dependsOn: [Steps.WORKLOADS],
    executionHandler: fetchPackagesWorkloadFindings,
  },
];
