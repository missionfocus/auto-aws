import {
  aws_cur as cur,
  aws_iam as iam,
  aws_s3 as s3,
  Stack,
  StackProps,
} from 'aws-cdk-lib';
import * as st from 'cdk-iam-floyd';
import { Construct } from 'constructs';

export interface CostReportingStackProps extends StackProps {
  //
}

export class CostReportingStack extends Stack {
  constructor(scope: Construct, id: string, props: CostReportingStackProps) {
    super(scope, id, props);

    const curBucket = new s3.Bucket(this, 'CurBucket', {
      bucketName: 'missionfocus-billing', // TODO
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
    });
    curBucket.grantPut(new iam.AccountPrincipal('386209384616')); // CUR Account
    curBucket.addToResourcePolicy(new st.S3().allow().toGetBucketAcl().toGetBucketPolicy().onBucket(curBucket.bucketName).forAccount('386209384616'));

    new cur.CfnReportDefinition(this, 'CurDefinition', {
      compression: 'GZIP',
      format: 'textORcsv',
      refreshClosedReports: false,
      reportName: 'missionfocus-cur',
      reportVersioning: 'CREATE_NEW_REPORT',
      s3Bucket: curBucket.bucketName,
      s3Prefix: 'reports',
      s3Region: 'us-east-1',
      timeUnit: 'HOURLY',
      additionalSchemaElements: ['RESOURCES'],
    });

  }
}
