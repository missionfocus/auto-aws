import {
  aws_sso as sso,
  Stack,
  StackProps,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AccountPermission } from './account-permission-sfn';
import { ACCOUNTS } from './accounts';
import { SSO_INSTANCE_ARN } from './contants';

export interface SsoPermissionStackProps extends StackProps {
  //
}

export class SsoPermissionStack extends Stack {
  constructor(scope: Construct, id: string, props: SsoPermissionStackProps) {
    super(scope, id, props);

    const adminPermissionSet = new sso.CfnPermissionSet(this, 'AdminSet', {
      instanceArn: SSO_INSTANCE_ARN,
      name: 'AdminAccess',
      description: 'Grant administrative access',
      managedPolicies: [
        'arn:aws:iam::aws:policy/AdministratorAccess',
      ],
      sessionDuration: 'PT8H',
    });

    const readOnlyPermissionSet = new sso.CfnPermissionSet(this, 'ReadOnlySet', {
      instanceArn: SSO_INSTANCE_ARN,
      name: 'ReadOnlyAccess',
      description: 'Grant read only access',
      managedPolicies: [
        'arn:aws:iam::aws:policy/ReadOnlyAccess',
      ],
      sessionDuration: 'PT8H',
    });

    const billingPermissionSet = new sso.CfnPermissionSet(this, 'BillingSet', {
      instanceArn: SSO_INSTANCE_ARN,
      name: 'BillingAccess',
      description: 'Grant read-only and billing access',
      managedPolicies: [
        'arn:aws:iam::aws:policy/job-function/Billing',
        'arn:aws:iam::aws:policy/ReadOnlyAccess',
      ],
      sessionDuration: 'PT8H',
    });

    for (const account of ACCOUNTS) {
      for (const groupId of Object.keys(account.permissions)) {
        let permSet;
        switch (account.permissions[groupId]) {
          case 'Admin':
            permSet = adminPermissionSet;
            break;
          case 'Billing':
            permSet = billingPermissionSet;
            break;
          case 'ReadOnly':
            permSet = readOnlyPermissionSet;
            break;
          default:
            throw new Error('Invalid permission set type found');
        }

        new sso.CfnAssignment(this, `Assignment-${account.accountId}-${groupId}-${permSet.name}`, {
          instanceArn: SSO_INSTANCE_ARN,
          permissionSetArn: permSet.attrPermissionSetArn,
          targetType: 'AWS_ACCOUNT',
          targetId: account.accountId,
          principalType: 'GROUP',
          principalId: groupId,
        });
      }
    }

    new AccountPermission(this, 'AccountCreationWorkflow', {
      adminPermissionSet,
      readOnlyPermissionSet,
      billingPermissionSet,
    });
  }

}