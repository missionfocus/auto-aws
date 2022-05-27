import {
  aws_events,
  aws_events_targets as targets,
  aws_sso as sso,
  aws_stepfunctions as sfn,
  aws_stepfunctions_tasks as tasks,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { SSO_INSTANCE_ARN } from './contants';

export interface AccountPermissionProps {
  readonly adminPermissionSet: sso.CfnPermissionSet;
  readonly readOnlyPermissionSet: sso.CfnPermissionSet;
  readonly billingPermissionSet: sso.CfnPermissionSet;
}

export class AccountPermission extends Construct {

  public readonly stateMachine: sfn.StateMachine;

  constructor(scope: Construct, id: string, props: AccountPermissionProps) {
    super(scope, id);

    const assignAdminToAdmins = new AddAssociationTask(this, 'AssignAdminToAdmins', {
      groupId: '90676f8aa8-0945eb9e-3921-499a-9bd1-038e3e88da00', // aws-admins
      permissionSetArn: props.adminPermissionSet.attrPermissionSetArn,
    });
    const assignReadOnlyToAdmins = new AddAssociationTask(this, 'AssignReadOnlyToAdmins', {
      groupId: '90676f8aa8-0945eb9e-3921-499a-9bd1-038e3e88da00', // aws-admins
      permissionSetArn: props.readOnlyPermissionSet.attrPermissionSetArn,
    });

    this.stateMachine = new sfn.StateMachine(this, 'Resource', {
      definition: assignAdminToAdmins.next(assignReadOnlyToAdmins),
    });

    new aws_events.Rule(this, 'AccountCreationRule', {
      eventPattern: {
        source: ['aws.controltower'],
        detailType: ['AWS Service Event via CloudTrail'],
        detail: {
          eventName: ['CreateManagedAccount'],
        },
      },
      targets: [
        new targets.SfnStateMachine(this.stateMachine),
      ],
    });
  }

}

interface AddAssociationTaskProps {
  readonly groupId: string;
  readonly permissionSetArn: string;
  readonly accountIdSource?: string;
  readonly resultPath?: string;
}

class AddAssociationTask extends tasks.CallAwsService {
  constructor(scope: Construct, id: string, props: AddAssociationTaskProps) {
    super(scope, id, {
      service: 'ssoadmin',
      action: 'createAccountAssignment',
      iamResources: ['*'],
      iamAction: 'sso:CreateAccountAssignment',
      parameters: {
        'InstanceArn': SSO_INSTANCE_ARN,
        'PermissionSetArn': props.permissionSetArn,
        'TargetType': 'AWS_ACCOUNT',
        'TargetId.$': props.accountIdSource ?? '$.accountId',
        'PrincipalType': 'GROUP',
        'PrincipalId': props.groupId,
      },
      resultPath: props.resultPath ?? `$.${id}`,
    });
    this.addRetry();
  }
}
