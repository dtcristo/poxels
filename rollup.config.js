import copy from "rollup-plugin-copy";
import html from "@rollup/plugin-html";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import ts from "@wessberg/rollup-plugin-ts";
import postcss from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";
import livereload from "rollup-plugin-livereload";
import serve from "rollup-plugin-serve";

const production = !process.env.ROLLUP_WATCH;

export default [
  {
    input: "web/index.ts",
    output: {
      dir: "dist",
      format: "esm",
      sourcemap: true
    },
    plugins: [
      copy({
        targets: [{ src: ["pkg/poxel_bg.wasm"], dest: "dist" }],
        verbose: true
      }),
      html({ title: "Poxel" }),
      nodeResolve(),
      commonjs(),
      ts(),
      postcss({
        sourceMap: true,
        minimize: production
      }),
      production && terser(),
      !production && livereload("dist"),
      !production && serve("dist")
    ],
    watch: { clearScreen: false }
  }
];
