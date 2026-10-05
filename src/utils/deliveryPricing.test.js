import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateDeliveryPrice, DELIVERY_PRICE_CAP } from './deliveryPricing.js';

test('standard delivery price stays within Nigeria cap', () => {
  const highDistancePrice = calculateDeliveryPrice({ distanceKm: 500, durationMinutes: 120 });
  const shortDistancePrice = calculateDeliveryPrice({ distanceKm: 2, durationMinutes: 10 });

  assert.ok(highDistancePrice <= DELIVERY_PRICE_CAP);
  assert.equal(shortDistancePrice, 1500);
  assert.ok(calculateDeliveryPrice({ distanceKm: 30, durationMinutes: 45 }) > 1500);
});
