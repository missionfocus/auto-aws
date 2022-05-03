
export type PermissionType = 'Billing' | 'Admin' | 'ReadOnly';

export interface AccountInfo {
  readonly accountId: string;
  readonly name: string;
  readonly email: string;
  readonly budget: number;
  readonly permissions: { [groupId: string]: PermissionType };
}

export const ACCOUNTS: AccountInfo[] = [
  {
    accountId: '123456789012',
    name: 'testaccount',
    budget: 400,
    email: 'info@taimos.de',
    permissions: {
      '1234567': 'Billing',
      '96543-243': 'ReadOnly',
    },
  },
];
