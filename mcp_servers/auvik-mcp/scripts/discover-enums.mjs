#!/usr/bin/env node
// Auvik returns GraphQL-style "value X does not exist in Enum" 400s.
// Provoke them on purpose to extract authoritative enum lists.

import { config } from 'dotenv';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../../../.env') });

let region = process.env.AUVIK_REGION || 'us1';
const auth = 'Basic ' + Buffer.from(`${process.env.AUVIK_USERNAME}:${process.env.AUVIK_API_KEY}`).toString('base64');
const base = () => `https://auvikapi.${region}.my.auvik.com/v1`;

async function fetchWithRedirect(url) {
  for (let i = 0; i < 5; i++) {
    const r = await fetch(url, { headers: { Authorization: auth, Accept: 'application/json' }, redirect: 'manual' });
    if (r.status === 308 || r.status === 301 || r.status === 307) {
      const loc = r.headers.get('location');
      const m = loc?.match(/auvikapi\.([a-z0-9]+)\.my\.auvik\.com/);
      if (m) region = m[1];
      url = loc;
      continue;
    }
    return r;
  }
  throw new Error('too many redirects');
}

async function probe(label, path, params) {
  const qs = Object.entries(params || {})
    .map(([k, v]) => `${k.replace(/\[/g, '%5B').replace(/\]/g, '%5D')}=${encodeURIComponent(v)}`)
    .join('&');
  const url = `${base()}${path}${qs ? '?' + qs : ''}`;
  const r = await fetchWithRedirect(url);
  const body = await r.text();
  console.log(`\n=== ${label}  HTTP ${r.status} ===`);
  console.log(`URL: ${url}`);
  try {
    const j = JSON.parse(body);
    const msg = j.errors?.[0]?.title || j.errors?.[0]?.detail || '';
    if (msg.includes('does not exist in')) {
      // Extract the enum list
      const m = msg.match(/Did you mean .*?\?/) || msg.match(/Possible values are[: ]+(.+)/);
      console.log('Error:', msg.slice(0, 1500));
    } else if (j.errors) {
      console.log('Errors:', JSON.stringify(j.errors).slice(0, 1500));
    } else {
      console.log('OK:', JSON.stringify(j).slice(0, 400));
    }
  } catch {
    console.log(body.slice(0, 1000));
  }
}

// First grab a tenant + device + interface
const tres = await fetchWithRedirect(`${base()}/tenants`);
const tenants = (await tres.json()).data;
const tenant = tenants.find((t) => t.attributes?.tenantType !== 'parentMsp') || tenants[0];
const tenantId = tenant.id;
console.log('Tenant:', tenantId, tenant.attributes?.domainPrefix);

// === Interface statId enum ===
await probe('InterfaceStatisticsId enum', '/stat/interface/INVALID_STAT_ID', {
  tenants: tenantId,
  'filter[fromTime]': '2026-05-26T00:00:00.000Z',
  'filter[thruTime]': '2026-05-27T00:00:00.000Z',
  'filter[interval]': 'hour',
});

// === Device statId enum ===
await probe('DeviceStatisticsId enum', '/stat/device/INVALID_STAT_ID', {
  tenants: tenantId,
  'filter[fromTime]': '2026-05-26T00:00:00.000Z',
  'filter[thruTime]': '2026-05-27T00:00:00.000Z',
  'filter[interval]': 'hour',
});

// === Statistics interval enum ===
await probe('Statistics interval enum', '/stat/device/cpuUtilization', {
  tenants: tenantId,
  'filter[fromTime]': '2026-05-26T00:00:00.000Z',
  'filter[thruTime]': '2026-05-27T00:00:00.000Z',
  'filter[interval]': 'INVALID_INTERVAL',
});

// === Alert status enum ===
await probe('Alert status enum', '/alert/history/info', {
  tenants: tenantId,
  'filter[status]': 'INVALID_STATUS',
});

// === Alert severity enum ===
await probe('Alert severity enum', '/alert/history/info', {
  tenants: tenantId,
  'filter[severity]': 'INVALID_SEVERITY',
});

// === Device onlineStatus enum ===
await probe('Device onlineStatus enum', '/inventory/device/info', {
  tenants: tenantId,
  'filter[onlineStatus]': 'INVALID',
});

// === Device deviceType enum ===
await probe('Device deviceType enum', '/inventory/device/info', {
  tenants: tenantId,
  'filter[deviceType]': 'INVALID',
});

// === Interface filter[interfaceType] enum ===
await probe('Interface interfaceType enum', '/inventory/interface/info', {
  tenants: tenantId,
  'filter[interfaceType]': 'INVALID',
});

// === Interface adminStatus type ===
await probe('Interface adminStatus (bool?)', '/inventory/interface/info', {
  tenants: tenantId,
  'filter[adminStatus]': 'INVALID',
});

// === Interface operationalStatus enum ===
await probe('Interface operationalStatus enum', '/inventory/interface/info', {
  tenants: tenantId,
  'filter[operationalStatus]': 'INVALID',
});

// === Network networkType enum ===
await probe('Network networkType enum', '/inventory/network/info', {
  tenants: tenantId,
  'filter[networkType]': 'INVALID',
});

// === Network scanStatus enum ===
await probe('Network scanStatus enum', '/inventory/network/info', {
  tenants: tenantId,
  'filter[scanStatus]': 'INVALID',
});

// === Component componentType enum ===
await probe('Component componentType enum', '/inventory/component/info', {
  tenants: tenantId,
  'filter[componentType]': 'INVALID',
});

// === Entity audit category enum ===
await probe('Entity audit category enum', '/inventory/entity/audit', {
  tenants: tenantId,
  'filter[category]': 'INVALID',
});

// === Tenants: are filters accepted? Try unknown filter ===
await probe('Devices unknown filter[xyz]', '/inventory/device/info', {
  tenants: tenantId,
  'filter[xyz]': 'whatever',
});

// === Without tenants on devices? ===
await probe('Devices no tenants', '/inventory/device/info', {});

// === Stats without interval? ===
await probe('Stats no interval', '/stat/device/cpuUtilization', {
  tenants: tenantId,
  'filter[fromTime]': '2026-05-26T00:00:00.000Z',
  'filter[thruTime]': '2026-05-27T00:00:00.000Z',
});
