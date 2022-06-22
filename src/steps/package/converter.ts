import {
  createIntegrationEntity,
  createDirectRelationship,
  Entity,
  RelationshipClass,
  Relationship,
} from '@jupiterone/integration-sdk-core';
import {
  SecureWorkloadPackage,
  SecureWorkloadProjectFinding,
} from '../../types';

import { Entities } from '../constants';

import { createHash } from 'crypto';

export function createPackageEntity(
  csw_package: SecureWorkloadPackage,
): Entity {
  return createIntegrationEntity({
    entityData: {
      source: csw_package,
      assign: {
        _type: Entities.PACKAGE._type,
        _class: Entities.PACKAGE._class,
        _key: createHash('sha256')
          .update(JSON.stringify(csw_package))
          .digest('hex'),
        architecture: csw_package.architecture,
        name: csw_package.name,
        publisher: csw_package.publisher,
        version: csw_package.version,
      },
    },
  });
}

export function createWorkloadFindingEntity(
  workload_finding: SecureWorkloadProjectFinding,
  workloadUUID: string,
): Entity {
  return createIntegrationEntity({
    entityData: {
      source: workload_finding,
      assign: {
        _type: Entities.WORKLOAD_FINDING._type,
        _class: Entities.WORKLOAD_FINDING._class,
        _key: workloadUUID + workload_finding.cve_id,
        name: workload_finding.cve_id,
        severity:
          workload_finding.v3_base_severity ||
          workload_finding.v2_severity ||
          'UNKNOWN',
        numericSeverity:
          workload_finding.v3_score || workload_finding.v2_score || -1,
        open: true,
        category: 'vulnerability',
        cveID: workload_finding.cve_id,
        v2Score: workload_finding.v2_score,
        v2AccessComplexity: workload_finding.v2_access_complexity,
        v2AccessVector: workload_finding.v2_access_vector,
        v2Authentication: workload_finding.v2_authentication,
        v2AvailabilityImpact: workload_finding.v2_availability_impact,
        v2ConfidentialityImpact: workload_finding.v2_confidentiality_impact,
        v2IntegrityImpact: workload_finding.v2_integrity_impact,
        v2Severity: workload_finding.v2_severity,
        v3Score: workload_finding.v3_score,
        v3AttackComplexity: workload_finding.v3_attack_complexity,
        v3AttackVector: workload_finding.v3_attack_vector,
        v3AvailabilityImpact: workload_finding.v3_availability_impact,
        v3BaseSeverety: workload_finding.v3_base_severity,
        v3ConfidentialityImpact: workload_finding.v3_confidentiality_impact,
        v3IntegrityImpact: workload_finding.v3_integrity_impact,
        v3PrivilegesRequired: workload_finding.v3_privileges_required,
        v3Scope: workload_finding.v3_scope,
        v3UserInteraction: workload_finding.v3_user_interaction,
      },
    },
  });
}

export function createWorkloadPackageRelationship(
  workload: Entity,
  csw_package: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: workload,
    to: csw_package,
  });
}

export function createWorkloadFindingRelationship(
  workload: Entity,
  workload_finding: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: workload,
    to: workload_finding,
  });
}

export function createPackageWorkloadFindingRelationship(
  csw_package: Entity,
  workload_finding: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: csw_package,
    to: workload_finding,
  });
}
