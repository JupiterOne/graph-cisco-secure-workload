import {
  setupRecording,
  Recording,
  SetupRecordingInput,
  mutations,
} from '@jupiterone/integration-sdk-testing';

export { Recording };

export function setupProjectRecording(
  input: Omit<SetupRecordingInput, 'mutateEntry'>,
): Recording {
  return setupRecording({
    ...input,
    redactedRequestHeaders: ['Authorization', 'id'],
    redactedResponseHeaders: ['set-cookie'],
    mutateEntry: (entry) => {
      redact(entry);
    },
    options: {
      recordFailedRequests: true,
      matchRequestsBy: {
        headers: false,
        url: {
          hostname: false,
        },
      },
    },
  });
}

function redact(entry): void {
  if (entry.request.postData) {
    entry.request.postData.text = '[REDACTED]';
  }

  if (
    !entry.response.content.text ||
    entry.response.content.statusText !== 'OK'
  ) {
    return;
  }

  //let's unzip the entry so we can modify it
  mutations.unzipGzippedRecordingEntry(entry);

  //if it wasn't a token call, parse the response text, removing any carriage returns or newlines
  const responseText = entry.response.content.text;
  const parsedResponseText = JSON.parse(responseText.replace(/\r?\n|\r/g, ''));

  //now we can modify the returned object as desired
  //in this example, if the return text is an array of objects that have the 'tenant' property...
  if (parsedResponseText[0]?.email) {
    for (let i = 0; i < parsedResponseText.length; i++) {
      parsedResponseText[i].email = 'REDACTED@example.com';
      parsedResponseText[i].first_name = '[REDACTED]';
      parsedResponseText[i].last_name = '[REDACTED]';
    }
  }

  entry.response.content.text = JSON.stringify(parsedResponseText);
}
