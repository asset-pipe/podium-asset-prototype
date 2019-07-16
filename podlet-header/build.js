'use strict';

const importToUrl = require('rollup-plugin-esm-import-to-url');
const { terser } = require('rollup-plugin-terser');
const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
const rollup = require('rollup');
const rimraf = require('rimraf');
const babel = require('rollup-plugin-babel');
const path = require('path');

const input = path.join(__dirname, 'assets/js/main.js');
const output = path.join(__dirname, 'public/js/');

// INPUTS

const esmPreservedInputOptions = {
    input,
    preserveModules: true,
    onwarn: (warning, warn) => {
        // Supress logging
    },
    plugins: [
        resolve(),
        commonjs(),
    ]
};

const iifeBundeledInputOptions = {
    input,
    onwarn: (warning, warn) => {
        // Supress logging
    },
    external: ['wired-elements', 'lit-element'],
    plugins: [
        resolve(),
        commonjs(),
        babel({
            exclude: 'node_modules/**', // only transpile our source code
            babelrc: false,
            presets: [['@babel/env', { modules: false }]],
        })
    ]
};

const iifeMinifiedInputOptions = {
    input,
    onwarn: (warning, warn) => {
        // Supress logging
    },
    external: ['wired-elements', 'lit-element'],
    plugins: [
        resolve(),
        commonjs(),
        babel({
            exclude: 'node_modules/**', // only transpile our source code
            babelrc: false,
            presets: [['@babel/env', { modules: false }]],
        }),
        terser(),
    ]
};

const esmBundeledInputOptions = {
    input,
    onwarn: (warning, warn) => {
        // Supress logging
    },
    plugins: [
        importToUrl({
            external: {
                'wired-elements': 'https://cdn.pika.dev/wired-elements/v1',
                'lit-element': 'https://cdn.pika.dev/lit-element/v2',
            }
        }),
        resolve(),
        commonjs(),
    ]
};

const esmMinifiedInputOptions = {
    input,
    onwarn: (warning, warn) => {
        // Supress logging
    },
    plugins: [
        importToUrl({
            external: {
                'wired-elements': 'https://cdn.pika.dev/wired-elements/v1',
                'lit-element': 'https://cdn.pika.dev/lit-element/v2',
            }
        }),
        resolve(),
        commonjs(),
        terser(),
    ]
};


// OUTPUTS

const esmDirectoryOutputOptions = {
    format: 'esm',
    dir: path.join(output, '/src/'),
};

const iifeBundeledOutputOptions = {
    format: 'iife',
    sourcemap: true,
    file: path.join(output, '/bundle.iife.js'),
    name: 'PodletImage',
    globals: {
        'wired-elements': 'WiredElements',
        'lit-element': 'LitElement',
    },
};

const iifeMinifiedOutputOptions = {
    format: 'iife',
    sourcemap: true,
    file: path.join(output, '/bundle.iife.min.js'),
    name: 'PodletImage',
    globals: {
        'wired-elements': 'WiredElements',
        'lit-element': 'LitElement',
    },
};

const esmBundeledOutputOptions = {
    format: 'esm',
    sourcemap: true,
    file: path.join(output, '/bundle.esm.js'),
};

const esmMinifiedOutputOptions = {
    format: 'esm',
    sourcemap: true,
    file: path.join(output, '/bundle.esm.min.js'),
};


async function build() {
    const preserved = await rollup.rollup(esmPreservedInputOptions);
    await preserved.write(esmDirectoryOutputOptions);
    console.log('src package build');

    const iifeBundeled = await rollup.rollup(iifeBundeledInputOptions);
    await iifeBundeled.write(iifeBundeledOutputOptions);
    console.log('iife package build');

    const iifeMinified = await rollup.rollup(iifeMinifiedInputOptions);
    await iifeMinified.write(iifeMinifiedOutputOptions);
    console.log('iife minified package build');

    const esmBundeled = await rollup.rollup(esmBundeledInputOptions);
    await esmBundeled.write(esmBundeledOutputOptions);
    console.log('esm package build');

    const esmMinified = await rollup.rollup(esmMinifiedInputOptions);
    await esmMinified.write(esmMinifiedOutputOptions);
    console.log('esm minified package build');
}

rimraf(output, () => {
    build();
});
