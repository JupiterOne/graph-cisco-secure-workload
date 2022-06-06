import { accessSteps } from './access';
import { accountSteps } from './account';

const integrationSteps = [...accountSteps, ...accessSteps];

export { integrationSteps };
