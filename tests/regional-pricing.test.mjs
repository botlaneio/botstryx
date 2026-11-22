import assert from 'node:assert/strict';
import {test} from 'node:test';
import {regionForHostname, regionalAmount, formatRegionalMoney, INDIA_PRICES_INR, INDIA_FOUNDING_DISCOUNT_ENABLED} from '../src/lib/regional-pricing.ts';

test('regional hostnames map to correct market', () => {
  for (const host of ['botlane.io', 'www.botlane.io']) assert.equal(regionForHostname(host), 'us');
  for (const host of ['botlane.in', 'www.botlane.in', 'BOTLANE.IN.']) assert.equal(regionForHostname(host), 'in');
  assert.equal(regionForHostname('unknown.example'), 'us');
});

test('Indian price book is independent from US prices', () => {
  for (const [id, amount] of Object.entries(INDIA_PRICES_INR)) {
    assert.equal(regionalAmount(id, 1, 'in'), amount);
    assert.equal(regionalAmount(id, 1, 'us'), 1);
  }
  assert.throws(() => regionalAmount('missing-plan', 1, 'in'), /Missing INR price/);
  assert.equal(INDIA_FOUNDING_DISCOUNT_ENABLED, false);
});

test('currency formatting reflects the selected market', () => {
  assert.match(formatRegionalMoney(39900, 'in'), /₹/);
  assert.match(formatRegionalMoney(2500, 'us'), /\$/);
});
