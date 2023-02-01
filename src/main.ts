import { BudgetStack, CostReportingStack, SsoPermissionStack } from '@taimos/cdk-controltower';
import { App } from 'aws-cdk-lib';
import { AccountName, ACCOUNTS } from './aws-accounts';
import { GitHubAccessStack } from './github-access';

const app = new App();

const orgPrincipalEnv = {
  account: ACCOUNTS['mf-sso'].Id,
  region: 'us-east-1',
};

// ###############
// GitHub Access
// ###############
new GitHubAccessStack(app, 'GitHubAccess', {
  env: orgPrincipalEnv,
});

// ###############
// SSO
// ###############
new SsoPermissionStack<AccountName>(app, 'sso-permissions', {
  env: orgPrincipalEnv,
  accounts: ACCOUNTS,
  groupPermissions: {
    'mf-sso': {
      '90676f8aa8-1ca4896c-398f-4db9-b3b8-44751f8a2283': ['Admin', 'ReadOnly'], //AWS Super Admins
    }, // Keep adding accounts here
    'Mission Focus': {
      '90676f8aa8-2fa2fe51-8f74-440c-987b-ad2bfe576c3d': ['Admin', 'ReadOnly'], //AWS Engineers
    },
    'Institute for Modern Inteligence': {
      '90676f8aa8-2fa2fe51-8f74-440c-987b-ad2bfe576c3d': ['Admin', 'ReadOnly'], //AWS Engineers
    },
    'MF Sandbox': {
      '90676f8aa8-2fa2fe51-8f74-440c-987b-ad2bfe576c3d': ['Admin', 'ReadOnly'], //AWS Engineers
    },
    'Mission Focus S3': {
      '90676f8aa8-2fa2fe51-8f74-440c-987b-ad2bfe576c3d': ['Admin', 'ReadOnly'], //AWS Engineers
    },
    'MF Office IT': {
      '90676f8aa8-406545af-4bee-4687-98f8-206de9e3f4ce': ['Admin', 'ReadOnly'], //AWS Admins
    },
    'Semiota-sandbox': {
      '90676f8aa8-406545af-4bee-4687-98f8-206de9e3f4ce': ['Admin', 'ReadOnly'], //AWS Admins
    },
    'Semiota-Production': {
      '90676f8aa8-406545af-4bee-4687-98f8-206de9e3f4ce': ['Admin', 'ReadOnly'], //AWS Admins
    },
    'edc': {
      '90676f8aa8-1ca4896c-398f-4db9-b3b8-44751f8a2283': ['Admin', 'ReadOnly'], //AWS Super Admins
    },
    'edc-sandbox': {
      '90676f8aa8-1ca4896c-398f-4db9-b3b8-44751f8a2283': ['Admin', 'ReadOnly'], //AWS Super Admins
    },
    'Eick': {
      '90676f8aa8-1ca4896c-398f-4db9-b3b8-44751f8a2283': ['Admin', 'ReadOnly'], //AWS Super Admins
    },
  },
  ssoInstanceArn: 'arn:aws:sso:::instance/ssoins-722379e539817c1c',
  defaultAssignmentsForNewAccount: [{
    groupId: '90676f8aa8-1ca4896c-398f-4db9-b3b8-44751f8a2283', // AWS Super Admins
    permissionSetName: 'Admin',
  }, {
    groupId: '90676f8aa8-1ca4896c-398f-4db9-b3b8-44751f8a2283', // AWS Super Admins
    permissionSetName: 'ReadOnly',
  }],
});

// ###############
// BILLING
// ###############
new CostReportingStack(app, 'billing-report', {
  env: orgPrincipalEnv,
  costReportBucketName: 'missionfocus-billing',
  costReportName: 'missionfocus-cur',
});
new BudgetStack<AccountName>(app, 'billing-budgets', {
  env: orgPrincipalEnv,
  accounts: ACCOUNTS,
  budgets: {
    // Account name: Budget in USD
    'mf-sso': 400,
    'Mission Focus': 5000,
  },
});

// ###############
// SECURITY
// ###############
// new LogBucketStack(app, 'log-buckets', {
//   env: {
//     region: 'us-east-1',
//     account: ACCOUNTS['Log Archive'].Id,
//   },
//   orgAccountId: ACCOUNTS['mf-sso'].Id,
// });

app.synth();
