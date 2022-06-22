import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { Recording, setupProjectRecording } from '../../../test/recording';
import { Steps } from '../constants';

// See test/README.md for details
let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

test('fetch-packages-workload-findings', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'fetch-packages-workload-findings',
  });

  const stepConfig = buildStepTestConfigForStep(
    Steps.PACKAGES_WORKLOAD_FINDINGS,
  );
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
}, 120000);
