
export type PermissionType = 'Billing' | 'Admin' | 'ReadOnly';

export interface AccountInfo {
  readonly accountId: string;
  readonly name: string;
  readonly email: string;
  readonly budget: number;
  readonly permissions: { [groupId: string]: PermissionType[] };
}

export const ACCOUNTS: AccountInfo[] = [
  {
    accountId: '259975631390',
    name: 'mf-sso',
    budget: 400,
    email: 'maeick+mf-sso@missionfocus.com',
    permissions: {
      '90676f8aa8-1ca4896c-398f-4db9-b3b8-44751f8a2283': ['Admin', 'ReadOnly'],
    },
  },
];
