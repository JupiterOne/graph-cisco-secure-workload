import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { Recording, setupProjectRecording } from '../../../test/recording';
import { Steps } from '../constants';

// See test/README.md for details
let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

test.skip('fetch-workloads', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'fetch-workloads',
  });

  const stepConfig = buildStepTestConfigForStep(Steps.WORKLOADS);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
}, 20000);

test.skip('build-interface-scope-relationships', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'build-interface-scope-relationships',
  });

  const stepConfig = buildStepTestConfigForStep(
    Steps.INTERFACE_SCOPE_RELATIONSHIPS,
  );
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
}, 20000);
