export type PermissionKey =
  | 'tasks.read'
  | 'tasks.create'
  | 'tasks.update'
  | 'tasks.delete'
  | 'org.manage'
  | 'users.manage'
  | 'audit.read';

export const ALL_PERMISSIONS: PermissionKey[] = [
  'tasks.read',
  'tasks.create',
  'tasks.update',
  'tasks.delete',
  'org.manage',
  'users.manage',
  'audit.read',
];

export const ROLE_PERMISSIONS: Record<string, PermissionKey[]> = {
  OWNER: [
    'tasks.read',
    'tasks.create',
    'tasks.update',
    'tasks.delete',
    'org.manage',
    'users.manage',
    'audit.read',
  ],
  ADMIN: [
    'tasks.read',
    'tasks.create',
    'tasks.update',
    'tasks.delete',
    'audit.read',
  ],
  VIEWER: ['tasks.read'],
};
