import { accessSteps } from './access';
import { accountSteps } from './account';
import { networkSteps } from './network';
import { scopeSteps } from './scope';
import { workloadSteps } from './workload';

const integrationSteps = [
  ...accountSteps,
  ...accessSteps,
  ...scopeSteps,
  ...workloadSteps,
  ...networkSteps,
];

export { integrationSteps };
