import {
  BadRequestException,
} from '@nestjs/common';

import {
  ShipmentStatus,
} from '../../shipments/schemas/shipment.schema';

export function validateShipmentEditable(
  status: ShipmentStatus,
  action: string,
) {
  const allowedStatuses = [
    ShipmentStatus.PENDING,
    ShipmentStatus.CONFIRMED,
  ];

  if (!allowedStatuses.includes(status)) {
    throw new BadRequestException(
      `Cannot ${action} when shipment status is ${status}`,
    );
  }
}