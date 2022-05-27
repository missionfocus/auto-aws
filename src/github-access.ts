import { GithubActionsIdentityProvider, GithubActionsRole } from 'aws-cdk-github-oidc';
import { Duration, Stack, StackProps, aws_iam as iam, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export interface GitHubAccessStackProps extends StackProps {
  //
}

export class GitHubAccessStack extends Stack {
  constructor(scope: Construct, id: string, props: GitHubAccessStackProps) {
    super(scope, id, props);

    const provider = new GithubActionsIdentityProvider(this, 'GithubProvider');

    const deployRole = new GithubActionsRole(this, 'GitHubAdminRole', {
      provider: provider,
      owner: 'missionfocus',
      repo: 'auto-aws',
      roleName: 'GitHubAdmin',
      description: 'This role deploys to AWS',
      maxSessionDuration: Duration.hours(2),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess'),
      ],
    });

    new CfnOutput(this, 'GitHubAdminRoleArn', { value: deployRole.roleArn });
  }
}