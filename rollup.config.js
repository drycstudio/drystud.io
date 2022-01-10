import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";

//NEW
import { terser } from "rollup-plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";

const packageJson = require("./package.json");

// CSS Config
import postcss from "rollup-plugin-postcss";

// SASS Config
import scss from "rollup-plugin-scss";

// TailwindCSS Config
import tailwind from "rollup-plugin-tailwind";

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

            resolve(),
            commonjs(),
            typescript({ tsconfig: "./tsconfig.json" }),

            // CSS Config
            postcss(),
            // SASS Config
            scss(), // will output compiled styles to output.css
            // TailwindCSS Config
            tailwind(),

            terser(),
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
