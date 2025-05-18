# Uplink Protocol - ESM Modules

The Uplink Protocol now exclusively uses ESM (ECMAScript Modules) as its module format. ESM is the official standard format for JavaScript modules and offers benefits like tree-shaking, better static analysis, and more efficient loading.

## Importing with ESM

```javascript
// Use ESM import syntax
import * as UplinkProtocol from '@uplink-protocol/core';

// Or import specific exports
import { useUplink, StandardBinding, EventEmitter } from '@uplink-protocol/core';
```

## HTML Script Tag with ESM

When using the library directly in HTML, use the `type="module"` attribute:

```html
<!-- Load the Uplink Protocol ESM bundle -->
<script type="module">
  import * as UplinkProtocol from './path/to/dist/index.js';
  // Use UplinkProtocol APIs
  const controller = {
    bindings: {
      count: new UplinkProtocol.StandardBinding(0)
    },
    // ...
  };
</script>
```

## Package.json Configuration

The package.json is configured for ESM:

```json
{
  "main": "dist/index.js",
  "module": "dist/index.js",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  }
}
```

## Building the Project

To build the project:

```bash
npm run build
```

This will generate the ESM version in the `dist` directory.
