/* eslint-env browser */

'use strict';

import { WiredButton, WiredInput, WiredTextarea, WiredCard } from "wired-elements";
/*
import { LitElement, html, css } from 'lit-element';

class TestElement extends LitElement {
    constructor() {
        super();
        this.content = 'Component:';
    }

    firstUpdated() {
        console.log('updated')
    }

    render(){
        return html`
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
        return css`
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
*/