# Graph Report - .  (2026-05-27)

## Corpus Check
- 3 files · ~10,447 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 387 nodes · 652 edges · 32 communities (29 shown, 3 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 22 edges (avg confidence: 0.79)
- Token cost: 29,224 input · 9,741 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Tool Handler & Error Plumbing|Tool Handler & Error Plumbing]]
- [[_COMMUNITY_MCPB Distribution Manifest|MCPB Distribution Manifest]]
- [[_COMMUNITY_Package Dependencies & Scripts|Package Dependencies & Scripts]]
- [[_COMMUNITY_Live Smoke Test Harness|Live Smoke Test Harness]]
- [[_COMMUNITY_MCPB Packaging Script|MCPB Packaging Script]]
- [[_COMMUNITY_Architectural Patterns|Architectural Patterns]]
- [[_COMMUNITY_JSON Schema Vocabulary|JSON Schema Vocabulary]]
- [[_COMMUNITY_Auvik HTTP Client Core|Auvik HTTP Client Core]]
- [[_COMMUNITY_Project Concepts & Auth|Project Concepts & Auth]]
- [[_COMMUNITY_TypeScript Compiler Setup|TypeScript Compiler Setup]]
- [[_COMMUNITY_Tool Categories Index|Tool Categories Index]]
- [[_COMMUNITY_Environment Variables|Environment Variables]]
- [[_COMMUNITY_Tool Annotation Engine|Tool Annotation Engine]]
- [[_COMMUNITY_Zod Validation Schemas|Zod Validation Schemas]]
- [[_COMMUNITY_Networks Tool|Networks Tool]]
- [[_COMMUNITY_Contributing & Conventions|Contributing & Conventions]]
- [[_COMMUNITY_Semantic-Release Devdeps|Semantic-Release Devdeps]]
- [[_COMMUNITY_Configurations Tool|Configurations Tool]]
- [[_COMMUNITY_Interfaces Tool|Interfaces Tool]]
- [[_COMMUNITY_Server Transports & Entry|Server Transports & Entry]]
- [[_COMMUNITY_Tenants Tool|Tenants Tool]]
- [[_COMMUNITY_Changelog Format|Changelog Format]]
- [[_COMMUNITY_Error Handling Concepts|Error Handling Concepts]]
- [[_COMMUNITY_Annotation Concepts|Annotation Concepts]]
- [[_COMMUNITY_Schema Modules|Schema Modules]]
- [[_COMMUNITY_Security Policy|Security Policy]]

## God Nodes (most connected - your core abstractions)
1. `createAuvikClient()` - 37 edges
2. `toMcpError()` - 24 edges
3. `README` - 15 edges
4. `compilerOptions` - 11 edges
5. `Release 0.1.0` - 11 edges
6. `Auvik MCP Server` - 11 edges
7. `scripts` - 10 edges
8. `CONTRIBUTING` - 9 edges
9. `fail()` - 7 edges
10. `handleDevicesList()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `CONTRIBUTING` --cites--> `Code of Conduct`  [EXTRACTED]
  CONTRIBUTING.md → CODE_OF_CONDUCT.md
- `Empty-result Handling` --conceptually_related_to--> `Error Handling`  [INFERRED]
  CHANGELOG.md → README.md
- `Release 0.1.0` --references--> `Health Check Endpoint`  [EXTRACTED]
  CHANGELOG.md → README.md
- `Release 0.1.0` --references--> `HTTP Transport`  [EXTRACTED]
  CHANGELOG.md → README.md
- `Release 0.1.0` --references--> `Stdio Transport`  [EXTRACTED]
  CHANGELOG.md → README.md

## Hyperedges (group relationships)
- **MCPB packaging contract** — scripts_pack_mcpb, manifest_json, package_json, src_index [EXTRACTED 1.00]
- **JSON:API request pipeline (params translation, query encoding, retries)** — auvik_http_client, concept_jsonapi, concept_region_redirect, concept_rate_limit_backoff [EXTRACTED 0.95]
- **Multi-tenant credential flow** — src_http_transport, concept_async_local_storage, create_auvik_client_fn, auvik_http_client [EXTRACTED 1.00]
- **MCP server tool registry and dispatch** — src_server, tools_status, tools_navigate, tools_devices [EXTRACTED 1.00]
- **Uniform Auvik tool handler pattern (creds -> client -> API -> JSON response)** — tools_devices, tools_networks, tools_interfaces, tools_alerts, tools_statistics, tools_billing, tools_components, tools_configurations, tools_entities, tools_tenants [INFERRED 0.85]
- **Tenant-scoped JSON:API list endpoints** — tools_devices, tools_networks, tools_interfaces, tools_alerts, concept_tenant_scoping [INFERRED 0.85]

## Communities (32 total, 3 thin omitted)

### Community 0 - "Tool Handler & Error Plumbing"
Cohesion: 0.08
Nodes (52): createAuvikClient(), MaybeAuvikError, toMcpError(), Handler, HANDLERS, TOOLS, original, payload (+44 more)

### Community 1 - "MCPB Distribution Manifest"
Cohesion: 0.06
Nodes (29): AuvikHttpClient, author, name, url, compatibility, claude_desktop, platforms, runtimes (+21 more)

### Community 2 - "Package Dependencies & Scripts"
Cohesion: 0.06
Nodes (32): bugs, url, dependencies, dotenv, fastify, @modelcontextprotocol/sdk, node-auvik, zod (+24 more)

### Community 3 - "Live Smoke Test Harness"
Cohesion: 0.08
Nodes (29): alertIds, altIds, configurationId, data, dataIds(), deviceId, failed, firstId() (+21 more)

### Community 4 - "MCPB Packaging Script"
Cohesion: 0.10
Nodes (18): assert(), bundleName, bundlePath, destPath, __dirname, dpkg, __filename, m (+10 more)

### Community 5 - "Architectural Patterns"
Cohesion: 0.17
Nodes (3): JSON:API cursor pagination via links.next, Multi-tenant scoping (tenants param required), Auvik tool handler shape: creds -> client -> API -> JSON text

### Community 6 - "JSON Schema Vocabulary"
Cohesion: 0.11
Nodes (18): description, required, sensitive, title, type, default, description, required (+10 more)

### Community 7 - "Auvik HTTP Client Core"
Cohesion: 0.16
Nodes (9): AuvikApiError, AuvikClient, AuvikHttpClient, buildQuery(), JsonApiResource, JsonApiResponse, makeError(), RealAuvikClient (+1 more)

### Community 8 - "Project Concepts & Auth"
Cohesion: 0.17
Nodes (15): Apache License 2.0, Auvik API Regions, AsyncLocalStorage Credential Injection, Auvik API, Auvik MCP Server, Environment Variable Credentials, Header-based Credentials, GitHub Actions CI/CD (+7 more)

### Community 9 - "TypeScript Compiler Setup"
Cohesion: 0.14
Nodes (13): compilerOptions, declaration, esModuleInterop, module, moduleResolution, outDir, rootDir, skipLibCheck (+5 more)

### Community 10 - "Tool Categories Index"
Cohesion: 0.17
Nodes (12): README, Alert Tools, Billing Tools, Configuration Tools, Device Tools, Entity Tools, Interface Tools, auvik_navigate (+4 more)

### Community 11 - "Environment Variables"
Cohesion: 0.18
Nodes (11): AUVIK_API_KEY, AUVIK_REGION, AUVIK_USERNAME, MCP_TRANSPORT, args, command, env, server (+3 more)

### Community 12 - "Tool Annotation Engine"
Cohesion: 0.24
Nodes (9): annotate(), ANNOTATION_PRESETS, annotationsFor(), classifyTool(), CREATE_PATTERNS, DESTRUCTIVE_PATTERNS, matchesAny(), READ_PATTERNS (+1 more)

### Community 13 - "Zod Validation Schemas"
Cohesion: 0.24
Nodes (8): DateRangeSchema, PaginationSchema, TenantFilterSchema, DeviceDetailsSchema, DeviceGetSchema, DeviceLifecycleSchema, DevicesListSchema, DeviceWarrantySchema

### Community 14 - "Networks Tool"
Cohesion: 0.40
Nodes (9): fail(), handleNetworksGet(), handleNetworksList(), handleNetworksListDetail(), networksGetTool, networksListDetailTool, networksListTool, noCreds() (+1 more)

### Community 15 - "Contributing & Conventions"
Cohesion: 0.22
Nodes (9): typescript, Code of Conduct, CONTRIBUTING, Conventional Commits, Node.js 20+, npm 10+, src/ Project Structure, TypeScript (+1 more)

### Community 16 - "Semantic-Release Devdeps"
Cohesion: 0.22
Nodes (9): devDependencies, semantic-release, @semantic-release/changelog, @semantic-release/git, @semantic-release/github, tsup, @types/node, vitest (+1 more)

### Community 17 - "Configurations Tool"
Cohesion: 0.46
Nodes (7): configurationsGetTool, configurationsListTool, fail(), handleConfigurationsGet(), handleConfigurationsList(), noCreds(), ok()

### Community 18 - "Interfaces Tool"
Cohesion: 0.46
Nodes (7): fail(), handleInterfacesGet(), handleInterfacesList(), interfacesGetTool, interfacesListTool, noCreds(), ok()

### Community 19 - "Server Transports & Entry"
Cohesion: 0.46
Nodes (5): port, startHttpTransport(), main(), createServer(), startStdioTransport()

### Community 20 - "Tenants Tool"
Cohesion: 0.46
Nodes (7): fail(), handleTenantsDetail(), handleTenantsList(), noCredsResult(), ok(), tenantsDetailTool, tenantsListTool

### Community 21 - "Changelog Format"
Cohesion: 0.67
Nodes (3): CHANGELOG, Keep a Changelog, Semantic Versioning

### Community 22 - "Error Handling Concepts"
Cohesion: 0.67
Nodes (3): Empty-result Handling, Error Handling, toMcpError Function

## Knowledge Gaps
- **173 isolated node(s):** `name`, `version`, `description`, `type`, `main` (+168 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Semantic-Release Devdeps` to `Package Dependencies & Scripts`, `Contributing & Conventions`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Why does `index.ts (entry)` connect `MCPB Distribution Manifest` to `Package Dependencies & Scripts`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `typescript` connect `Contributing & Conventions` to `Semantic-Release Devdeps`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **What connects `name`, `version`, `description` to the rest of the system?**
  _174 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Tool Handler & Error Plumbing` be split into smaller, more focused modules?**
  _Cohesion score 0.08461131676361713 - nodes in this community are weakly interconnected._
- **Should `MCPB Distribution Manifest` be split into smaller, more focused modules?**
  _Cohesion score 0.062388591800356503 - nodes in this community are weakly interconnected._
- **Should `Package Dependencies & Scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.058823529411764705 - nodes in this community are weakly interconnected._