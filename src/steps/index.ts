import { accessSteps } from './access';
import { accountSteps } from './account';
import { packageSteps } from './package';
import { scopeSteps } from './scope';
import { workloadSteps } from './workload';

const integrationSteps = [
  ...accountSteps,
  ...accessSteps,
  ...scopeSteps,
  ...workloadSteps,
  ...packageSteps,
];

export { integrationSteps };
