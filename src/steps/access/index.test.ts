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

  expect(stepResult.collectedEntities).toMatchGraphObjectSchema({
    _class: ['User'],
    schema: {
      additionalProperties: true,
      properties: {
        id: { type: 'string' },
        email: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        roleIDs: { type: 'array', items: { type: 'string' } },
        bypassExternalAuth: { type: 'boolean' },
      },
    },
  });
});
