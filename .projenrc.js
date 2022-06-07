const { awscdk } = require('projen');
const { GithubWorkflow } = require('projen/lib/github');
const { JobPermission } = require('projen/lib/github/workflows-model');
const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '2.25.0',
  defaultReleaseBranch: 'main',
  name: 'auto-aws',
  githubOptions: {
    mergify: false,
  },
  autoMerge: false,
  autoApproveUpgrades: false,
  buildWorkflow: false,
  depsUpgrade: false,
  deps: [
    'aws-cdk-github-oidc',
    'cdk-iam-floyd',
    '@taimos/cdk-controltower',
  ],
});

const deploy = new GithubWorkflow(project.github, 'deploy');
deploy.on({
  push: {},
  workflowDispatch: {},
});
deploy.addJob('deploy', {
  name: 'Deploy changes to AWS',
  runsOn: ['ubuntu-latest'],
  permissions: { idToken: JobPermission.WRITE, contents: JobPermission.READ },
  steps: [{
    name: 'Checkout',
    uses: 'actions/checkout@v2',
  }, {
    name: 'AWS Credentials',
    uses: 'aws-actions/configure-aws-credentials@master',
    with: {
      'role-to-assume': 'arn:aws:iam::259975631390:role/GitHubAdmin',
      'role-session-name': 'GitHubAction',
      'aws-region': 'eu-central-1',
    },
  }, {
    name: 'Install packages',
    run: 'yarn install --frozen-lockfile',
  }, {
    name: 'CDK Synth',
    run: 'npx cdk synth -q',
  }, {
    name: 'CDK Diff',
    run: 'npx cdk --app cdk.out diff --all',
  }, {
    name: 'CDK Deploy SSO',
    run: 'npx cdk --app cdk.out --require-approval never deploy \'sso-*\'',
  }, {
    name: 'CDK Deploy Billing',
    run: 'npx cdk --app cdk.out --require-approval never deploy \'billing-*\'',
  }],
});

project.addTask('fetch-accounts', { exec: 'fetch-accounts' });

project.synth();
