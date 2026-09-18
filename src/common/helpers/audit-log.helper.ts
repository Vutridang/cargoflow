import { Types } from 'mongoose';

export function buildAuditLog(
  userId: Types.ObjectId,
  action: string,
  resource: string,
  resourceId: Types.ObjectId,
  oldData?: Record<string, any>,
  newData?: Record<string, any>,
) {
  return {
    userId,
    action,
    resource,
    resourceId: resourceId.toString(),
    oldData,
    newData,
  };
}
