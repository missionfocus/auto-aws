import { App } from 'aws-cdk-lib';
import { BudgetStack } from './budget';
import { ORG_PRINCIPAL_ACCOUNT } from './contants';
import { CostReportingStack } from './cur';
import { GitHubAccessStack } from './github-access';
import { LogBucketStack } from './log-buckets';
import { SsoPermissionStack } from './sso-permissions';

const app = new App();

const orgPrincipalEnv = {
  account: ORG_PRINCIPAL_ACCOUNT,
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
new SsoPermissionStack(app, 'sso-permissions', {
  env: orgPrincipalEnv,
});

// ###############
// BILLING
// ###############
new CostReportingStack(app, 'billing-report', {
  env: orgPrincipalEnv,
});
new BudgetStack(app, 'billing-budgets', {
  env: orgPrincipalEnv,
});

// ###############
// SECURITY
// ###############
new LogBucketStack(app, 'log-buckets', {
  env: {
    region: 'us-east-1',
    account: '123456789012', // Log Archive Account
  },
});

app.synth();