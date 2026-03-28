import { Role } from "@prisma/client"

// High-level permissions used in the app.
export type Permission = "USER_MANAGE" | "SNIPPET_MANAGE_ALL" | "SNIPPET_MANAGE_OWN" | "SNIPPET_READ"

// Map each Role to a list of permissions.
export const rolePermissions: Record<Role, Permission[]> = {
  [Role.ADMIN]: ["USER_MANAGE", "SNIPPET_MANAGE_ALL", "SNIPPET_MANAGE_OWN", "SNIPPET_READ"],
  [Role.USER]: ["SNIPPET_MANAGE_OWN", "SNIPPET_READ"],
}

// Helper to check if a role includes a permission.
export function roleHasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false
}
