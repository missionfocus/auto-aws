import { BudgetStack, CostReportingStack, SsoPermissionStack } from '@taimos/cdk-controltower';
import { App } from 'aws-cdk-lib';
import { AccountName, ACCOUNTS } from './aws-accounts';
import { GroupName, SSO_CONFIG } from './aws-sso-config';
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
new SsoPermissionStack<AccountName, GroupName>(app, 'sso-permissions', {
  env: orgPrincipalEnv,
  accounts: ACCOUNTS,
  groupPermissions: {
    'mf-sso': {
      'AWS Super Admins': ['Admin', 'ReadOnly'],
    }, // Keep adding accounts here
    'Mission Focus': {
      'AWS Engineers': ['Admin', 'ReadOnly'],
    },
    'Institute for Modern Inteligence': {
      'AWS Engineers': ['Admin', 'ReadOnly'],
    },
    'MF Sandbox': {
      'AWS Engineers': ['Admin', 'ReadOnly'],
    },
    'Mission Focus S3': {
      'AWS Engineers': ['Admin', 'ReadOnly'],
    },
    'MF Office IT': {
      'AWS Admins': ['Admin', 'ReadOnly'],
    },
    'Semiota-sandbox': {
      'AWS Admins': ['Admin', 'ReadOnly'],
    },
    'Semiota-Production': {
      'AWS Admins': ['Admin', 'ReadOnly'],
    },
    'edc': {
      'AWS Super Admins': ['Admin', 'ReadOnly'],
    },
    'edc-sandbox': {
      'AWS Super Admins': ['Admin', 'ReadOnly'],
    },
    'Eick': {
      'AWS Super Admins': ['Admin', 'ReadOnly'],
    },
  },
  ssoConfig: SSO_CONFIG,
  defaultAssignmentsForNewAccount: [{
    groupName: 'AWS Super Admins',
    permissionSetName: 'Admin',
  }, {
    groupName: 'AWS Super Admins',
    permissionSetName: 'ReadOnly',
  }],
});

// ###############
// BILLING
// ###############
new CostReportingStack(app, 'billing-report', {
  orgPrincipalEnv,
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
