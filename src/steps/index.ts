import { accessSteps } from './access';
import { accountSteps } from './account';
import { scopeSteps } from './scope';

const integrationSteps = [...accountSteps, ...accessSteps, ...scopeSteps];

export { integrationSteps };
