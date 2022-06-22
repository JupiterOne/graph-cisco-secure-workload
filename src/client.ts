import fetch, { Response } from 'node-fetch';

import {
  IntegrationProviderAPIError,
  IntegrationProviderAuthenticationError,
  IntegrationProviderAuthorizationError,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from './config';
import {
  SecureWorkloadPackage,
  SecureWorkloadProject,
  SecureWorkloadProjectFinding,
  SecureWorkloadScope,
  SecureWorkloadUser,
} from './types';

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

  /**
   * Generates auth token.
   * @param method GET, PUT, POST, DELETE
   * @param path this.config.apiURI + API endpoint
   * @param checksum sha256 checksum of the body or empty string if no body
   * @param contentType application/json for most calls
   * @param timestamp YYYY-MM-DDTHH:MM:SS+0000
   * @returns auth token
   */
  private generateAuthToken(options: {
    method: string;
    path: string;
    checksum: string | undefined;
    contentType: string;
    timestamp: string;
  }): string {
    const { apiSecret } = this.config;
    const { method, path, checksum, contentType, timestamp } = options;

    const hmac = createHmac('sha256', Buffer.from(apiSecret, 'utf8'));
    hmac.update(
      `${method}\n${path}\n${checksum || ''}\n${contentType}\n${timestamp}\n`,
    );

    return hmac.digest('base64');
  }

  private generateHeaders(method: string, path: string, body?: string) {
    const { apiKey } = this.config;
    const timestamp = new Date().toISOString().slice(0, -5) + '+0000';
    const contentType = 'application/json';
    const checksum = body
      ? createHash('sha256').update(body).digest('hex')
      : undefined;

    const headers = {
      Id: apiKey,
      'Content-Type': contentType,
      'User-Agent': 'graph-cisco-secure-workload',
      Timestamp: timestamp,
      Authorization: this.generateAuthToken({
        method,
        path,
        checksum,
        contentType,
        timestamp,
      }),
    };

    if (checksum) {
      headers['X-Tetration-Cksum'] = checksum;
    }

    return headers;
  }

  public async fetchUsers(): Promise<SecureWorkloadUser[]> {
    const headers = this.generateHeaders('GET', '/openapi/v1/users');
    const URI = this.config.apiURI + '/openapi/v1/users';
    const response: Response = await fetch(URI, { headers: headers });

    if (!response.ok) {
      this.handleApiError(response, URI);
    }

    return (await response.json()) as SecureWorkloadUser[];
  }

  public async fetchScopes(): Promise<SecureWorkloadScope[]> {
    const headers = this.generateHeaders('GET', '/openapi/v1/app_scopes');
    const URI = this.config.apiURI + '/openapi/v1/app_scopes';
    const response: Response = await fetch(URI, { headers: headers });

    if (!response.ok) {
      this.handleApiError(response, URI);
    }

    return (await response.json()) as SecureWorkloadScope[];
  }

  public async fetchWorkloads(
    offset?: string,
  ): Promise<{ offset?: string; results: { uuid: string }[] }> {
    const body = JSON.stringify({
      filter: {
        type: 'eq',
        field: 'resource_type',
        value: 'WORKLOAD',
      },
      dimensions: ['uuid'],
      limit: 100,
      offset: offset,
    });
    const headers = this.generateHeaders(
      'POST',
      '/openapi/v1/inventory/search',
      body,
    );
    const URI = this.config.apiURI + '/openapi/v1/inventory/search';
    const response: Response = await fetch(URI, {
      method: 'POST',
      body: body,
      headers: headers,
    });

    if (!response.ok) {
      this.handleApiError(response, URI);
    }

    return await response.json();
  }

  public async fetchWorkload(uuid: string): Promise<SecureWorkloadProject> {
    const headers = this.generateHeaders('GET', `/openapi/v1/workload/${uuid}`);
    const URI = this.config.apiURI + `/openapi/v1/workload/${uuid}`;
    const response: Response = await fetch(URI, { headers: headers });

    if (!response.ok) {
      this.handleApiError(response, URI);
    }
    return (await response.json()) as SecureWorkloadProject;
  }

  public async fetchPackages(uuid: string): Promise<SecureWorkloadPackage[]> {
    const headers = this.generateHeaders(
      'GET',
      `/openapi/v1/workload/${uuid}/packages`,
    );
    const URI = this.config.apiURI + `/openapi/v1/workload/${uuid}/packages`;
    const response: Response = await fetch(URI, { headers: headers });

    if (!response.ok) {
      this.handleApiError(response, URI);
    }
    return (await response.json()) as SecureWorkloadPackage[];
  }

  public async fetchWorkloadFindings(
    uuid: string,
  ): Promise<SecureWorkloadProjectFinding[]> {
    const headers = this.generateHeaders(
      'GET',
      `/openapi/v1/workload/${uuid}/vulnerabilities`,
    );
    const URI =
      this.config.apiURI + `/openapi/v1/workload/${uuid}/vulnerabilities`;
    const response: Response = await fetch(URI, { headers: headers });

    if (!response.ok) {
      this.handleApiError(response, URI);
    }
    return (await response.json()) as SecureWorkloadProjectFinding[];
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
    const users: SecureWorkloadUser[] = await this.fetchUsers();

    for (const user of users) {
      await iteratee(user);
    }
  }

  /**
   * Iterates each scope resource in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateScopes(
    iteratee: ResourceIteratee<SecureWorkloadScope>,
  ): Promise<void> {
    const scopes: SecureWorkloadScope[] = await this.fetchScopes();

    for (const scope of scopes) {
      await iteratee(scope);
    }
  }

  /**
   * Iterates each inventory resource in the provider.
   *
   * Collects the set of all workload UUIDs in the inventory. Then calls the
   * workload endpoint to get the workload objects.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateWorkloads(
    iteratee: ResourceIteratee<SecureWorkloadProject>,
  ): Promise<void> {
    let workloads: {
      offset?: string;
      results: {
        uuid: string;
      }[];
    };

    let offset: string | undefined = undefined;

    const uuids = new Set<string>();

    do {
      workloads = await this.fetchWorkloads(offset);

      offset = workloads.offset;
      workloads.results.forEach((workload) => uuids.add(workload.uuid));
    } while (workloads.offset);

    for (const uuid of uuids) {
      await iteratee(await this.fetchWorkload(uuid));
    }
  }

  /**
   * Iterates each package resource in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iteratePackages(
    iteratee: ResourceIteratee<SecureWorkloadPackage>,
    workloadUUID: string,
  ): Promise<void> {
    const scopes: SecureWorkloadPackage[] = await this.fetchPackages(
      workloadUUID,
    );

    for (const scope of scopes) {
      await iteratee(scope);
    }
  }

  /**
   * Iterates each workload vulnerabilty resource in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateWorkloadFindings(
    iteratee: ResourceIteratee<SecureWorkloadProjectFinding>,
    workloadUUID: string,
  ): Promise<void> {
    const scopes: SecureWorkloadProjectFinding[] =
      await this.fetchWorkloadFindings(workloadUUID);

    for (const scope of scopes) {
      await iteratee(scope);
    }
  }
}

export function createAPIClient(config: IntegrationConfig): APIClient {
  return new APIClient(config);
}
