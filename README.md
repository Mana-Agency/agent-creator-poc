# agent-creator-poc

A minimal DeepSeek Harness plugin that prints:

> **What would you like to do today?**

It appears as a row in **Settings → General**, above the built-in preference rows.

## Install

This is a local bundle plugin. To use it, either:

**1. Install from the local directory** — in the Harness Web UI:

```
Plugins → Add plugin (arrow) → Install a third-party plugin → paste the absolute path
```

**2. Or point a profile at it** — add to `$DSH_HOME/profiles/<profile>/cordis.patch.yml`:

```yaml
- insert:
    - id: agent-creator-poc
      name: '@local/agent-creator-poc'
```

Then reload (HMR picks it up) or restart.

## Files

| File | Role |
|---|---|
| `index.js` | Host half — intentionally empty; keeps the bundle row active |
| `client.js` | Client half — registers the Settings row and prints the greeting |
| `cordis.patch.yml` | Installs the bundle into a profile |
| `package.json` | Manifest; `dsh.bundle` + `dsh.client` declarations |
| `locale/en.json`, `locale/zh.json` | Display title and description |
| `icon.svg` | Plugin icon in the manager |

## How it works

`client.js` calls `window.__ModuleLoader__.load(...)` with a factory that receives `require`. It:

1. Grabs `React` from the shared module table (never bundle your own copy).
2. Registers two locale dictionaries via `ctx.locale.register`.
3. Registers a component into the `settings.general.item` slot via `ctx.slots.register`.

The factory returns `{ inject, apply }`. `inject` names the services it needs
(`slots`, `locale`); `apply` runs once the plugin is activated.

Styling uses host theme tokens (`--dsw-alias-*`), so the row follows light/dark
and any accent-color override automatically.

## Use it as a template

This is the smallest complete DSH plugin: one slot, one component, no services,
no persistence. To build your own, copy the folder and change:

- `package.json` → `name`, `description`, `dsh.client.inject`
- `cordis.patch.yml` → the row `id` and `name`
- `client.js` → the slot name, component, and locale strings
- `locale/*.json` → title and description

## Notes

- Web UI only (`"platform": "web"`); it does not appear in the Desktop build.
- `"immediately": true` loads it with the first boot tier.
- The printed line stays in English in every UI language by design.
