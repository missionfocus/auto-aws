const { awscdk } = require('projen');
const { GithubWorkflow } = require('projen/lib/github');
const { JobPermission } = require('projen/lib/github/workflows-model');
const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '2.22.0',
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
      'role-to-assume': 'arn:aws:iam::123456789012:role/GitHubAdmin',
      'role-session-name': 'GitHubAction',
      'aws-region': 'us-east-1',
    },
  }, {
    name: 'Who am I?',
    run: 'aws sts get-caller-identity',
  }],
});

project.synth();
