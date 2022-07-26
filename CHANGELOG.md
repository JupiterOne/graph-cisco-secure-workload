# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.4] - 2022-07-26

### Changed

- Fixed number of retries only running 3 times.

## [1.1.3] - 2022-07-22

### Changed

- Updated number of retries from 3 -> 5.
- Increased time between each retry.
- Fixed error when user has non-existant role. Sends warn event when occuring.

## [1.1.2] - 2022-07-01

### Added

- Added retries to client requests.

## [1.1.1] - 2022-06-30

### Fixed

- Fixed ingesting workloads with a null uuid.
- Fixed ingesting the same workload finding relationship multiple times.

## [1.1.0] - 2022-06-28

### Added

- Added new entities:

| Entity               | Name                   |
| -------------------- | ---------------------- |
| csw_scope            | Scope                  |
| csw_project          | Workload               |
| csw_interface        | Interface              |
| csw_package          | Package                |
| csw_workload_finding | Workload Vulnerability |
| csw_role             | Role                   |

- Added new relationships:

| Relationship                     | From          | Type     | To                   |
| -------------------------------- | ------------- | -------- | -------------------- |
| csw_account_has_role             | csw_account   | HAS      | csw_role             |
| csw_user_has_role                | csw_user      | HAS      | csw_role             |
| csw_scope_has_scope              | csw_scope     | HAS      | csw_scope            |
| csw_user_assigned_scope          | csw_user      | ASSIGNED | csw_scope            |
| csw_role_uses_scope              | csw_role      | USES     | csw_scope            |
| csw_interface_has_scope          | csw_interface | HAS      | csw_scope            |
| csw_project_has_interface        | csw_project   | HAS      | csw_interface        |
| csw_project_has_package          | csw_project   | HAS      | csw_package          |
| csw_project_has_workload_finding | csw_project   | HAS      | csw_workload_finding |
| csw_package_has_workload_finding | csw_package   | HAS      | csw_workload_finding |

## [1.0.0] - 2022-06-09

### Added

Initial Cisco Secure Workload

- Added new entity `csw_account`
- Added new entity `csw_user`
- Added new relationship `csw_account_has_user`
