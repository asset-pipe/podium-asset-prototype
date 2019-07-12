/* eslint-env browser */

'use strict';

// import { WiredButton, WiredInput, WiredTextarea, WiredCard } from "wired-elements";
// import * as pkg from 'https://cdn.pika.dev/wired-elements/v1';
// import { WiredButton, WiredInput, WiredTextarea, WiredCard } from 'https://cdn.pika.dev/wired-elements/v1';

// import { LitElement, html, css } from 'lit-element';

// import { LitElement, html, css } from 'https://cdn.pika.dev/lit-element/v2';

import { WiredButton, WiredInput, WiredTextarea, WiredCard } from 'https://cdn.pika.dev/wired-elements/v1';
import * as lit from 'https://cdn.pika.dev/lit-element/v2';

class TestElement extends lit.LitElement {
    constructor() {
        super();
        this.content = 'Component:';
    }

    firstUpdated() {
        console.log('updated')
    }

    render(){
        return lit.html`
            <h1>${this.content}</h1>
            <slot></slot>

        `;
    }

    static get properties() {
        return {
            content: { type: String }
        };
    }

    static get styles() {
        return lit.css`
            :host {
                display: block;
                height: 50px;
                background-color: red;
            }
            h1 {
                color: blue;
            }
        `;
    }
}

customElements.define('test-element', TestElement);
