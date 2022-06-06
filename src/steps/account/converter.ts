import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../config';

import { Entities } from '../constants';

export function createAccountEntity(config: IntegrationConfig): Entity {
  return createIntegrationEntity({
    entityData: {
      source: {
        id: 'csw_account',
        name: 'csw account',
      },
      assign: {
        _key: 'csw_account',
        _type: Entities.ACCOUNT._type,
        _class: Entities.ACCOUNT._class,
      },
    },
  });
}
