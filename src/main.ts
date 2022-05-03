import { App } from 'aws-cdk-lib';
import { GitHubAccessStack } from './github-access';

const app = new App();

new GitHubAccessStack(app, 'GitHubAccess', {
  env: {
    account: '292004443359',
    region: 'eu-central-1',
  },
});

app.synth();