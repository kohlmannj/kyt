# kyt-tsconfig

Recommended [TSConfig Bases](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html#tsconfig-bases) for kyt and non-kyt projects

## Available Configs

Each config is available in standard and "loose" versions, the latter of which disables all [strict checks](https://www.typescriptlang.org/tsconfig#Strict_Type_Checking_Options_6173). We recommend using the standard configs.

### For Web Projects

_ES2020 modules and libraries; includes browser libraries; preserves JSX syntax; excludes test files and folders_

- **[web/tsconfig.json](./web/tsconfig.json)** (Recommended)
- [web/tsconfig.loose.json](./web/tsconfig.json)

### For Node.js Projects

_Node 14 (ES2020 libraries) and CommonJS modules; excludes browser libraries; excludes test files and folders_

- **[node/tsconfig.json](./node/tsconfig.json)** (Recommended)
- [node/tsconfig.loose.json](./node/tsconfig.json)

### Shared Compiler Options

_Best for more advanced customization; ES2020 modules and libraries; excludes test files and folders_

- **[tsconfig.json](./tsconfig.json)** (Recommended)
- [tsconfig.loose.json](./tsconfig.loose.json)

## Usage

1. Install this package using npm or yarn:
   ```
   $ npm install -D kyt-tsconfig
   $ yarn add -D kyt-tsconfig
   ```
2. Create a tsconfig.json file somewhere in your project (such as in the root folder)
3. In this file, add an `extends` property with the path to the desired base config:
   ```json
   {
     "extends": "kyt-tsconfig/web/tsconfig.json"
   }
   ```
4. Add a `compilerOptions` property with project-specific [settings](https://www.typescriptlang.org/tsconfig) such as:
   - `allowJs`
   - `checkJs`
   - **`declaration`** (recommended for libraries)
   - **`declarationMap`** (recommended for libraries)
   - **`emitDeclarationOnly`** (recommended for Babel-transpiled libraries)
   - `rootDir`
   - **`baseUrl`** (recommended for absolute file path imports from within the `src` folder)
   - **`outDir`** (recommended for libraries; should match Babel's `--out-dir`)
   - **`incremental`** (recommended to improve build times)
   - `tsBuildInfoFile`
   - `types`
5. If necessary, add `include` and/or `exclude` properties to the config
   - These base configs specify both `include` and `exclude`, which may work for you!
   - Override them as needed to suit your project's folder layout and file naming conventions

## Examples

### JS + TS React Library

For a JavaScript and TypeScript-based React component library that uses [Babel](http://babeljs.io) to transpile source files:

```json
{
  "extends": "kyt-tsconfig/web/tsconfig.json",
  "compilerOptions": {
    /* Basic Options */
    "baseUrl": "src",
    "allowJs": true,
    "checkJs": true,

    /* Declaration Emit Options */
    "declaration": true,
    "declarationMap": true,
    "emitDeclarationOnly": true,

    /* Output Options */
    "rootDir": "src",
    "outDir": "lib",

    /* Incremental Build Options */
    "incremental": true,
    "tsBuildInfoFile": ".caches/tsconfig.tsbuildinfo"
  }
}
```

### TypeScript React App

For a TypeScript-based React application that is bundled using webpack or another build tool:

```json
{
  "extends": "kyt-tsconfig/web/tsconfig.json",
  "compilerOptions": {
    /* Basic Options */
    "baseUrl": "src",

    /* Declaration Emit Options */
    "noEmit": true,

    /* Incremental Build Options */
    "incremental": true,
    "tsBuildInfoFile": ".caches/tsconfig.tsbuildinfo"
  }
}
```

### Node.js App

For a Node.js application that does _not_ use browser globals, JSX or isomorphic rendering:

```json
{
  "extends": "kyt-tsconfig/node/tsconfig.json",
  "compilerOptions": {
    /* Basic Options */
    "allowJs": true,
    "checkJs": true,

    /* Declaration Emit Options */
    "noEmit": true,

    /* Incremental Build Options */
    "incremental": true,
    "tsBuildInfoFile": ".caches/tsconfig.tsbuildinfo"
  }
}
```

## See Also

- [What is a tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)
- [TSConfig Reference](https://www.typescriptlang.org/tsconfig)
- [tsconfig/bases](https://github.com/tsconfig/bases/) - Centralized Recommendations for TSConfig bases
- [TSConfig Bases](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html#tsconfig-bases)
- [Node Target Mapping - TypeScript Wiki](https://github.com/microsoft/TypeScript/wiki/Node-Target-Mapping)
