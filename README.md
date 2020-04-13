# Poxels

Left-click places a poxel, right-click deletes one. Have a go here [here](https://poxels-7ca07.web.app/) and make some art.

## How to install

Installs project dependences. See `script/setup` for details.

```sh
script/setup
```

## How to run in debug mode

Builds the project. View in browser at [localhost:10001](http://localhost:10001/). Auto-reloads when the project changes.

```sh
script/start
```

## How to build in release mode

Builds the project and places it into the `dist` folder.

```sh
script/build
```

## How to run unit tests

```sh
# Runs tests in Firefox
script/test --firefox

# Runs tests in Chrome
script/test --chrome

# Runs tests in Safari
script/test --safari
```

## What does each file do?

- `Cargo.toml` contains the standard Rust metadata. You put your Rust dependencies in here.

- `package.json` contains the standard npm metadata. You put your TypeScript dependencies in here.

- `rollup.config.js` contains the Rollup configuration.

- The `src` folder contains your Rust code.

- The `web` folder contains your TypeScript code (`index.ts` is used to hook everything into Rollup).

- The `tests` folder contains your Rust unit tests.
