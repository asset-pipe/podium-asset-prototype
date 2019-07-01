'use strict';

// Workaround for lit-element not handling duplicates of itself
// https://github.com/Polymer/polymer-starter-kit/issues/1123#issuecomment-434724376

const _customElementsDefine = window.customElements.define;
window.customElements.define = (name, cl, conf) => {
    if (!customElements.get(name)) {
        _customElementsDefine.call(window.customElements, name, cl, conf);
    }
    else {
        console.warn(`${name} has been defined twice`);
    }
};
