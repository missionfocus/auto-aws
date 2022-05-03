import {
  aws_budgets as budgets,
  Stack,
  StackProps,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ACCOUNTS } from './accounts';

export interface BudgetStackProps extends StackProps {
  //
}

export class BudgetStack extends Stack {
  constructor(scope: Construct, id: string, props: BudgetStackProps) {
    super(scope, id, props);

    for (const account of ACCOUNTS) {
      new budgets.CfnBudget(this, `Budget${account.name}`, {
        budget: {
          budgetType: 'COST',
          budgetLimit: {
            unit: 'USD',
            amount: account.budget,
          },
          timeUnit: 'MONTHLY',
          costFilters: {
            LinkedAccount: [account.accountId],
          },
          costTypes: {
            includeCredit: true,
            includeDiscount: true,
            includeOtherSubscription: true,
            includeRecurring: true,
            includeRefund: true,
            includeSubscription: true,
            includeSupport: true,
            includeTax: false,
            includeUpfront: true,
            useAmortized: false,
            useBlended: false,
          },
        },
        notificationsWithSubscribers: [
          {
            notification: {
              notificationType: 'ACTUAL',
              comparisonOperator: 'GREATER_THAN',
              threshold: 90,
            },
            subscribers: [
              {
                subscriptionType: 'EMAIL',
                address: account.email,
              },
            ],
          }, {
            notification: {
              notificationType: 'FORECASTED',
              comparisonOperator: 'GREATER_THAN',
              threshold: 100,
            },
            subscribers: [
              {
                subscriptionType: 'EMAIL',
                address: account.email,
              },
            ],
          },
        ],
      });
    }

  }
}
