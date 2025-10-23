export type Role = 'super_admin' | 'content_admin';

export interface Permission {
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canManageUsers?: boolean;
  canManageAllContent?: boolean;
}

export const PERMISSIONS: Record<Role, Permission> = {
  super_admin: {
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: true,
    canManageUsers: true,
    canManageAllContent: true,
  },
  content_admin: {
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: true,
    canManageUsers: false,
    canManageAllContent: false,
  },
};

export function hasPermission(
  userRole: Role,
  action: keyof Permission
): boolean {
  const permissions = PERMISSIONS[userRole];
  return permissions[action] === true;
}

export function canManageContent(
  userRole: Role,
  contentCreatorId: string,
  currentUserId: string
): boolean {
  // Super admin can manage all content
  if (userRole === 'super_admin') {
    return true;
  }
  
  // Content admin can only manage their own content
  return contentCreatorId === currentUserId;
}

