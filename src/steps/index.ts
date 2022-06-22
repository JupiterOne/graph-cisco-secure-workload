import { accessSteps } from './access';
import { accountSteps } from './account';
import { scopeSteps } from './scope';
import { workloadSteps } from './workload';

const integrationSteps = [
  ...accountSteps,
  ...accessSteps,
  ...scopeSteps,
  ...workloadSteps,
];

export { integrationSteps };
