import { Shipment, ShipmentStatus } from "src/shipments/schemas/shipment.schema";


export function buildTrackingInfo(
  shipment: Shipment,
  status: ShipmentStatus,
  warehouseName?: string,
) {
  switch (status) {
    case ShipmentStatus.PENDING:
      return {
        location: shipment.pickup.address,
        trackingNote: 'The shipment has been created',
      };

    case ShipmentStatus.CONFIRMED:
      return {
        location: shipment.pickup.address,
        trackingNote: 'The shipment has been confirmed',
      };

    case ShipmentStatus.ASSIGNED:
      return {
        location: warehouseName,
        trackingNote: 'The shipment has been assigned for delivery',
      };

    case ShipmentStatus.IN_TRANSIT:
      return {
        location: warehouseName,
        trackingNote: 'The shipment is in transit',
      };

    case ShipmentStatus.DELIVERED:
      return {
        location: shipment.delivery.address,
        trackingNote: 'The shipment has been delivered successfully',
      };

    case ShipmentStatus.CANCELLED:
      return {
        location: shipment.pickup.address,
        trackingNote: 'The shipment has been cancelled',
      };
  }
}