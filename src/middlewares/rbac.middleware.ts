import { Response, NextFunction, Request } from 'express';
import { Role } from '@prisma/client';
import { Permission, roleHasPermission } from '../config/rbac.js';

// Require a minimum role (simple role hierarchy check).
export function requireRole(allowedRoles: Role[] | Role) {
  const allowed = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthenticated' });
    }
    if (!allowed.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient role' });
    }
    next();
  };
}

// Require a specific permission derived from rolePermissions.
export function requirePermission(permission: Permission) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthenticated' });
    }

    if (!roleHasPermission(req.user.role, permission)) {
      return res.status(403).json({ message: `Forbidden: missing permission ${permission}` });
    }

    next();
  };
}
