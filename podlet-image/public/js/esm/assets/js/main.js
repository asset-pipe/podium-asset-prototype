import{html as t}from"../../node_modules/lit-html/lit-html.js";import{css as e}from"../../node_modules/lit-element/lib/css-tag.js";import{LitElement as o}from"../../node_modules/lit-element/lit-element.js";customElements.define("test-element",class extends o{constructor(){super(),this.content="Component:"}firstUpdated(){console.log("updated")}render(){return t`
            <h1>${this.content}</h1>
            <slot></slot>

        `}static get properties(){return{content:{type:String}}}static get styles(){return e`
            :host {
                display: block;
                height: 50px;
                background-color: red;
            }
            h1 {
                color: blue;
            }
        `}});
