import { BudgetStack, SsoPermissionStack } from '@taimos/cdk-controltower';
import { App } from 'aws-cdk-lib';
import { AccountName, ACCOUNTS } from './aws-accounts';
import { CostReportingStack } from './cur';
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
      '90676f8aa8-1ca4896c-398f-4db9-b3b8-44751f8a2283': ['Admin', 'ReadOnly'],
    },
  },
  ssoInstanceArn: 'arn:aws:sso:::instance/ssoins-722379e539817c1c',
  defaultAssignmentsForNewAccount: [{
    groupId: '90676f8aa8-0945eb9e-3921-499a-9bd1-038e3e88da00', // aws-admins
    permissionSetName: 'Admin',
  }, {
    groupId: '90676f8aa8-0945eb9e-3921-499a-9bd1-038e3e88da00', // aws-admins
    permissionSetName: 'ReadOnly',
  }],
});

// ###############
// BILLING
// ###############
new CostReportingStack(app, 'billing-report', {
  env: orgPrincipalEnv,
});
new BudgetStack<AccountName>(app, 'billing-budgets', {
  env: orgPrincipalEnv,
  accounts: ACCOUNTS,
  budgets: {
    'mf-sso': 400,
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