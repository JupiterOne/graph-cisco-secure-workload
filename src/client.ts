import fetch, { Response } from 'node-fetch';

import {
  IntegrationProviderAPIError,
  IntegrationProviderAuthenticationError,
  IntegrationProviderAuthorizationError,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from './config';
import { SecureWorkloadUser, AcmeGroup } from './types';

import { createHmac, createHash } from 'crypto';

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

/**
 * An APIClient maintains authentication state and provides an interface to
 * third party data APIs.
 *
 * It is recommended that integrations wrap provider data APIs to provide a
 * place to handle error responses and implement common patterns for iterating
 * resources.
 */
export class APIClient {
  constructor(readonly config: IntegrationConfig) {}

  private generateAuthToken(
    method: string,
    path: string,
    checksum: string,
    contentType: string,
    timestamp: string,
  ): string {
    const { apiSecret } = this.config;

    const hmac = createHmac('sha256', Buffer.from(apiSecret, 'utf8'));
    hmac.update(
      `${method}\n${path}\n${checksum}\n${contentType}\n${timestamp}\n`,
    );

    return hmac.digest('base64');
  }

  private generateHeaders(method: string, uri: string, body?: string) {
    const { apiKey } = this.config;
    const timestamp = new Date().toISOString().slice(0, -5) + '+0000';
    const contentType = 'application/json';
    const checksum = body
      ? createHash('sha256').update(body).digest('hex')
      : '';

    const headers = {
      Id: apiKey,
      'Content-Type': contentType,
      'User-Agent': 'graph-cisco-secure-workload',
      Timestamp: timestamp,
      Authorization: this.generateAuthToken(
        method,
        uri,
        checksum,
        contentType,
        timestamp,
      ),
    };

    if (checksum) {
      headers['X-Tetration-Checksum'] = checksum;
    }

    return headers;
  }

  public async getAccounts(): Promise<SecureWorkloadUser[]> {
    const headers = this.generateHeaders('GET', '/openapi/v1/users');
    const URI = this.config.apiURI + '/openapi/v1/users';
    const response: Response = await fetch(URI, { headers: headers });

    if (!response.ok) {
      this.handleApiError(response, this.config.apiURI + '/openapi/v1/users');
    }

    return (await response.json()) as SecureWorkloadUser[];
  }

  private handleApiError(err: any, endpoint: string): void {
    if (err.status === 401) {
      throw new IntegrationProviderAuthenticationError({
        endpoint: endpoint,
        status: err.status,
        statusText: err.statusText,
      });
    } else if (err.status === 403) {
      throw new IntegrationProviderAuthorizationError({
        endpoint: endpoint,
        status: err.status,
        statusText: err.statusText,
      });
    } else {
      throw new IntegrationProviderAPIError({
        endpoint: endpoint,
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  /**
   * Iterates each user resource in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateUsers(
    iteratee: ResourceIteratee<SecureWorkloadUser>,
  ): Promise<void> {
    const users: SecureWorkloadUser[] = await this.getAccounts();

    for (const user of users) {
      await iteratee(user);
    }
  }

  /**
   * Iterates each group resource in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateGroups(
    iteratee: ResourceIteratee<AcmeGroup>,
  ): Promise<void> {
    // TODO paginate an endpoint, invoke the iteratee with each record in the
    // page
    //
    // The provider API will hopefully support pagination. Functions like this
    // should maintain pagination state, and for each page, for each record in
    // the page, invoke the `ResourceIteratee`. This will encourage a pattern
    // where each resource is processed and dropped from memory.

    const groups: AcmeGroup[] = [
      {
        id: 'acme-group-1',
        name: 'Group One',
        users: [
          {
            id: 'acme-user-1',
          },
        ],
      },
    ];

    for (const group of groups) {
      await iteratee(group);
    }
  }
}

export function createAPIClient(config: IntegrationConfig): APIClient {
  return new APIClient(config);
}
