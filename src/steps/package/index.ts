import {
  getRawData,
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { PackageInfo, SecureWorkloadProject } from '../../types';
import { Entities, Relationships, Steps } from '../constants';
import {
  createPackageEntity,
  createPackageWorkloadFindingRelationship,
  createWorkloadFindingEntity,
  createWorkloadFindingRelationship,
  createWorkloadPackageRelationship,
} from './converter';

import { createHash } from 'crypto';

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

      /**
       * Contains a mapping of package info to set of package keys
       *
       * Key format: name:version
       * Value format: Set<string>
       */
      const packageKeys = new Map<string, Set<string>>();

      // Iterates packages in the workload and creates
      // Workload -> Package relationships.
      await apiClient.iteratePackages(workload.uuid, async (csw_package) => {
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

        if (!packageKeys.has(key)) {
          packageKeys.set(key, new Set<string>());
        }

        packageKeys.get(key)!.add(packageEntity._key);
      });

      await jobState.setData(workload.uuid, packageKeys);
    },
  );
}

export async function fetchWorkloadFindings({
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

      const packageKeys = (await jobState.getData(workload.uuid)) as Map<
        string,
        Set<string>
      >;

      // Iterates findings in the workload and creates relationships
      // between Workloads, Packages, and Workload Findings.
      await apiClient.iterateWorkloadFindings(
        workload.uuid,
        async (workloadFinding) => {
          const workloadFindingEntity = await jobState.addEntity(
            createWorkloadFindingEntity(workloadFinding, workload.uuid),
          );

          await jobState.addRelationship(
            createWorkloadFindingRelationship(
              workloadEntity,
              workloadFindingEntity,
            ),
          );

          const packageInfoSet = new Set<PackageInfo>(
            workloadFinding.package_infos,
          );

          // Iterates over each package the finding relates to.
          for (const package_info of packageInfoSet) {
            // Iterates over each package used by this workload
            // with the matching name and version.
            for (const package_key of packageKeys?.get(
              `${package_info.name}:${package_info.version}`,
            ) || []) {
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
        },
      );
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
  {
    id: Steps.WORKLOAD_FINDINGS,
    name: 'Fetch Workload Findings',
    entities: [Entities.WORKLOAD_FINDING],
    relationships: [
      Relationships.WORKLOAD_HAS_WORKLOAD_FINDING,
      Relationships.PACKAGE_HAS_WORKLOAD_FINDING,
    ],
    dependsOn: [Steps.WORKLOADS, Steps.PACKAGES],
    executionHandler: fetchWorkloadFindings,
  },
];
