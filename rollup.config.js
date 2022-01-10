import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import autoprefixer from "autoprefixer";

//NEW
import { terser } from "rollup-plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";

const packageJson = require("./package.json");

// CSS Config
import postcss from "rollup-plugin-postcss";

// SASS Config
// import scss from "rollup-plugin-scss";

// TailwindCSS Config
import tailwindcss from "rollup-plugin-tailwindcss";

// SVG Config
import svgImport from "rollup-plugin-svg-import";

export default [
    {
        input: "src/index.ts",
        output: [
            {
                file: packageJson.main,
                format: "cjs",
                sourcemap: true,
            },
            {
                file: packageJson.module,
                format: "esm",
                sourcemap: true,
            },
        ],
        plugins: [
            peerDepsExternal(),
            // CSS Config
            postcss({
                minimize: false,
                modules: true,
                sourcemap: true,
                plugins: [autoprefixer()],
                use: {
                    sass: null,
                    stylus: null,
                    less: { javascriptEnabled: true },
                },
                extract: true,
                extract: "titlebar.css",
            }),
            // SASS Config
            // scss(), // will output compiled styles to output.css
            // TailwindCSS Config
            tailwindcss({
                input: "./src/index.scss", // required
                // purge: false,
            }),
            resolve(),
            commonjs(),
            typescript({ tsconfig: "./tsconfig.json" }),
            terser(),
            // process SVG to DOM Node or String. Default: false
            svgImport({
                stringify: false,
            }),
        ],
    },
    {
        input: "dist/esm/types/index.d.ts",
        output: [{ file: "dist/index.d.ts", format: "esm" }],
        plugins: [dts()],

        // CSS Config
        external: [/\.css$/],
    },
];
