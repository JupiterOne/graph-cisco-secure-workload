import { IntegrationSpecConfig } from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../../src/config';
import { accessSpec } from './access';
import { accountSpec } from './account';
import { scopeSpec } from './scope';

export const invocationConfig: IntegrationSpecConfig<IntegrationConfig> = {
  integrationSteps: [...accountSpec, ...accessSpec, ...scopeSpec],
};
