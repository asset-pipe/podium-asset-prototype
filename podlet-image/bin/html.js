'use strict';

const form = data => {
    return `
        <form class="image-grid">
            <div class="image-span-col-2">
                <wired-input placeholder="Title"></wired-input>
            </div>
            <div>
            <wired-input placeholder="File 1"></wired-input>
            </div>
            <div class="image-span-col-2 image-span-row-3">
                <wired-textarea placeholder="Description" rows="6"></wired-textarea>
            </div>
            <div>
                <wired-input placeholder="File 2"></wired-input>
            </div>
            <div>
                <wired-input placeholder="File 3"></wired-input>
            </div>
            <div>
                <wired-button>Upload</wired-button>
            </div>
        </form>
    `;
}
module.exports.form = form;

const upload = data => {
    return `
        <wired-card style="width: 1004px">
            ${form(data)}
        </wired-card>
    `;
}
module.exports.upload = upload;



const test = data => {
    return `
        <h1>meh</h1>
        <test-element>
            <h1>test</h1>
        </test-element>
    `;
}
module.exports.test = test;