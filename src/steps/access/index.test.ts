import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { Recording, setupProjectRecording } from '../../../test/recording';
import { Steps } from '../constants';

// See test/README.md for details
let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

test('fetch-users', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'fetch-users',
  });

  const stepConfig = buildStepTestConfigForStep(Steps.USERS);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});

test('fetch-scopes', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'fetch-scopes',
  });

  const stepConfig = buildStepTestConfigForStep(Steps.SCOPES);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});

test('build-scope-relationships', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'build-scope-relationships',
  });

  const stepConfig = buildStepTestConfigForStep(Steps.SCOPE_RELATIONSHIPS);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});

test('build-scope-user-relationships', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'build-scope-user-relationships',
  });

  const stepConfig = buildStepTestConfigForStep(Steps.SCOPE_USER_RELATIONSHIPS);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});
