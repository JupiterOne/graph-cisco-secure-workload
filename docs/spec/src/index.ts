import { IntegrationSpecConfig } from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../../src/config';
import { accessSpec } from './access';
import { accountSpec } from './account';
import { packageSpec } from './package';
import { scopeSpec } from './scope';
import { workloadSpec } from './workload';

export const invocationConfig: IntegrationSpecConfig<IntegrationConfig> = {
  integrationSteps: [
    ...accountSpec,
    ...accessSpec,
    ...scopeSpec,
    ...workloadSpec,
    ...packageSpec,
  ],
};
