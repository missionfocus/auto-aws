// THIS FILE IS GENERATED; DO NOT MODIFY MANUALLY
/* eslint-disable quotes */
/* eslint-disable quote-props */
/* eslint-disable comma-dangle */
import { GroupList, SsoConfig } from '@taimos/cdk-controltower';

export type GroupName = 'AWS Admins' | 'AWS Engineers' | 'AWS Super Admins' | 'AWSAccountFactory' | 'AWSAuditAccountAdmins' | 'AWSControlTowerAdmins' | 'AWSLogArchiveAdmins' | 'AWSLogArchiveViewers' | 'AWSSecurityAuditPowerUsers' | 'AWSSecurityAuditors' | 'AWSServiceCatalogAdmins' | 'aws-admins' | 'aws-edc-admins' | 'aws-edc-engineers' | 'aws-mf-admins' | 'aws-mf-engineers' | 'aws-semiota-admins';

export const GROUPS: GroupList<GroupName> = {
  "AWS Admins": {
    "DisplayName": "AWS Admins",
    "GroupId": "90676f8aa8-406545af-4bee-4687-98f8-206de9e3f4ce"
  },
  "AWS Engineers": {
    "DisplayName": "AWS Engineers",
    "GroupId": "90676f8aa8-2fa2fe51-8f74-440c-987b-ad2bfe576c3d"
  },
  "AWS Super Admins": {
    "DisplayName": "AWS Super Admins",
    "GroupId": "90676f8aa8-1ca4896c-398f-4db9-b3b8-44751f8a2283"
  },
  "AWSAccountFactory": {
    "Description": "Read-only access to account factory in AWS Service Catalog for end users",
    "DisplayName": "AWSAccountFactory",
    "GroupId": "90676f8aa8-f635469e-2fd2-4c52-a3c6-12aaffbc4534"
  },
  "AWSAuditAccountAdmins": {
    "Description": "Admin rights to cross-account audit account",
    "DisplayName": "AWSAuditAccountAdmins",
    "GroupId": "90676f8aa8-c67d00e0-1d04-4267-967d-bfabaf7bf833"
  },
  "AWSControlTowerAdmins": {
    "Description": "Admin rights to AWS Control Tower core and provisioned accounts",
    "DisplayName": "AWSControlTowerAdmins",
    "GroupId": "90676f8aa8-4373984d-a38d-45a3-a65e-14dabba56520"
  },
  "AWSLogArchiveAdmins": {
    "Description": "Admin rights to log archive account",
    "DisplayName": "AWSLogArchiveAdmins",
    "GroupId": "90676f8aa8-2b5e74bc-095c-4c5d-a552-a25dbfc69310"
  },
  "AWSLogArchiveViewers": {
    "Description": "Read-only access to log archive account",
    "DisplayName": "AWSLogArchiveViewers",
    "GroupId": "90676f8aa8-d3827a1c-a9c1-4a0a-8f34-bd50b3b1a381"
  },
  "AWSSecurityAuditPowerUsers": {
    "Description": "Power user access to all accounts for security audits",
    "DisplayName": "AWSSecurityAuditPowerUsers",
    "GroupId": "90676f8aa8-73730ed1-ed88-4be7-95c1-b28c06eeaee5"
  },
  "AWSSecurityAuditors": {
    "Description": "Read-only access to all accounts for security audits",
    "DisplayName": "AWSSecurityAuditors",
    "GroupId": "90676f8aa8-04b86561-96c6-45bd-8954-8614dd595b96"
  },
  "AWSServiceCatalogAdmins": {
    "Description": "Admin rights to account factory in AWS Service Catalog",
    "DisplayName": "AWSServiceCatalogAdmins",
    "GroupId": "90676f8aa8-6552e2be-b33f-4519-ae4e-89c3260eb30c"
  },
  "aws-admins": {
    "DisplayName": "aws-admins",
    "GroupId": "90676f8aa8-0945eb9e-3921-499a-9bd1-038e3e88da00"
  },
  "aws-edc-admins": {
    "DisplayName": "aws-edc-admins",
    "GroupId": "90676f8aa8-c9c44040-26f5-44b7-b7f1-0986db52652b"
  },
  "aws-edc-engineers": {
    "DisplayName": "aws-edc-engineers",
    "GroupId": "90676f8aa8-83356acd-3a8c-496e-970f-3e3ea1adabf2"
  },
  "aws-mf-admins": {
    "DisplayName": "aws-mf-admins",
    "GroupId": "90676f8aa8-f9773db2-b0e7-44b7-86de-cb55ca86f133"
  },
  "aws-mf-engineers": {
    "DisplayName": "aws-mf-engineers",
    "GroupId": "90676f8aa8-0a347697-fa4d-48d6-8e1f-266d463839fb"
  },
  "aws-semiota-admins": {
    "DisplayName": "aws-semiota-admins",
    "GroupId": "90676f8aa8-67f2150b-c5bf-4ea8-98ab-e7d6eb9ca52a"
  }
};

export const SSO_CONFIG: SsoConfig<GroupName> = {
  instanceArn: 'arn:aws:sso:::instance/ssoins-722379e539817c1c',
  identityStoreId: 'd-90676f8aa8',
  groups: GROUPS,
};
