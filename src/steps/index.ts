import { accessSteps } from './access';
import { accountSteps } from './account';
import { networkSteps } from './network';
import { packageSteps } from './package';
import { scopeSteps } from './scope';
import { workloadSteps } from './workload';

const integrationSteps = [
  ...accountSteps,
  ...accessSteps,
  ...scopeSteps,
  ...workloadSteps,
  ...networkSteps,
  ...packageSteps,
];

export { integrationSteps };
