import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { Recording, setupProjectRecording } from '../../../test/recording';
import { Steps } from '../constants';

// See test/README.md for details
let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

test('fetch-policies', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'fetch-policies',
  });

  const stepConfig = buildStepTestConfigForStep(Steps.POLICIES);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
}, 120000);

test('build-policy-scope-relationships', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'build-policy-scope-relationships',
  });

  const stepConfig = buildStepTestConfigForStep(
    Steps.POLICY_SCOPE_RELATIONSHIPS,
  );
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
}, 120000);
