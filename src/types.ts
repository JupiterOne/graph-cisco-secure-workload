// Providers often supply types with their API libraries.

export interface SecureWorkloadUser {
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  app_scope_id?: string;
  role_ids?: string[];
  bypass_external_auth?: boolean;
  disabled_at?: number;
}

export interface SecureWorkloadRole {
  id: string;
  app_scope_id?: string;
  name?: string;
  description?: string;
}

export interface SecureWorkloadScope {
  id: string;
  short_name?: string;
  name?: string;
  description?: string;
  vrf_id?: string;
  parent_app_scope_id?: string;
  child_app_scope_ids?: string[];
}

export interface SecureWorkloadProject {
  agent_type?: string;
  host_name?: string;
  interfaces?: SecureWorkloadInterface[];
  last_software_update?: number;
  platform?: string;
  uuid: string;
  windows_enforcement_mode?: string;
}

export interface SecureWorkloadInterface {
  ip?: string;
  mac?: string;
  name?: string;
  netmask?: string;
  pcap_opened?: boolean;
  tags_scope_id?: string[] | string;
  vrf?: string;
  vrf_id?: number;
  tags?: any;
}

export interface SecureWorkloadPackage {
  architecture?: string;
  name?: string;
  publisher?: string;
  version?: string;
}

export interface PackageInfo {
  name: string;
  version: string;
}

export interface SecureWorkloadProjectFinding {
  cve_id: string;
  package_infos?: PackageInfo[];
  v2_score?: number;
  v2_access_complexity?: string;
  v2_access_vector?: string;
  v2_authentication?: string;
  v2_availability_impact?: string;
  v2_confidentiality_impact?: string;
  v2_integrity_impact?: string;
  v2_severity?: string;
  v3_score?: number;
  v3_attack_complexity?: string;
  v3_attack_vector?: string;
  v3_availability_impact?: string;
  v3_base_severity?: string;
  v3_confidentiality_impact?: string;
  v3_integrity_impact?: string;
  v3_privileges_required?: string;
  v3_scope?: string;
  v3_user_interaction?: string;
}

// Those can be useful to a degree, but often they're just full of optional
// values. Understanding the response data may be more reliably accomplished by
// reviewing the API response recordings produced by testing the wrapper client
// (./client.ts). However, when there are no types provided, it is necessary to define
// opaque types for each resource, to communicate the records that are expected
// to come from an endpoint and are provided to iterating functions.
