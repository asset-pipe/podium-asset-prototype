'use strict';

const { terser } = require('rollup-plugin-terser');
const commonjs = require('rollup-plugin-commonjs');
const replace = require('rollup-plugin-replace');
const resolve = require('rollup-plugin-node-resolve');
const rollup = require('rollup');
const rimraf = require('rimraf');
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
    // external: ['lit-element', 'wired-elements', 'vue'],
    //  external: ['lit-element'],
    plugins: [
        replace({
            ENVIRONMENT: JSON.stringify('production'),
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        resolve(),
        commonjs(),
    ]
};

const esmBundeledInputOptions = {
    input,
    onwarn: (warning, warn) => {
        // Supress logging
    },
    // external: ['lit-element', 'wired-elements', 'vue'],
    plugins: [
        replace({
            ENVIRONMENT: JSON.stringify('production'),
            'process.env.NODE_ENV': JSON.stringify('production'),
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
    // external: ['lit-element', 'wired-elements', 'vue'],
    plugins: [
        replace({
            ENVIRONMENT: JSON.stringify('production'),
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        resolve(),
        commonjs(),
        terser(),
    ]
};



const cjsInputOptions = {
    input,
    preserveModules: false,
    plugins: [
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
    name: 'PodletImage',
    globals: {
        'wired-elements': 'WiredElements',
        'lit-element': 'LitElement',
    },
};

const esmMinifiedOutputOptions = {
    format: 'esm',
    sourcemap: true,
    file: path.join(output, '/bundle.esm.min.js'),
    name: 'PodletImage',
    globals: {
        'wired-elements': 'WiredElements',
        'lit-element': 'LitElement',
    },
};


async function build() {
    const preserved = await rollup.rollup(esmPreservedInputOptions);
    await preserved.write(esmDirectoryOutputOptions);
    console.log('src package build');

    const iifeBundeled = await rollup.rollup(esmBundeledInputOptions);
    await iifeBundeled.write(iifeBundeledOutputOptions);
    console.log('iife package build');

    const iifeMinified = await rollup.rollup(esmMinifiedInputOptions);
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
