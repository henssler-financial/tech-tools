#!/usr/bin/env node
// Live-probe every Auvik MCP tool against real credentials.
// Loads creds from the parent toolkit .env, then exercises each handler with
// realistic args and reports pass/fail/status per tool.

import { config } from 'dotenv';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load parent toolkit .env first, then local override
config({ path: resolve(__dirname, '../../../.env') });
config({ path: resolve(__dirname, '../.env'), override: false });

const handlers = await import('../dist/index.js').catch(() => null);

// We need handlers directly, not the server. Import from source.
const mod = await import('../src/server.ts').catch(async () => {
  // Fallback: import individual tool modules from dist? dist is a single bundle.
  // Easier: import source via tsx
  return null;
});

// Use tsx-style runtime — but the user's node may not have it. Instead, re-export handlers via a tiny bridge.
import { handleStatus } from '../src/tools/status.ts';
import { handleTenantsList, handleTenantsDetail } from '../src/tools/tenants.ts';
import { handleDevicesList, handleDevicesGet, handleDevicesGetDetails, handleDevicesListWarranty, handleDevicesListLifecycle } from '../src/tools/devices.ts';
import { handleNetworksList, handleNetworksGet, handleNetworksListDetail } from '../src/tools/networks.ts';
import { handleInterfacesList, handleInterfacesGet } from '../src/tools/interfaces.ts';
import { handleConfigurationsList, handleConfigurationsGet } from '../src/tools/configurations.ts';
import { handleComponentsList } from '../src/tools/components.ts';
import { handleEntitiesListNotes, handleEntitiesListAudits } from '../src/tools/entities.ts';
import { handleAlertsList, handleAlertsGet } from '../src/tools/alerts.ts';
import { handleStatisticsDevice, handleStatisticsInterface } from '../src/tools/statistics.ts';
import { handleBillingClientUsage } from '../src/tools/billing.ts';
import { handleNavigate } from '../src/tools/navigate.ts';

const results = [];
const log = (name, ok, summary, raw) => {
  results.push({ name, ok, summary });
  const tag = ok ? 'PASS' : 'FAIL';
  console.log(`[${tag}] ${name}  ${summary}`);
  if (process.env.VERBOSE && raw) console.log(raw.slice(0, 2000));
};

const summarize = (r) => {
  if (!r) return 'no result';
  if (r.isError) return `ERROR: ${(r.content?.[0]?.text || '').split('\n')[0].slice(0, 200)}`;
  try {
    const body = JSON.parse(r.content[0].text);
    if (body?.data === null || body?.data === undefined) return 'ok (empty)';
    if (Array.isArray(body.data)) return `ok (${body.data.length} items)`;
    return `ok (${body.data?.type || 'object'})`;
  } catch {
    return `ok (${(r.content?.[0]?.text || '').slice(0, 80)})`;
  }
};

const run = async (name, fn) => {
  try {
    const r = await fn();
    log(name, !r.isError, summarize(r), r.content?.[0]?.text);
    return r;
  } catch (e) {
    log(name, false, `THREW: ${e.message}`);
    return null;
  }
};

console.log('=== Auvik MCP — live tool probe ===');
console.log(`Region: ${process.env.AUVIK_REGION}  User: ${process.env.AUVIK_USERNAME}`);
console.log('');

await run('auvik_status', () => handleStatus());

// Get a tenant id to use for subsequent calls
const tenantsResp = await run('auvik_tenants_list', () => handleTenantsList());
let tenantId = null;
let tenantPrefix = null;
let parentTenantId = null;
try {
  const body = JSON.parse(tenantsResp.content[0].text);
  const items = Array.isArray(body?.data) ? body.data : [];
  // Prefer a sub-tenant (client) rather than the parent MSP root
  const client = items.find((t) => t.attributes?.tenantType !== 'parentMsp') || items[0];
  tenantId = client?.id;
  tenantPrefix = client?.attributes?.domainPrefix;
  const parent = items.find((t) => t.attributes?.tenantType === 'parentMsp');
  parentTenantId = parent?.id || tenantId;
  console.log(`  → using tenantId=${tenantId} prefix=${tenantPrefix} (parent=${parentTenantId})`);
} catch (e) {
  console.log('  could not parse tenants response:', e.message);
}

if (tenantPrefix) {
  await run('auvik_tenants_detail', () => handleTenantsDetail({ tenantDomainPrefix: tenantPrefix }));
}

if (!tenantId) {
  console.log('No tenant id — aborting remaining tests.');
  process.exit(1);
}

const devicesResp = await run('auvik_devices_list', () =>
  handleDevicesList({ tenants: tenantId, pageSize: 5 })
);
let deviceId = null;
try {
  const body = JSON.parse(devicesResp.content[0].text);
  deviceId = body.data?.[0]?.id;
  console.log(`  → using deviceId=${deviceId}`);
} catch {}

if (deviceId) {
  await run('auvik_devices_get', () => handleDevicesGet({ deviceId }));
  await run('auvik_devices_get_details', () => handleDevicesGetDetails({ deviceId }));
}

await run('auvik_devices_list_warranty', () => handleDevicesListWarranty({ tenants: tenantId, pageSize: 3 }));
await run('auvik_devices_list_lifecycle', () => handleDevicesListLifecycle({ tenants: tenantId, pageSize: 3 }));

const netsResp = await run('auvik_networks_list', () => handleNetworksList({ tenants: tenantId, pageSize: 3 }));
let networkId = null;
try {
  const body = JSON.parse(netsResp.content[0].text);
  networkId = body.data?.[0]?.id;
} catch {}
if (networkId) {
  await run('auvik_networks_get', () => handleNetworksGet({ networkId }));
}
await run('auvik_networks_list_detail', () => handleNetworksListDetail({ tenants: tenantId, pageSize: 3 }));

const ifResp = await run('auvik_interfaces_list', () => handleInterfacesList({ tenants: tenantId, pageSize: 3 }));
let interfaceId = null;
try {
  const body = JSON.parse(ifResp.content[0].text);
  interfaceId = body.data?.[0]?.id;
} catch {}
if (interfaceId) {
  await run('auvik_interfaces_get', () => handleInterfacesGet({ interfaceId }));
}

const cfgResp = await run('auvik_configurations_list', () => handleConfigurationsList({ tenants: tenantId, pageSize: 3 }));
let configId = null;
try {
  const body = JSON.parse(cfgResp.content[0].text);
  configId = body.data?.[0]?.id;
} catch {}
if (configId) {
  await run('auvik_configurations_get', () => handleConfigurationsGet({ configurationId: configId }));
}

await run('auvik_components_list', () => handleComponentsList({ tenants: tenantId, pageSize: 3 }));
await run('auvik_entities_list_notes', () => handleEntitiesListNotes({ tenants: tenantId, pageSize: 3 }));
await run('auvik_entities_list_audits', () => handleEntitiesListAudits({ tenants: tenantId, pageSize: 3 }));

const alertsResp = await run('auvik_alerts_list', () => handleAlertsList({ tenants: tenantId, pageSize: 3 }));
let alertId = null;
try {
  const body = JSON.parse(alertsResp.content[0].text);
  alertId = body.data?.[0]?.id;
} catch {}
if (alertId) {
  await run('auvik_alerts_get', () => handleAlertsGet({ alertId }));
}

// Statistics need a fresh-ish date range
const thru = new Date();
const from = new Date(thru.getTime() - 24 * 3600 * 1000);
const iso = (d) => d.toISOString().replace(/\.\d{3}Z$/, '.000Z');

if (deviceId) {
  await run('auvik_statistics_device(cpuUtilization)', () =>
    handleStatisticsDevice({
      statId: 'cpuUtilization',
      tenants: tenantId,
      fromTime: iso(from),
      thruTime: iso(thru),
      interval: 'hour',
      deviceId,
    })
  );
}
if (interfaceId) {
  await run('auvik_statistics_interface(transmittedTotal)', () =>
    handleStatisticsInterface({
      statId: 'transmittedTotal',
      tenants: tenantId,
      fromTime: iso(from),
      thruTime: iso(thru),
      interval: 'hour',
      interfaceId,
    })
  );
}

const billFrom = new Date(thru.getTime() - 30 * 24 * 3600 * 1000).toISOString().slice(0, 10);
const billThru = thru.toISOString().slice(0, 10);
await run('auvik_billing_client_usage', () =>
  handleBillingClientUsage({ fromDate: billFrom, thruDate: billThru })
);

// navigate: re-paginate devices via links.next
try {
  const body = JSON.parse(devicesResp.content[0].text);
  const next = body?.links?.next;
  if (next) {
    await run('auvik_navigate(devices.next)', () => handleNavigate({ url: next }));
  } else {
    console.log('[SKIP] auvik_navigate — no links.next on devices page');
  }
} catch {}

console.log('\n=== summary ===');
const pass = results.filter((r) => r.ok).length;
const fail = results.filter((r) => !r.ok).length;
console.log(`${pass} passed, ${fail} failed, ${results.length} total`);
for (const r of results) {
  if (!r.ok) console.log(`  FAIL  ${r.name}: ${r.summary}`);
}
process.exit(fail ? 1 : 0);
