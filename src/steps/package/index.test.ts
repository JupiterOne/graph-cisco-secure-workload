import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { Recording, setupProjectRecording } from '../../../test/recording';
import { Steps } from '../constants';

// See test/README.md for details
let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

test('fetch-packages', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'fetch-packages',
  });

  const stepConfig = buildStepTestConfigForStep(Steps.PACKAGES);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
}, 120000);

test('fetch-workload-findings', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'fetch-workload-findings',
  });

  const stepConfig = buildStepTestConfigForStep(Steps.WORKLOAD_FINDINGS);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
}, 120000);
