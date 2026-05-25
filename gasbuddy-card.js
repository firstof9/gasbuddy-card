function e(e,t,s,a){var i,r=arguments.length,n=r<3?t:null===a?a=Object.getOwnPropertyDescriptor(t,s):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,s,a);else for(var o=e.length-1;o>=0;o--)(i=e[o])&&(n=(r<3?i(n):r>3?i(t,s,n):i(t,s))||n);return r>3&&n&&Object.defineProperty(t,s,n),n}"function"==typeof SuppressedError&&SuppressedError;const t=globalThis,s=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,a=Symbol(),i=new WeakMap;let r=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==a)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(s&&void 0===e){const s=void 0!==t&&1===t.length;s&&(e=i.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&i.set(t,e))}return e}toString(){return this.cssText}};const n=s?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const s of e.cssRules)t+=s.cssText;return(e=>new r("string"==typeof e?e:e+"",void 0,a))(t)})(e):e,{is:o,defineProperty:c,getOwnPropertyDescriptor:l,getOwnPropertyNames:d,getOwnPropertySymbols:h,getPrototypeOf:p}=Object,_=globalThis,u=_.trustedTypes,g=u?u.emptyScript:"",v=_.reactiveElementPolyfillSupport,m=(e,t)=>e,f={toAttribute(e,t){switch(t){case Boolean:e=e?g:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let s=e;switch(t){case Boolean:s=null!==e;break;case Number:s=null===e?null:Number(e);break;case Object:case Array:try{s=JSON.parse(e)}catch(e){s=null}}return s}},b=(e,t)=>!o(e,t),y={attribute:!0,type:String,converter:f,reflect:!1,useDefault:!1,hasChanged:b};Symbol.metadata??=Symbol("metadata"),_.litPropertyMetadata??=new WeakMap;let $=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=y){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const s=Symbol(),a=this.getPropertyDescriptor(e,s,t);void 0!==a&&c(this.prototype,e,a)}}static getPropertyDescriptor(e,t,s){const{get:a,set:i}=l(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:a,set(t){const r=a?.call(this);i?.call(this,t),this.requestUpdate(e,r,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??y}static _$Ei(){if(this.hasOwnProperty(m("elementProperties")))return;const e=p(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(m("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(m("properties"))){const e=this.properties,t=[...d(e),...h(e)];for(const s of t)this.createProperty(s,e[s])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,s]of t)this.elementProperties.set(e,s)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const s=this._$Eu(e,t);void 0!==s&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const s=new Set(e.flat(1/0).reverse());for(const e of s)t.unshift(n(e))}else void 0!==e&&t.push(n(e));return t}static _$Eu(e,t){const s=t.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,a)=>{if(s)e.adoptedStyleSheets=a.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const s of a){const a=document.createElement("style"),i=t.litNonce;void 0!==i&&a.setAttribute("nonce",i),a.textContent=s.cssText,e.appendChild(a)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){const s=this.constructor.elementProperties.get(e),a=this.constructor._$Eu(e,s);if(void 0!==a&&!0===s.reflect){const i=(void 0!==s.converter?.toAttribute?s.converter:f).toAttribute(t,s.type);this._$Em=e,null==i?this.removeAttribute(a):this.setAttribute(a,i),this._$Em=null}}_$AK(e,t){const s=this.constructor,a=s._$Eh.get(e);if(void 0!==a&&this._$Em!==a){const e=s.getPropertyOptions(a),i="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:f;this._$Em=a;const r=i.fromAttribute(t,e.type);this[a]=r??this._$Ej?.get(a)??r,this._$Em=null}}requestUpdate(e,t,s,a=!1,i){if(void 0!==e){const r=this.constructor;if(!1===a&&(i=this[e]),s??=r.getPropertyOptions(e),!((s.hasChanged??b)(i,t)||s.useDefault&&s.reflect&&i===this._$Ej?.get(e)&&!this.hasAttribute(r._$Eu(e,s))))return;this.C(e,t,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:a,wrapped:i},r){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,r??t??this[e]),!0!==i||void 0!==r)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),!0===a&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,s]of e){const{wrapped:e}=s,a=this[t];!0!==e||this._$AL.has(t)||void 0===a||this.C(t,void 0,s,a)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[m("elementProperties")]=new Map,$[m("finalized")]=new Map,v?.({ReactiveElement:$}),(_.reactiveElementVersions??=[]).push("2.1.2");const x=globalThis,w=e=>e,A=x.trustedTypes,k=A?A.createPolicy("lit-html",{createHTML:e=>e}):void 0,S="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,C="?"+E,F=`<${C}>`,P=document,M=()=>P.createComment(""),T=e=>null===e||"object"!=typeof e&&"function"!=typeof e,U=Array.isArray,D="[ \t\n\f\r]",N=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,O=/--!?>/g,H=/>/g,L=RegExp(`>|${D}(?:([^\\s"'>=/]+)(${D}*=${D}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),j=/'/g,z=/"/g,R=/^(?:script|style|textarea|title)$/i,B=(e=>(t,...s)=>({_$litType$:e,strings:t,values:s}))(1),I=Symbol.for("lit-noChange"),V=Symbol.for("lit-nothing"),G=new WeakMap,K=P.createTreeWalker(P,129);function W(e,t){if(!U(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==k?k.createHTML(t):t}const q=(e,t)=>{const s=e.length-1,a=[];let i,r=2===t?"<svg>":3===t?"<math>":"",n=N;for(let t=0;t<s;t++){const s=e[t];let o,c,l=-1,d=0;for(;d<s.length&&(n.lastIndex=d,c=n.exec(s),null!==c);)d=n.lastIndex,n===N?"!--"===c[1]?n=O:void 0!==c[1]?n=H:void 0!==c[2]?(R.test(c[2])&&(i=RegExp("</"+c[2],"g")),n=L):void 0!==c[3]&&(n=L):n===L?">"===c[0]?(n=i??N,l=-1):void 0===c[1]?l=-2:(l=n.lastIndex-c[2].length,o=c[1],n=void 0===c[3]?L:'"'===c[3]?z:j):n===z||n===j?n=L:n===O||n===H?n=N:(n=L,i=void 0);const h=n===L&&e[t+1].startsWith("/>")?" ":"";r+=n===N?s+F:l>=0?(a.push(o),s.slice(0,l)+S+s.slice(l)+E+h):s+E+(-2===l?t:h)}return[W(e,r+(e[s]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),a]};class J{constructor({strings:e,_$litType$:t},s){let a;this.parts=[];let i=0,r=0;const n=e.length-1,o=this.parts,[c,l]=q(e,t);if(this.el=J.createElement(c,s),K.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(a=K.nextNode())&&o.length<n;){if(1===a.nodeType){if(a.hasAttributes())for(const e of a.getAttributeNames())if(e.endsWith(S)){const t=l[r++],s=a.getAttribute(e).split(E),n=/([.?@])?(.*)/.exec(t);o.push({type:1,index:i,name:n[2],strings:s,ctor:"."===n[1]?ee:"?"===n[1]?te:"@"===n[1]?se:Q}),a.removeAttribute(e)}else e.startsWith(E)&&(o.push({type:6,index:i}),a.removeAttribute(e));if(R.test(a.tagName)){const e=a.textContent.split(E),t=e.length-1;if(t>0){a.textContent=A?A.emptyScript:"";for(let s=0;s<t;s++)a.append(e[s],M()),K.nextNode(),o.push({type:2,index:++i});a.append(e[t],M())}}}else if(8===a.nodeType)if(a.data===C)o.push({type:2,index:i});else{let e=-1;for(;-1!==(e=a.data.indexOf(E,e+1));)o.push({type:7,index:i}),e+=E.length-1}i++}}static createElement(e,t){const s=P.createElement("template");return s.innerHTML=e,s}}function Z(e,t,s=e,a){if(t===I)return t;let i=void 0!==a?s._$Co?.[a]:s._$Cl;const r=T(t)?void 0:t._$litDirective$;return i?.constructor!==r&&(i?._$AO?.(!1),void 0===r?i=void 0:(i=new r(e),i._$AT(e,s,a)),void 0!==a?(s._$Co??=[])[a]=i:s._$Cl=i),void 0!==i&&(t=Z(e,i._$AS(e,t.values),i,a)),t}class Y{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:s}=this._$AD,a=(e?.creationScope??P).importNode(t,!0);K.currentNode=a;let i=K.nextNode(),r=0,n=0,o=s[0];for(;void 0!==o;){if(r===o.index){let t;2===o.type?t=new X(i,i.nextSibling,this,e):1===o.type?t=new o.ctor(i,o.name,o.strings,this,e):6===o.type&&(t=new ae(i,this,e)),this._$AV.push(t),o=s[++n]}r!==o?.index&&(i=K.nextNode(),r++)}return K.currentNode=P,a}p(e){let t=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,a){this.type=2,this._$AH=V,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=a,this._$Cv=a?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Z(this,e,t),T(e)?e===V||null==e||""===e?(this._$AH!==V&&this._$AR(),this._$AH=V):e!==this._$AH&&e!==I&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>U(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==V&&T(this._$AH)?this._$AA.nextSibling.data=e:this.T(P.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:s}=e,a="number"==typeof s?this._$AC(e):(void 0===s.el&&(s.el=J.createElement(W(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===a)this._$AH.p(t);else{const e=new Y(a,this),s=e.u(this.options);e.p(t),this.T(s),this._$AH=e}}_$AC(e){let t=G.get(e.strings);return void 0===t&&G.set(e.strings,t=new J(e)),t}k(e){U(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let s,a=0;for(const i of e)a===t.length?t.push(s=new X(this.O(M()),this.O(M()),this,this.options)):s=t[a],s._$AI(i),a++;a<t.length&&(this._$AR(s&&s._$AB.nextSibling,a),t.length=a)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=w(e).nextSibling;w(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class Q{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,a,i){this.type=1,this._$AH=V,this._$AN=void 0,this.element=e,this.name=t,this._$AM=a,this.options=i,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=V}_$AI(e,t=this,s,a){const i=this.strings;let r=!1;if(void 0===i)e=Z(this,e,t,0),r=!T(e)||e!==this._$AH&&e!==I,r&&(this._$AH=e);else{const a=e;let n,o;for(e=i[0],n=0;n<i.length-1;n++)o=Z(this,a[s+n],t,n),o===I&&(o=this._$AH[n]),r||=!T(o)||o!==this._$AH[n],o===V?e=V:e!==V&&(e+=(o??"")+i[n+1]),this._$AH[n]=o}r&&!a&&this.j(e)}j(e){e===V?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class ee extends Q{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===V?void 0:e}}class te extends Q{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==V)}}class se extends Q{constructor(e,t,s,a,i){super(e,t,s,a,i),this.type=5}_$AI(e,t=this){if((e=Z(this,e,t,0)??V)===I)return;const s=this._$AH,a=e===V&&s!==V||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,i=e!==V&&(s===V||a);a&&this.element.removeEventListener(this.name,this,s),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class ae{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){Z(this,e)}}const ie=x.litHtmlPolyfillSupport;ie?.(J,X),(x.litHtmlVersions??=[]).push("3.3.3");const re=globalThis;class ne extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,s)=>{const a=s?.renderBefore??t;let i=a._$litPart$;if(void 0===i){const e=s?.renderBefore??null;a._$litPart$=i=new X(t.insertBefore(M(),e),e,void 0,s??{})}return i._$AI(e),i})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return I}}ne._$litElement$=!0,ne.finalized=!0,re.litElementHydrateSupport?.({LitElement:ne});const oe=re.litElementPolyfillSupport;oe?.({LitElement:ne}),(re.litElementVersions??=[]).push("4.2.2");const ce=e=>(t,s)=>{void 0!==s?s.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},le={attribute:!0,type:String,converter:f,reflect:!1,hasChanged:b},de=(e=le,t,s)=>{const{kind:a,metadata:i}=s;let r=globalThis.litPropertyMetadata.get(i);if(void 0===r&&globalThis.litPropertyMetadata.set(i,r=new Map),"setter"===a&&((e=Object.create(e)).wrapped=!0),r.set(s.name,e),"accessor"===a){const{name:a}=s;return{set(s){const i=t.get.call(this);t.set.call(this,s),this.requestUpdate(a,i,e,!0,s)},init(t){return void 0!==t&&this.C(a,void 0,e,t),t}}}if("setter"===a){const{name:a}=s;return function(s){const i=this[a];t.call(this,s),this.requestUpdate(a,i,e,!0,s)}}throw Error("Unsupported decorator location: "+a)};function he(e){return(t,s)=>"object"==typeof s?de(e,t,s):((e,t,s)=>{const a=t.hasOwnProperty(s);return t.constructor.createProperty(s,e),a?Object.getOwnPropertyDescriptor(t,s):void 0})(e,t,s)}function pe(e){return he({...e,state:!0,attribute:!1})}const _e=((e,...t)=>{const s=1===e.length?e[0]:t.reduce((t,s,a)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+e[a+1],e[0]);return new r(s,e,a)})`
  :host {
    display: block;
  }

  ha-card {
    padding: 16px;
    color: var(--primary-text-color);
    font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
    transition: all 0.3s ease;
  }

  .card-message {
    padding: 16px;
  }

  .card-message--error {
    color: var(--error-color, red);
  }

  .card-message--info {
    color: var(--secondary-text-color);
  }

  .network-name {
    color: var(--gasbuddy-network-color, var(--primary-color));
    font-weight: 600;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
  }

  .header-text {
    flex-grow: 1;
    min-width: 0;
  }

  .title {
    font-size: 18px;
    font-weight: 500;
    line-height: 1.2;
    color: var(--primary-text-color);
  }

  .subtitle {
    font-size: 12px;
    color: var(--secondary-text-color);
    margin-top: 4px;
    line-height: 1.3;
  }

  .title-link {
    color: inherit;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .title-link:hover,
  .title-link:focus-visible {
    color: var(--primary-color);
    text-decoration: underline;
  }

  .title-link-icon {
    --mdc-icon-size: 14px;
    color: var(--secondary-text-color);
    opacity: 0;
    transition: opacity 0.15s ease;
  }

  .title-link:hover .title-link-icon,
  .title-link:focus-visible .title-link-icon {
    opacity: 1;
  }

  .brand-logo {
    height: 40px;
    width: auto;
    min-width: 40px;
    max-width: 80px;
    border-radius: 6px;
    background: white;
    box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0,0,0,0.1));
    margin-left: 12px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    padding: 0 4px;
  }

  .brand-logo img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  .brand-logo ha-icon {
    --mdc-icon-size: 28px;
    color: var(--primary-color);
  }

  /* When the brand slot holds an EV network logo (SVG or pill), drop the
     white "card" framing — the brand color carries the visual itself. */
  .brand-logo.brand-network {
    background: transparent;
    box-shadow: none;
    border-radius: 0;
    padding: 0;
    min-width: 0;
    max-width: none;
    overflow: visible;
  }

  .network-svg {
    width: 32px;
    height: 32px;
    display: block;
  }

  .network-pill {
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #fff;
    white-space: nowrap;
    line-height: 1;
  }

  /* When the brand slot is just a generic icon (no station-brand image),
     drop the white card framing — it clashes in dark themes. */
  .brand-logo--icon {
    background: transparent;
    box-shadow: none;
    border-radius: 0;
    min-width: 0;
    padding: 0;
  }

  /* Mode Switcher Tabs */
  .tabs {
    display: flex;
    border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    margin-bottom: 16px;
    gap: 8px;
  }

  .tab {
    padding: 8px 16px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    color: var(--secondary-text-color);
    border-bottom: 2px solid transparent;
    transition: all 0.2s ease;
    background: none;
    border-top: none;
    border-left: none;
    border-right: none;
  }

  .tab:hover {
    color: var(--primary-text-color);
  }

  .tab.active {
    color: var(--primary-color);
    border-bottom-color: var(--primary-color);
  }

  /* Gas Price Grid Layout */
  .gas-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    gap: 12px;
  }

  .price-card {
    background: var(--ha-card-background, var(--card-background-color, rgba(255, 255, 255, 0.05)));
    border: var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, var(--divider-color, rgba(0, 0, 0, 0.12)));
    border-radius: var(--ha-card-border-radius, 12px);
    padding: 12px;
    text-align: center;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
  }

  .price-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--ha-card-box-shadow, 0 4px 8px rgba(0,0,0,0.1));
  }

  .price-card-content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-grow: 1;
    height: 100%;
  }

  .trend-svg {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
  }

  .fuel-type {
    font-size: 12px;
    font-weight: 600;
    color: var(--secondary-text-color);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
  }

  .fuel-price {
    font-size: 24px;
    font-weight: 700;
    color: var(--primary-text-color);
    margin: 6px 0;
  }

  .dual-prices {
    display: flex;
    justify-content: space-around;
    align-items: center;
    gap: 8px;
    margin: 6px 0;
  }

  .price-col {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .price-col .fuel-price {
    font-size: 18px;
    margin: 0;
  }

  .price-label {
    font-size: 9px;
    color: var(--secondary-text-color);
    text-transform: uppercase;
    font-weight: 500;
    margin-top: 2px;
  }

  .fuel-meta {
    font-size: 10px;
    color: var(--secondary-text-color);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4px;
  }

  /* EV Section Layout */
  .ev-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .charger-summary {
    display: flex;
    gap: 12px;
  }

  .charger-badge {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 12px;
    background: var(--card-background-color, var(--ha-card-background, #fff));
    border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    border-radius: 12px;
    padding: 12px;
  }

  .charger-badge ha-icon {
    --mdc-icon-size: 32px;
    color: var(--primary-color);
  }

  .charger-badge.fast ha-icon {
    color: #ff9800;
  }

  .charger-info {
    display: flex;
    flex-direction: column;
  }

  .charger-count {
    font-size: 20px;
    font-weight: 700;
  }

  .charger-label {
    font-size: 11px;
    color: var(--secondary-text-color);
  }

  /* Connector Grid */
  .connector-section-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--secondary-text-color);
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .connectors-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 8px;
  }

  .connector-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(var(--rgb-primary-color, 33, 150, 243), 0.05);
    border: 1px solid rgba(var(--rgb-primary-color, 33, 150, 243), 0.15);
    border-radius: 8px;
    padding: 8px 12px;
  }

  .connector-name {
    font-size: 12px;
    font-weight: 600;
  }

  .connector-details {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .connector-count {
    font-size: 14px;
    font-weight: 700;
    color: var(--primary-color);
  }

  .connector-power {
    font-size: 10px;
    color: var(--secondary-text-color);
  }

  /* EV Metadata List */
  .metadata-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    padding-top: 12px;
  }

  .metadata-item {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    line-height: 1.4;
  }

  .metadata-key {
    color: var(--secondary-text-color);
    font-weight: 500;
  }

  .metadata-val {
    color: var(--primary-text-color);
    text-align: right;
    max-width: 60%;
    word-break: break-word;
  }

  .metadata-val a {
    color: inherit;
    text-decoration: none;
  }

  .metadata-val a:hover {
    text-decoration: underline;
  }

  /* Footer Section */
  .footer {
    margin-top: 16px;
    padding-top: 8px;
    border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 10px;
    color: var(--secondary-text-color);
  }

  .attribution {
    font-style: italic;
  }

  .last-updated {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  /* Payment Card Badges */
  .payment-icons-container {
    display: flex;
    gap: 4px;
    justify-content: flex-end;
    align-items: center;
    flex-wrap: wrap;
  }

  .payment-card-icon {
    width: 45px;
    height: 30px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
    border-radius: 3px;
    display: inline-block;
    vertical-align: middle;
  }

  /* Mobile Responsive overrides */
  @media (max-width: 360px) {
    .charger-summary {
      flex-direction: column;
    }
    .gas-grid {
      grid-template-columns: 1fr;
    }
  }
`,ue=[["regular_gas",["_regular_gas"]],["midgrade_gas",["_midgrade_gas"]],["premium_gas",["_premium_gas"]],["diesel",["_diesel"]],["regular_gas_cash",["_regular_gas_cash"]],["midgrade_gas_cash",["_midgrade_gas_cash"]],["premium_gas_cash",["_premium_gas_cash"]],["diesel_cash",["_diesel_cash"]],["e85",["_e85"]],["e85_cash",["_e85_cash"]],["e15",["_unl88","_e15_gas","_e15"]],["e15_cash",["_unl88_cash","_e15_gas_cash","_e15_cash"]],["last_updated",["_last_updated"]],["ev_level1",["_ev_level_1_chargers","_ev_level1"]],["ev_level2",["_ev_level_2_chargers","_ev_level2"]],["ev_dc_fast",["_ev_dc_fast_chargers","_ev_dc_fast"]],["ev_j1772",["_ev_j1772_connectors","_ev_j1772"]],["ev_j1772_power",["_ev_j1772_connector_power","_ev_j1772_power"]],["ev_ccs",["_ev_ccs_connectors","_ev_ccs"]],["ev_ccs_power",["_ev_ccs_connector_power","_ev_ccs_power"]],["ev_chademo",["_ev_chademo_connectors","_ev_chademo"]],["ev_chademo_power",["_ev_chademo_connector_power","_ev_chademo_power"]],["ev_nacs",["_ev_nacs_connectors","_ev_nacs"]],["ev_nacs_power",["_ev_nacs_connector_power","_ev_nacs_power"]],["ev_status",["_ev_station_status","_ev_status"]],["ev_network",["_ev_charging_network","_ev_network"]],["ev_pricing",["_ev_charging_pricing","_ev_pricing"]],["ev_access_hours",["_ev_access_hours"]],["ev_cards_accepted",["_ev_payment_accepted","_ev_cards_accepted"]],["ev_date_last_confirmed",["_ev_last_confirmed","_ev_date_last_confirmed"]]];function ge(e){const t={};for(const s of e){const e=s.toLowerCase();for(const[a,i]of ue)if(i.some(t=>e.endsWith(t))){t[a]=s;break}}return t}const ve=[{match:"tesla",brand:{name:"Tesla",color:"#cc0000",svgPath:"M12 5.362l2.475-3.026s4.245.09 8.471 2.054c-1.082 1.636-3.231 2.438-3.231 2.438-.146-1.439-1.154-1.79-4.354-1.79L12 24 8.619 5.034c-3.18 0-4.188.354-4.335 1.792 0 0-2.146-.795-3.229-2.43C5.28 2.431 9.525 2.34 9.525 2.34L12 5.362l-.004.002H12v-.002zm0-3.899c3.415-.03 7.326.528 11.328 2.28.535-.968.672-1.395.672-1.395C19.625.612 15.528.015 12 0 8.472.015 4.375.61 0 2.349c0 0 .195.525.672 1.396C4.674 1.989 8.585 1.435 12 1.46v.003z"}},{match:"shell",brand:{name:"Shell",color:"#fbce07",svgPath:"M12 .863C5.34.863 0 6.251 0 12.98c0 .996.038 1.374.246 2.33l3.662 2.71.57 4.515h6.102l.326.227c.377.262.705.375 1.082.375.352 0 .732-.101 1.024-.313l.39-.289h6.094l.563-4.515 3.695-2.71c.208-.956.246-1.334.246-2.33C24 6.252 18.661.863 12 .863zm.996 2.258c.9 0 1.778.224 2.512.649l-2.465 12.548 3.42-12.062c1.059.36 1.863.941 2.508 1.814l.025.034-4.902 10.615 5.572-9.713.033.03c.758.708 1.247 1.567 1.492 2.648l-6.195 7.666 6.436-6.5.01.021c.253.563.417 1.36.417 1.996 0 .509-.024.712-.164 1.25l-3.554 2.602-.467 3.71h-4.475l-.517.395c-.199.158-.482.266-.682.266-.199 0-.483-.108-.682-.266l-.517-.394H6.322l-.445-3.61-3.627-2.666c-.11-.436-.16-.83-.16-1.261 0-.72.159-1.49.426-2.053l.013-.024 6.45 6.551L2.75 9.621c.25-1.063.874-2.09 1.64-2.713l5.542 9.776L4.979 6.1c.555-.814 1.45-1.455 2.546-1.827l3.424 12.069L8.355 3.816l.055-.03c.814-.45 1.598-.657 2.457-.657.195 0 .286.004.528.03l.587 13.05.46-13.059c.224-.025.309-.029.554-.029z"}},{match:"electrify america",brand:{name:"Electrify America",color:"#00a261"}},{match:"chargepoint",brand:{name:"ChargePoint",color:"#40b83c"}},{match:"evgo",brand:{name:"EVgo",color:"#0055ff"}},{match:"blink",brand:{name:"Blink",color:"#0066cc"}},{match:"flo",brand:{name:"FLO",color:"#1c85c8"}}];function me(e){if(!e)return null;const t=String(e).toLowerCase(),s=ve.find(e=>t.includes(e.match));return s?s.brand:null}const fe=new WeakMap;function be(e,t){if(!e||!t)return{};if(e.entities){let s=fe.get(e.entities);s||(s=new Map,fe.set(e.entities,s));const a=s.get(t);if(a)return a;const i=Object.values(e.entities).filter(e=>e.device_id===t).map(e=>e.entity_id);if(i.length>0){const e=ge(i);return s.set(t,e),e}}const s=[];for(const a of Object.keys(e.states)){const i=e.states[a];i?.attributes?.station_id&&String(i.attributes.station_id)===String(t)&&s.push(a)}return ge(s)}const ye=new Set(["USD","CAD","EUR","GBP","AUD","MXN","JPY"]);function $e(e,t){if(null==e||"unknown"===e||"unavailable"===e)return"-";const s=Number(e);if(isNaN(s))return String(e);const a=function(e){if(!e)return null;const t=e.trim().slice(0,3).toUpperCase();return ye.has(t)?t:null}(t)??"USD";return new Intl.NumberFormat(void 0,{style:"currency",currency:a,minimumFractionDigits:2,maximumFractionDigits:3}).format(s)}function xe(e,t){if(null==e||"unknown"===e||"unavailable"===e)return"";const s=Number(e);if(isNaN(s))return String(e);const a=t?.config?.unit_system?.length;if("km"===a){return`${(1.609344*s).toFixed(1)} km`}return`${s.toFixed(1)} mi`}function we(e){if(!e||"unknown"===e||"unavailable"===e)return"Unknown";try{const t=new Date(String(e));if(isNaN(t.getTime()))return String(e);const s=(new Date).getTime()-t.getTime();if(s<0)return"Just now";const a=Math.floor(s/6e4),i=Math.floor(a/60),r=Math.floor(i/24),n=Math.floor(r/7),o=Math.floor(r/30),c=Math.floor(r/365);return a<1?"Just now":a<60?`${a}m ago`:i<24?`${i}h ago`:r<7?`${r} day${r>1?"s":""} ago`:n<5?`${n} week${n>1?"s":""} ago`:o<12?`${o} month${o>1?"s":""} ago`:`${c} year${c>1?"s":""} ago`}catch{return String(e)}}const Ae={tab_gas:"Gas Prices",tab_ev:"EV Chargers",default_station_name:"Gas Station",missing_device:"Please select a GasBuddy Device in the card configuration editor.",no_active_sensors:"No active sensors found for this GasBuddy device. Verify that the integration has loaded data successfully.",brand_logo_alt:"Brand logo",grade_regular:"Regular",grade_midgrade:"Midgrade",grade_premium:"Premium",grade_diesel:"Diesel",grade_unl88:"UNL88",grade_e85:"E85",price_credit:"Credit",price_cash:"Cash",charger_level1:"Level 1",charger_level2:"Level 2",charger_dc_fast:"DC Fast",connectors_heading:"Connectors",meta_network:"Network",meta_status:"Status",meta_pricing:"Pricing",meta_access_hours:"Access Hours",meta_payments:"Payments",meta_last_confirmed:"Last Confirmed",updated_prefix:"Updated:",updated_recent:"Recent"},ke={en:Ae};function Se(e,t){const s=`component.gasbuddy.card.${t}`,a=e?.localize?.(s);if(a&&a!==s)return a;const i=ke[e?.locale?.language||e?.language||"en"];return i?.[t]?i[t]:Ae[t]}const Ee=[{name:"device_id",label:"GasBuddy Station / Device",helper:"Select the GasBuddy station device configured in your Home Assistant.",selector:{device:{integration:"gasbuddy"}}},{name:"title",label:"Card Title (Optional)",helper:"Custom title shown at the top of the card. Falls back to the station name.",selector:{text:{}}},{name:"show_trend",label:"Show Background Trend Graph",selector:{boolean:{}}},{name:"trend_hours",label:"Trend Hours",helper:"Hours of price history to display. Default is 168 (7 days).",selector:{number:{min:1,max:720,mode:"box"}}},{name:"regular_gas_entity",label:"Regular Gas Sensor Override",selector:{entity:{domain:"sensor"}}},{name:"premium_gas_entity",label:"Premium Gas Sensor Override",selector:{entity:{domain:"sensor"}}},{name:"diesel_entity",label:"Diesel Sensor Override",selector:{entity:{domain:"sensor"}}},{name:"ev_dc_fast_entity",label:"EV DC Fast Chargers Override",selector:{entity:{domain:"sensor"}}},{name:"ev_level2_entity",label:"EV Level 2 Chargers Override",selector:{entity:{domain:"sensor"}}}];let Ce=class extends ne{setConfig(e){this._config=e}render(){return this.hass&&this._config?B`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${Ee}
        .computeLabel=${e=>e.label||e.name}
        .computeHelper=${e=>e.helper||""}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `:B``}_valueChanged(e){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e.detail.value},bubbles:!0,composed:!0}))}};e([he({attribute:!1})],Ce.prototype,"hass",void 0),e([pe()],Ce.prototype,"_config",void 0),Ce=e([ce("gasbuddy-card-editor")],Ce);const Fe=["regular_gas","midgrade_gas","premium_gas","diesel","regular_gas_cash","midgrade_gas_cash","premium_gas_cash","diesel_cash","e85","e85_cash","e15","e15_cash","last_updated","ev_level1","ev_level2","ev_dc_fast","ev_j1772","ev_j1772_power","ev_ccs","ev_ccs_power","ev_chademo","ev_chademo_power","ev_nacs","ev_nacs_power","ev_status","ev_network","ev_pricing","ev_access_hours","ev_cards_accepted","ev_date_last_confirmed"],Pe=["regular_gas","midgrade_gas","premium_gas","diesel","regular_gas_cash","midgrade_gas_cash","premium_gas_cash","diesel_cash","e15","e15_cash","e85","e85_cash"],Me=Pe,Te=["ev_level1","ev_level2","ev_dc_fast","ev_j1772","ev_ccs","ev_chademo","ev_nacs","ev_network"];let Ue=class extends ne{constructor(){super(...arguments),this._activeTab="gas",this._historyData={},this._historyFetchInFlight=!1,this._moveFocusToActiveTab=!1,this._onTabKeydown=e=>{"ArrowLeft"!==e.key&&"ArrowRight"!==e.key&&"Home"!==e.key&&"End"!==e.key||(e.preventDefault(),this._activeTab="gas"===this._activeTab?"ev":"gas",this._moveFocusToActiveTab=!0)}}static{this.styles=_e}setConfig(e){if(!e)throw new Error("Invalid configuration");this._config=e,e.default_mode&&(this._activeTab=e.default_mode)}getCardSize(){if(!this.hass||!this._config?.device_id)return 4;const e=be(this.hass,this._config.device_id),t=this._config,s=s=>t[`${s}_entity`]??e[s],a=e=>{if(!e)return!1;const t=this.hass.states[e];return!!t&&"unavailable"!==t.state&&"unknown"!==t.state},i=["regular_gas","midgrade_gas","premium_gas","diesel","e15","e85"].filter(e=>a(s(e))||a(s(`${e}_cash`))).length,r=["ev_level1","ev_level2","ev_dc_fast","ev_j1772","ev_ccs","ev_chademo","ev_nacs","ev_network"].some(e=>a(s(e))),n=i>0;let o=2;return n&&r&&(o+=1),n&&(o+=Math.max(1,Math.ceil(i/2))),r&&(o+=3),Math.max(2,o)}updated(e){if(super.updated(e),this._moveFocusToActiveTab){this._moveFocusToActiveTab=!1;const e=this.renderRoot.querySelector(".tab.active");e?.focus()}if(!this._config?.show_trend)return;(e.has("_config")||e.has("hass")&&(!this._lastHistoryFetch||Date.now()-this._lastHistoryFetch>6e5))&&this._fetchHistory()}async _fetchHistory(){if(!this.hass||!this._config||!this._config.show_trend)return;const e=this._config.device_id;if(!e)return;if(this._historyFetchInFlight)return;this._historyForDevice&&this._historyForDevice!==e&&(this._historyData={});const t=this._resolveEntities(e),s=Me.map(e=>t[e]).filter(e=>!!e&&!!this.hass.states[e]);if(0===s.length)return;const a=this._config.trend_hours||168,i=new Date,r=new Date(i.getTime()-60*a*60*1e3);this._historyFetchInFlight=!0;try{const t=await(this.hass.connection?.sendMessagePromise({type:"history/history_during_period",start_time:r.toISOString(),end_time:i.toISOString(),entity_ids:s,include_start_time_state:!0,significant_changes_only:!1,no_attributes:!0}));t&&(this._historyData=t,this._historyForDevice=e,this._lastHistoryFetch=Date.now())}catch(e){console.error("Error fetching GasBuddy card history:",e)}finally{this._historyFetchInFlight=!1}}shouldUpdate(e){if(e.has("_config")||e.has("_activeTab")||e.has("_historyData"))return!0;if(e.has("hass")){const t=e.get("hass");if(!t||!this.hass||!this._config?.device_id)return!0;const s=this._resolveEntities(this._config.device_id);for(const e of Fe){const a=s[e];if(a&&t.states[a]!==this.hass.states[a])return!0}return!1}return!0}static getConfigElement(){return document.createElement("gasbuddy-card-editor")}static getStubConfig(e,t){const s=t.find(t=>{const s=e.states[t];return t.startsWith("sensor.")&&s?.attributes&&(s.attributes.attribution?.toLowerCase().includes("gasbuddy")||t.toLowerCase().includes("gasbuddy"))});let a="";return s&&e.entities?.[s]&&(a=e.entities[s].device_id||""),{type:"custom:gasbuddy-card",device_id:a,default_mode:"gas"}}_resolveEntities(e){const t=be(this.hass,e),s=this._config,a={};for(const e of Fe){const i=s[`${e}_entity`];a[e]=i||t[e]}return a}_isAvailable(e){if(!e)return!1;const t=this.hass.states[e];return!!t&&"unavailable"!==t.state&&"unknown"!==t.state}_collectStationMetadata(e){const t=Se(this.hass,"default_station_name");let s,a,i=t,r="",n="",o="",c="GasBuddy";for(const l of Object.values(e)){if(!l)continue;const e=this.hass.states[l];if(!e)continue;const d=e.attributes;d&&(d.attribution&&"GasBuddy"===c&&(c=String(d.attribution)),d.station_name&&i===t&&(i=String(d.station_name)),r||(d.station_address?r=String(d.station_address):d.street_address&&(r=String(d.street_address))),n||void 0===d.distance_miles||(n=xe(d.distance_miles,this.hass)),!o&&d.entity_picture&&(o=d.entity_picture),"number"==typeof d.latitude&&void 0===s&&(s=d.latitude),"number"==typeof d.longitude&&void 0===a&&(a=d.longitude))}if(i===t){const t=Object.values(e).find(e=>e&&this.hass.states[e]);if(t){i=(this.hass.states[t]?.attributes?.friendly_name||"").replace(/\s(Regular|Midgrade|Premium|Diesel|Last Updated|EV Level|EV DC|EV CCS|EV NACS|EV CHAdeMO|EV J1772).*/i,"").trim()}}this._config.title&&(i=this._config.title);let l="";return void 0!==s&&void 0!==a?l=`https://www.google.com/maps/search/?api=1&query=${s},${a}`:r&&(l=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r)}`),{name:i,address:r,distance:n,brandLogoUrl:o,attribution:c,mapsUrl:l}}render(){if(!this.hass||!this._config)return B``;const e=this._config.device_id;if(!e)return B`
        <ha-card>
          <div class="card-message card-message--error">
            ${Se(this.hass,"missing_device")}
          </div>
        </ha-card>
      `;const t=this._resolveEntities(e),s=Pe.some(e=>this._isAvailable(t[e])),a=Te.some(e=>this._isAvailable(t[e]));if(!s&&!a)return B`
        <ha-card>
          <div class="card-message card-message--info">
            ${Se(this.hass,"no_active_sensors")}
          </div>
        </ha-card>
      `;let i=this._activeTab;s&&!a&&(i="gas"),a&&!s&&(i="ev");const r=this._collectStationMetadata(t);return B`
      <ha-card>
        ${this._renderHeader(r,i,t.ev_network)}
        ${s&&a?this._renderTabs(i):""}
        ${s&&a?B`
              <div
                id="gasbuddy-panel-gas"
                class="tab-content"
                role="tabpanel"
                aria-labelledby="gasbuddy-tab-gas"
                tabindex="0"
                ?hidden=${"gas"!==i}
              >
                ${this._renderGasContent(t)}
              </div>
              <div
                id="gasbuddy-panel-ev"
                class="tab-content"
                role="tabpanel"
                aria-labelledby="gasbuddy-tab-ev"
                tabindex="0"
                ?hidden=${"ev"!==i}
              >
                ${this._renderEVContent(t)}
              </div>
            `:B`
              <div class="tab-content">
                ${"gas"===i?this._renderGasContent(t):this._renderEVContent(t)}
              </div>
            `}
        ${this._renderFooter(r.attribution,t.last_updated)}
      </ha-card>
    `}_renderHeader(e,t,s){return B`
      <div class="header">
        <div class="header-text">
          <div class="title ellipsis" role="heading" aria-level="2">
            ${e.mapsUrl?B`
                  <a
                    class="title-link"
                    href="${e.mapsUrl}"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open in Maps"
                  >
                    ${e.name}
                    <ha-icon class="title-link-icon" icon="mdi:open-in-new" aria-hidden="true"></ha-icon>
                  </a>
                `:e.name}
          </div>
          <div class="subtitle ellipsis">
            ${e.address}${e.address&&e.distance?` • ${e.distance}`:e.distance}
          </div>
        </div>
        <div
          class="brand-logo ${"ev"===t&&s?"brand-network":e.brandLogoUrl?"":"brand-logo--icon"}"
          aria-hidden="true"
        >
          ${"ev"===t&&s?function(e){const t=me(e);return t?t.svgPath?B`
      <svg
        class="network-svg"
        viewBox="0 0 24 24"
        role="img"
        aria-label="${t.name}"
        style="fill: ${t.color}"
      >
        <title>${t.name}</title>
        <path d="${t.svgPath}" />
      </svg>
    `:B`
    <span class="network-pill" style="background: ${t.color}" role="img" aria-label="${t.name}">
      ${t.name}
    </span>
  `:B`<ha-icon icon="mdi:ev-station" aria-hidden="true"></ha-icon>`}(this.hass.states[s]?.state||""):e.brandLogoUrl?B`<img src="${e.brandLogoUrl}" alt="${Se(this.hass,"brand_logo_alt")}" />`:B`<ha-icon icon="mdi:gas-station"></ha-icon>`}
        </div>
      </div>
    `}_renderTabs(e){return B`
      <div class="tabs" role="tablist" aria-label="Service type">
        <button
          id="gasbuddy-tab-gas"
          class="tab ${"gas"===e?"active":""}"
          role="tab"
          aria-selected="${"gas"===e?"true":"false"}"
          aria-controls="gasbuddy-panel-gas"
          tabindex="${"gas"===e?"0":"-1"}"
          @click=${()=>this._activeTab="gas"}
          @keydown=${this._onTabKeydown}
        >
          ${Se(this.hass,"tab_gas")}
        </button>
        <button
          id="gasbuddy-tab-ev"
          class="tab ${"ev"===e?"active":""}"
          role="tab"
          aria-selected="${"ev"===e?"true":"false"}"
          aria-controls="gasbuddy-panel-ev"
          tabindex="${"ev"===e?"0":"-1"}"
          @click=${()=>this._activeTab="ev"}
          @keydown=${this._onTabKeydown}
        >
          ${Se(this.hass,"tab_ev")}
        </button>
      </div>
    `}_renderFooter(e,t){return B`
      <div class="footer">
        <div class="attribution">${e}</div>
        ${t?B`
              <div class="last-updated">
                <ha-icon icon="mdi:clock-outline" aria-hidden="true"></ha-icon>
                <span>${Se(this.hass,"updated_prefix")} ${we(this.hass.states[t]?.state)}</span>
              </div>
            `:""}
      </div>
    `}_renderTrendGraph(e){if(!this._config?.show_trend||!e)return B``;const t=this._historyData[e];if(!t||0===t.length)return B``;const{stroke:s,fill:a}=function(e,t=40,s=10){if(!e||0===e.length)return{stroke:"",fill:""};const a=e.map(e=>{const t=void 0!==e.s?e.s:e.state,s=void 0!==e.t?e.t:void 0!==e.lu?e.lu:void 0!==e.lc?e.lc:void 0!==e.last_updated?e.last_updated:e.last_changed,a=Number(t);let i=NaN;if("number"==typeof s)i=s;else if("string"==typeof s){const e=Number(s);i=isNaN(e)?Date.parse(s)/1e3:e}return{val:a,time:i}}).filter(e=>!isNaN(e.val)&&!isNaN(e.time));if(0===a.length)return{stroke:"",fill:""};if(1===a.length){const e=(t+s)/2;return{stroke:`M 0,${e} L 100,${e}`,fill:`M 0,${e} L 100,${e} L 100,50 L 0,50 Z`}}const i=a.map(e=>e.time),r=Math.min(...i),n=Math.max(...i),o=a.map(e=>e.val),c=Math.min(...o),l=Math.max(...o),d=n-r||1,h=l-c||1,p=a.map(e=>({x:(e.time-r)/d*100,y:c===l?(t+s)/2:t-(e.val-c)/h*(t-s)})),_=p.map((e,t)=>`${0===t?"M":"L"} ${e.x.toFixed(1)},${e.y.toFixed(1)}`),u=_.join(" "),g=p[0].x.toFixed(1);return{stroke:u,fill:`${u} L ${p[p.length-1].x.toFixed(1)},50 L ${g},50 Z`}}(t);if(!s)return B``;const i=`grad-${e.replace(/\./g,"-")}`;return B`
      <svg
        class="trend-svg"
        viewBox="0 0 100 50"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id="${i}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="var(--accent-color)" stop-opacity="0.2" />
            <stop offset="100%" stop-color="var(--accent-color)" stop-opacity="0" />
          </linearGradient>
        </defs>
        <path d="${a}" fill="url(#${i})" />
        <path d="${s}" fill="none" stroke="var(--accent-color)" stroke-width="1" />
      </svg>
    `}_renderGasContent(e){const t=[{key:"regular_gas",name:Se(this.hass,"grade_regular"),cashKey:"regular_gas_cash"},{key:"midgrade_gas",name:Se(this.hass,"grade_midgrade"),cashKey:"midgrade_gas_cash"},{key:"premium_gas",name:Se(this.hass,"grade_premium"),cashKey:"premium_gas_cash"},{key:"diesel",name:Se(this.hass,"grade_diesel"),cashKey:"diesel_cash"},{key:"e15",name:Se(this.hass,"grade_unl88"),cashKey:"e15_cash"},{key:"e85",name:Se(this.hass,"grade_e85"),cashKey:"e85_cash"}].filter(t=>{const s=e[t.key]?this.hass.states[e[t.key]]:void 0,a=e[t.cashKey]?this.hass.states[e[t.cashKey]]:void 0,i=e=>e&&"unavailable"!==e.state&&"unknown"!==e.state;return i(s)||i(a)});return B`
      <div class="gas-grid">
        ${t.map(t=>{const s=e[t.key],a=e[t.cashKey],i=s?this.hass.states[s]:void 0,r=a?this.hass.states[a]:void 0,n=i?.attributes?.unit_of_measurement,o=r?.attributes?.unit_of_measurement,c=i?$e(i.state,n):"",l=r?$e(r.state,o):"",d=c||l||"-",h=c&&l&&c!==l,p=i?.attributes?.unit_of_measurement??r?.attributes?.unit_of_measurement??"";return B`
            <div
              class="price-card"
              role="group"
              aria-label="${t.name} price: ${c&&l?`${c} ${Se(this.hass,"price_credit")}, ${l} ${Se(this.hass,"price_cash")}`:`${d} ${Se(this.hass,c?"price_credit":"price_cash")}`}"
            >
              ${this._renderTrendGraph(s||a)}
              <div class="price-card-content" aria-hidden="true">
                <div class="fuel-type">${t.name}</div>
                ${h?B`
                      <div class="dual-prices">
                        <div class="price-col">
                          <span class="fuel-price">${c}</span>
                          <span class="price-label">${Se(this.hass,"price_credit")}</span>
                        </div>
                        <div class="price-col">
                          <span class="fuel-price">${l}</span>
                          <span class="price-label">${Se(this.hass,"price_cash")}</span>
                        </div>
                      </div>
                    `:B`
                      <div class="fuel-price">${d}</div>
                      <div class="price-label">${Se(this.hass,c?"price_credit":"price_cash")}</div>
                    `}
                <div class="fuel-meta">
                  <span>${p||"USD"}</span>
                </div>
              </div>
            </div>
          `})}
      </div>
    `}_renderEVContent(e){const t=e.ev_level1,s=e.ev_level2,a=e.ev_dc_fast,i=t&&Number(this.hass.states[t]?.state)||0,r=s&&Number(this.hass.states[s]?.state)||0,n=a&&Number(this.hass.states[a]?.state)||0,o=[{name:"J1772",countId:e.ev_j1772,powerId:e.ev_j1772_power},{name:"CCS",countId:e.ev_ccs,powerId:e.ev_ccs_power},{name:"CHAdeMO",countId:e.ev_chademo,powerId:e.ev_chademo_power},{name:"NACS",countId:e.ev_nacs,powerId:e.ev_nacs_power}].filter(e=>e.countId&&"unavailable"!==this.hass.states[e.countId]?.state&&Number(this.hass.states[e.countId]?.state)>0),c=e.ev_network?this.hass.states[e.ev_network]?.state:"",l=e.ev_network?this.hass.states[e.ev_network]:void 0,d=l?.attributes?l.attributes.website:void 0,h=e.ev_pricing?this.hass.states[e.ev_pricing]?.state:"",p=e.ev_access_hours?this.hass.states[e.ev_access_hours]?.state:"",_=e.ev_cards_accepted?this.hass.states[e.ev_cards_accepted]?.state:"",u=e.ev_status?this.hass.states[e.ev_status]?.state:"",g=e.ev_date_last_confirmed?this.hass.states[e.ev_date_last_confirmed]?.state:"";return B`
      <div class="ev-section">
        <!-- Charger Badge Summary -->
        <div class="charger-summary">
          ${i>0?B`
                <div class="charger-badge" role="group" aria-label="${i} ${Se(this.hass,"charger_level1")} chargers">
                  <ha-icon icon="mdi:ev-station" aria-hidden="true"></ha-icon>
                  <div class="charger-info" aria-hidden="true">
                    <span class="charger-count">${i}</span>
                    <span class="charger-label">${Se(this.hass,"charger_level1")}</span>
                  </div>
                </div>
              `:""}
          ${r>0?B`
                <div class="charger-badge" role="group" aria-label="${r} ${Se(this.hass,"charger_level2")} chargers">
                  <ha-icon icon="mdi:ev-station" aria-hidden="true"></ha-icon>
                  <div class="charger-info" aria-hidden="true">
                    <span class="charger-count">${r}</span>
                    <span class="charger-label">${Se(this.hass,"charger_level2")}</span>
                  </div>
                </div>
              `:""}
          ${n>0?B`
                <div class="charger-badge fast" role="group" aria-label="${n} ${Se(this.hass,"charger_dc_fast")} chargers">
                  <ha-icon icon="mdi:flash" aria-hidden="true"></ha-icon>
                  <div class="charger-info" aria-hidden="true">
                    <span class="charger-count">${n}</span>
                    <span class="charger-label">${Se(this.hass,"charger_dc_fast")}</span>
                  </div>
                </div>
              `:""}
        </div>

        <!-- Connectors Grid -->
        ${o.length>0?B`
              <div>
                <div class="connector-section-title">${Se(this.hass,"connectors_heading")}</div>
                <div class="connectors-grid">
                  ${o.map(e=>{const t=this.hass.states[e.countId]?.state||"0",s=e.powerId?this.hass.states[e.powerId]?.state:void 0,a=s&&"unknown"!==s&&"unavailable"!==s;return B`
                      <div
                        class="connector-card"
                        role="group"
                        aria-label="${t} ${e.name} connectors${a?`, power capacity ${s} kilowatts`:""}"
                      >
                        <div class="connector-name" aria-hidden="true">${e.name}</div>
                        <div class="connector-details" aria-hidden="true">
                          <span class="connector-count">${t}x</span>
                          ${a?B`<span class="connector-power">${s} kW</span>`:""}
                        </div>
                      </div>
                    `})}
                </div>
              </div>
            `:""}

        <!-- Details List -->
        <div class="metadata-list">
          ${c&&"unknown"!==c&&"unavailable"!==c?B`
                <div class="metadata-item">
                  <span class="metadata-key">${Se(this.hass,"meta_network")}</span>
                  <span
                    class="metadata-val network-name"
                    style="--gasbuddy-network-color: ${v=String(c),me(v)?.color??"var(--primary-color)"}"
                  >
                    ${d?B`<a href="${d}" target="_blank" rel="noopener noreferrer">${c}</a>`:c}
                  </span>
                </div>
              `:""}
          ${u&&"unknown"!==u&&"unavailable"!==u?B`
                <div class="metadata-item">
                  <span class="metadata-key">${Se(this.hass,"meta_status")}</span>
                  <span class="metadata-val">${String(u).toUpperCase()}</span>
                </div>
              `:""}
          ${h&&"unknown"!==h&&"unavailable"!==h?B`
                <div class="metadata-item">
                  <span class="metadata-key">${Se(this.hass,"meta_pricing")}</span>
                  <span class="metadata-val">${h}</span>
                </div>
              `:""}
          ${p&&"unknown"!==p&&"unavailable"!==p?B`
                <div class="metadata-item">
                  <span class="metadata-key">${Se(this.hass,"meta_access_hours")}</span>
                  <span class="metadata-val">${p}</span>
                </div>
              `:""}
          ${_&&"unknown"!==_&&"unavailable"!==_?B`
                <div class="metadata-item">
                  <span class="metadata-key">${Se(this.hass,"meta_payments")}</span>
                  <span class="metadata-val">
                    ${(()=>{const e=function(e){if(!e)return[];const t=e.toLowerCase().split(/[\s,;]+/).map(e=>e.trim()).filter(Boolean),s=[],a=new Set;for(const e of t)"v"!==e&&!e.includes("visa")||a.has("visa")?"m"!==e&&!e.includes("mastercard")&&!e.includes("master")||a.has("mastercard")?("a"===e||e.includes("american")||e.includes("express")||e.includes("amex"))&&!a.has("amex")?(s.push(B`
        <svg viewBox="0 0 36 24" width="36" height="24" class="payment-card-icon" title="American Express" role="img" aria-label="American Express accepted">
          <rect width="36" height="24" rx="3" fill="#006FCF"/>
          <text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-weight="900" font-size="9" letter-spacing="0.5">AMEX</text>
        </svg>
      `),a.add("amex")):"d"!==e&&!e.includes("discover")||a.has("discover")?e.includes("debit")&&!a.has("debit")?(s.push(B`
        <svg viewBox="0 0 36 24" width="36" height="24" class="payment-card-icon" title="Debit Card" role="img" aria-label="Debit card accepted">
          <rect width="36" height="24" rx="3" fill="#008080"/>
          <rect x="4" y="8" width="6" height="5" rx="1" fill="#FFD700"/>
          <text x="21" y="65%" dominant-baseline="middle" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-weight="bold" font-size="7">DEBIT</text>
        </svg>
      `),a.add("debit")):e.includes("credit")&&!a.has("credit")&&(s.push(B`
        <svg viewBox="0 0 36 24" width="36" height="24" class="payment-card-icon" title="Credit Card" role="img" aria-label="Credit card accepted">
          <rect width="36" height="24" rx="3" fill="#4B5563"/>
          <rect x="4" y="8" width="6" height="5" rx="1" fill="#FFD700"/>
          <text x="21" y="65%" dominant-baseline="middle" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-weight="bold" font-size="7">CREDIT</text>
        </svg>
      `),a.add("credit")):(s.push(B`
        <svg viewBox="0 0 36 24" width="36" height="24" class="payment-card-icon" title="Discover" role="img" aria-label="Discover accepted">
          <rect width="36" height="24" rx="3" fill="#F05A28"/>
          <text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-weight="bold" font-size="7" letter-spacing="0.5">DISCOVER</text>
        </svg>
      `),a.add("discover")):(s.push(B`
        <svg viewBox="0 0 36 24" width="36" height="24" class="payment-card-icon" title="Mastercard" role="img" aria-label="Mastercard accepted">
          <rect width="36" height="24" rx="3" fill="#111111"/>
          <circle cx="14" cy="12" r="7" fill="#EB001B"/>
          <circle cx="22" cy="12" r="7" fill="#F79E1B" fill-opacity="0.8"/>
        </svg>
      `),a.add("mastercard")):(s.push(B`
        <svg viewBox="0 0 36 24" width="36" height="24" class="payment-card-icon" title="Visa" role="img" aria-label="Visa accepted">
          <rect width="36" height="24" rx="3" fill="#1A1F71"/>
          <text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-weight="bold" font-style="italic" font-size="11">VISA</text>
        </svg>
      `),a.add("visa"));return s}(String(_));return e.length>0?B`<div class="payment-icons-container">${e}</div>`:_})()}
                  </span>
                </div>
              `:""}
          ${g&&"unknown"!==g&&"unavailable"!==g?B`
                <div class="metadata-item">
                  <span class="metadata-key">${Se(this.hass,"meta_last_confirmed")}</span>
                  <span class="metadata-val">${we(g)}</span>
                </div>
              `:""}
        </div>
      </div>
    `;var v}};e([he({attribute:!1})],Ue.prototype,"hass",void 0),e([pe()],Ue.prototype,"_config",void 0),e([pe()],Ue.prototype,"_activeTab",void 0),e([pe()],Ue.prototype,"_historyData",void 0),Ue=e([ce("gasbuddy-card")],Ue),window.customCards=window.customCards||[],window.customCards.push({type:"gasbuddy-card",name:"GasBuddy Card",preview:!0,description:"A premium Home Assistant custom card for GasBuddy integration gas prices and EV stations."});console.info("%c  GASBUDDY-CARD  \n%c  Version VERSION  ","color: orange; font-weight: bold; background: black; padding:3px 0px;","color: white; font-weight: bold; background: dimgrey; padding:3px 0px;");export{Ue as GasBuddyCard};
