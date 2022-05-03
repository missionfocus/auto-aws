import {
  aws_iam as iam,
  aws_kms as kms,
  aws_s3 as s3,
  Stack,
  StackProps,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ORG_PRINCIPAL_ACCOUNT } from './contants';

export const FLOW_LOG_BUCKET_NAME = `${ORG_PRINCIPAL_ACCOUNT}-vpc-flow-logs`;

export interface LogBucketStackProps extends StackProps {
  //
}

export class LogBucketStack extends Stack {
  constructor(scope: Construct, id: string, props: LogBucketStackProps) {
    super(scope, id, props);

    const encryptionKey = new kms.Key(this, 'FlowLogsKey', {
      enableKeyRotation: false,
      alias: 'vpc-flow-logs',
    });
    encryptionKey.grantEncryptDecrypt(new iam.ServicePrincipal('delivery.logs.amazonaws.com'));

    const flowLogsBucket = new s3.Bucket(this, 'FlowLogs', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryptionKey,
      bucketName: FLOW_LOG_BUCKET_NAME,
    });
    flowLogsBucket.grantReadWrite(new iam.ServicePrincipal('delivery.logs.amazonaws.com'));

  }
}