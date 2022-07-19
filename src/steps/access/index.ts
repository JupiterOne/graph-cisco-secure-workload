import {
  Entity,
  getRawData,
  IntegrationMissingKeyError,
  IntegrationStep,
  IntegrationStepExecutionContext,
  IntegrationWarnEventName,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { SecureWorkloadUser } from '../../types';
import { ACCOUNT_ENTITY_KEY } from '../account';
import { Entities, Steps, Relationships } from '../constants';
import {
  createAccountUserRelationship,
  createUserEntity,
  createUserRoleRelationship,
} from './converter';

export async function fetchUsers({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  if (!accountEntity) {
    throw new IntegrationMissingKeyError(`Expected account entity to exist`);
  }

  await apiClient.iterateUsers(async (user) => {
    const userEntity = await jobState.addEntity(createUserEntity(user));
    await jobState.addRelationship(
      createAccountUserRelationship(accountEntity, userEntity),
    );
  });
}

export async function buildUserRoleRelationships({
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

      for (const roleID of user.role_ids || []) {
        const roleEntity = await jobState.findEntity(roleID);

        if (!roleEntity) {
          logger.publishWarnEvent({
            name: IntegrationWarnEventName.MissingPermission,
            description: `User (id=${user.id}) has role_id which does not exist. Make sure role with id ${roleID} exists or remove the role from the user.`,
          });
          continue;
        }

        await jobState.addRelationship(
          createUserRoleRelationship(userEntity, roleEntity),
        );
      }
    },
  );
}

export const accessSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.USERS,
    name: 'Fetch Users',
    entities: [Entities.USER],
    relationships: [Relationships.ACCOUNT_HAS_USER],
    dependsOn: [Steps.ACCOUNT],
    executionHandler: fetchUsers,
  },
  {
    id: Steps.USER_ROLE_RELATIONSHIPS,
    name: 'Build User -> Role Relationships',
    entities: [],
    relationships: [Relationships.USER_HAS_ROLE],
    dependsOn: [Steps.USERS, Steps.ROLES],
    executionHandler: buildUserRoleRelationships,
  },
];
