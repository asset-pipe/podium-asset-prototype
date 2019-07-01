'use strict';

const { terser } = require('rollup-plugin-terser');
const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
const rollup = require('rollup');
const rimraf = require('rimraf');
const path = require('path');

const input = path.join(__dirname, 'assets/js/main.js');
const output = path.join(__dirname, 'public/js/');

const esmInputOptions = {
    input,
    preserveModules: true,
    plugins: [
        resolve(),
        commonjs(),
        terser(),
    ]
};

const esmOutputOptions = {
    format: 'esm',
    dir: path.join(output, '/esm/'),
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

const cjsOutputOptions = {
    format: 'cjs',
    dir: path.join(output, '/cjs/'),
};

async function build() {

    const esm = await rollup.rollup(esmInputOptions);
    await esm.write(esmOutputOptions);
    console.log('esm:', esm.watchFiles);

/*
    const cjs = await rollup.rollup(cjsInputOptions);
    await cjs.write(cjsOutputOptions);
    console.log('cjs:', cjs.watchFiles);
*/
}

rimraf(output, () => {
    build();
});
