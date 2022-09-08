import { accessSteps } from './access';
import { accountSteps } from './account';
import { packageSteps } from './package';
import { policySteps } from './policy';
import { roleSteps } from './role';
import { scopeSteps } from './scope';
import { workloadSteps } from './workload';

const integrationSteps = [
  ...accountSteps,
  ...accessSteps,
  ...roleSteps,
  ...scopeSteps,
  ...workloadSteps,
  ...packageSteps,
  ...policySteps,
];

export { integrationSteps };
