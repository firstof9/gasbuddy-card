function e(e,t,s,i){var a,r=arguments.length,n=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,s,i);else for(var o=e.length-1;o>=0;o--)(a=e[o])&&(n=(r<3?a(n):r>3?a(t,s,n):a(t,s))||n);return r>3&&n&&Object.defineProperty(t,s,n),n}"function"==typeof SuppressedError&&SuppressedError;const t=globalThis,s=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),a=new WeakMap;let r=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(s&&void 0===e){const s=void 0!==t&&1===t.length;s&&(e=a.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&a.set(t,e))}return e}toString(){return this.cssText}};const n=s?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const s of e.cssRules)t+=s.cssText;return(e=>new r("string"==typeof e?e:e+"",void 0,i))(t)})(e):e,{is:o,defineProperty:c,getOwnPropertyDescriptor:l,getOwnPropertyNames:d,getOwnPropertySymbols:h,getPrototypeOf:_}=Object,p=globalThis,g=p.trustedTypes,u=g?g.emptyScript:"",v=p.reactiveElementPolyfillSupport,f=(e,t)=>e,m={toAttribute(e,t){switch(t){case Boolean:e=e?u:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let s=e;switch(t){case Boolean:s=null!==e;break;case Number:s=null===e?null:Number(e);break;case Object:case Array:try{s=JSON.parse(e)}catch(e){s=null}}return s}},y=(e,t)=>!o(e,t),b={attribute:!0,type:String,converter:m,reflect:!1,useDefault:!1,hasChanged:y};Symbol.metadata??=Symbol("metadata"),p.litPropertyMetadata??=new WeakMap;let $=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=b){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(e,s,t);void 0!==i&&c(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){const{get:i,set:a}=l(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:i,set(t){const r=i?.call(this);a?.call(this,t),this.requestUpdate(e,r,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??b}static _$Ei(){if(this.hasOwnProperty(f("elementProperties")))return;const e=_(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(f("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(f("properties"))){const e=this.properties,t=[...d(e),...h(e)];for(const s of t)this.createProperty(s,e[s])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,s]of t)this.elementProperties.set(e,s)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const s=this._$Eu(e,t);void 0!==s&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const s=new Set(e.flat(1/0).reverse());for(const e of s)t.unshift(n(e))}else void 0!==e&&t.push(n(e));return t}static _$Eu(e,t){const s=t.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,i)=>{if(s)e.adoptedStyleSheets=i.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const s of i){const i=document.createElement("style"),a=t.litNonce;void 0!==a&&i.setAttribute("nonce",a),i.textContent=s.cssText,e.appendChild(i)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){const s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(void 0!==i&&!0===s.reflect){const a=(void 0!==s.converter?.toAttribute?s.converter:m).toAttribute(t,s.type);this._$Em=e,null==a?this.removeAttribute(i):this.setAttribute(i,a),this._$Em=null}}_$AK(e,t){const s=this.constructor,i=s._$Eh.get(e);if(void 0!==i&&this._$Em!==i){const e=s.getPropertyOptions(i),a="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:m;this._$Em=i;const r=a.fromAttribute(t,e.type);this[i]=r??this._$Ej?.get(i)??r,this._$Em=null}}requestUpdate(e,t,s,i=!1,a){if(void 0!==e){const r=this.constructor;if(!1===i&&(a=this[e]),s??=r.getPropertyOptions(e),!((s.hasChanged??y)(a,t)||s.useDefault&&s.reflect&&a===this._$Ej?.get(e)&&!this.hasAttribute(r._$Eu(e,s))))return;this.C(e,t,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:a},r){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,r??t??this[e]),!0!==a||void 0!==r)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),!0===i&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,s]of e){const{wrapped:e}=s,i=this[t];!0!==e||this._$AL.has(t)||void 0===i||this.C(t,void 0,s,i)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[f("elementProperties")]=new Map,$[f("finalized")]=new Map,v?.({ReactiveElement:$}),(p.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,x=e=>e,C=w.trustedTypes,A=C?C.createPolicy("lit-html",{createHTML:e=>e}):void 0,k="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,S="?"+E,M=`<${S}>`,P=document,O=()=>P.createComment(""),N=e=>null===e||"object"!=typeof e&&"function"!=typeof e,U=Array.isArray,j="[ \t\n\f\r]",L=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,T=/--!?>/g,F=/>/g,D=RegExp(`>|${j}(?:([^\\s"'>=/]+)(${j}*=${j}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),B=/'/g,R=/"/g,H=/^(?:script|style|textarea|title)$/i,z=(e=>(t,...s)=>({_$litType$:e,strings:t,values:s}))(1),I=Symbol.for("lit-noChange"),V=Symbol.for("lit-nothing"),G=new WeakMap,K=P.createTreeWalker(P,129);function W(e,t){if(!U(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(t):t}const q=(e,t)=>{const s=e.length-1,i=[];let a,r=2===t?"<svg>":3===t?"<math>":"",n=L;for(let t=0;t<s;t++){const s=e[t];let o,c,l=-1,d=0;for(;d<s.length&&(n.lastIndex=d,c=n.exec(s),null!==c);)d=n.lastIndex,n===L?"!--"===c[1]?n=T:void 0!==c[1]?n=F:void 0!==c[2]?(H.test(c[2])&&(a=RegExp("</"+c[2],"g")),n=D):void 0!==c[3]&&(n=D):n===D?">"===c[0]?(n=a??L,l=-1):void 0===c[1]?l=-2:(l=n.lastIndex-c[2].length,o=c[1],n=void 0===c[3]?D:'"'===c[3]?R:B):n===R||n===B?n=D:n===T||n===F?n=L:(n=D,a=void 0);const h=n===D&&e[t+1].startsWith("/>")?" ":"";r+=n===L?s+M:l>=0?(i.push(o),s.slice(0,l)+k+s.slice(l)+E+h):s+E+(-2===l?t:h)}return[W(e,r+(e[s]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),i]};class J{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let a=0,r=0;const n=e.length-1,o=this.parts,[c,l]=q(e,t);if(this.el=J.createElement(c,s),K.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(i=K.nextNode())&&o.length<n;){if(1===i.nodeType){if(i.hasAttributes())for(const e of i.getAttributeNames())if(e.endsWith(k)){const t=l[r++],s=i.getAttribute(e).split(E),n=/([.?@])?(.*)/.exec(t);o.push({type:1,index:a,name:n[2],strings:s,ctor:"."===n[1]?ee:"?"===n[1]?te:"@"===n[1]?se:Q}),i.removeAttribute(e)}else e.startsWith(E)&&(o.push({type:6,index:a}),i.removeAttribute(e));if(H.test(i.tagName)){const e=i.textContent.split(E),t=e.length-1;if(t>0){i.textContent=C?C.emptyScript:"";for(let s=0;s<t;s++)i.append(e[s],O()),K.nextNode(),o.push({type:2,index:++a});i.append(e[t],O())}}}else if(8===i.nodeType)if(i.data===S)o.push({type:2,index:a});else{let e=-1;for(;-1!==(e=i.data.indexOf(E,e+1));)o.push({type:7,index:a}),e+=E.length-1}a++}}static createElement(e,t){const s=P.createElement("template");return s.innerHTML=e,s}}function Z(e,t,s=e,i){if(t===I)return t;let a=void 0!==i?s._$Co?.[i]:s._$Cl;const r=N(t)?void 0:t._$litDirective$;return a?.constructor!==r&&(a?._$AO?.(!1),void 0===r?a=void 0:(a=new r(e),a._$AT(e,s,i)),void 0!==i?(s._$Co??=[])[i]=a:s._$Cl=a),void 0!==a&&(t=Z(e,a._$AS(e,t.values),a,i)),t}class Y{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:s}=this._$AD,i=(e?.creationScope??P).importNode(t,!0);K.currentNode=i;let a=K.nextNode(),r=0,n=0,o=s[0];for(;void 0!==o;){if(r===o.index){let t;2===o.type?t=new X(a,a.nextSibling,this,e):1===o.type?t=new o.ctor(a,o.name,o.strings,this,e):6===o.type&&(t=new ie(a,this,e)),this._$AV.push(t),o=s[++n]}r!==o?.index&&(a=K.nextNode(),r++)}return K.currentNode=P,i}p(e){let t=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=V,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Z(this,e,t),N(e)?e===V||null==e||""===e?(this._$AH!==V&&this._$AR(),this._$AH=V):e!==this._$AH&&e!==I&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>U(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==V&&N(this._$AH)?this._$AA.nextSibling.data=e:this.T(P.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:s}=e,i="number"==typeof s?this._$AC(e):(void 0===s.el&&(s.el=J.createElement(W(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(t);else{const e=new Y(i,this),s=e.u(this.options);e.p(t),this.T(s),this._$AH=e}}_$AC(e){let t=G.get(e.strings);return void 0===t&&G.set(e.strings,t=new J(e)),t}k(e){U(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let s,i=0;for(const a of e)i===t.length?t.push(s=new X(this.O(O()),this.O(O()),this,this.options)):s=t[i],s._$AI(a),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=x(e).nextSibling;x(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class Q{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,a){this.type=1,this._$AH=V,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=a,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=V}_$AI(e,t=this,s,i){const a=this.strings;let r=!1;if(void 0===a)e=Z(this,e,t,0),r=!N(e)||e!==this._$AH&&e!==I,r&&(this._$AH=e);else{const i=e;let n,o;for(e=a[0],n=0;n<a.length-1;n++)o=Z(this,i[s+n],t,n),o===I&&(o=this._$AH[n]),r||=!N(o)||o!==this._$AH[n],o===V?e=V:e!==V&&(e+=(o??"")+a[n+1]),this._$AH[n]=o}r&&!i&&this.j(e)}j(e){e===V?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class ee extends Q{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===V?void 0:e}}class te extends Q{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==V)}}class se extends Q{constructor(e,t,s,i,a){super(e,t,s,i,a),this.type=5}_$AI(e,t=this){if((e=Z(this,e,t,0)??V)===I)return;const s=this._$AH,i=e===V&&s!==V||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,a=e!==V&&(s===V||i);i&&this.element.removeEventListener(this.name,this,s),a&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class ie{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){Z(this,e)}}const ae=w.litHtmlPolyfillSupport;ae?.(J,X),(w.litHtmlVersions??=[]).push("3.3.3");const re=globalThis;class ne extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,s)=>{const i=s?.renderBefore??t;let a=i._$litPart$;if(void 0===a){const e=s?.renderBefore??null;i._$litPart$=a=new X(t.insertBefore(O(),e),e,void 0,s??{})}return a._$AI(e),a})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return I}}ne._$litElement$=!0,ne.finalized=!0,re.litElementHydrateSupport?.({LitElement:ne});const oe=re.litElementPolyfillSupport;oe?.({LitElement:ne}),(re.litElementVersions??=[]).push("4.2.2");const ce=e=>(t,s)=>{void 0!==s?s.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},le={attribute:!0,type:String,converter:m,reflect:!1,hasChanged:y},de=(e=le,t,s)=>{const{kind:i,metadata:a}=s;let r=globalThis.litPropertyMetadata.get(a);if(void 0===r&&globalThis.litPropertyMetadata.set(a,r=new Map),"setter"===i&&((e=Object.create(e)).wrapped=!0),r.set(s.name,e),"accessor"===i){const{name:i}=s;return{set(s){const a=t.get.call(this);t.set.call(this,s),this.requestUpdate(i,a,e,!0,s)},init(t){return void 0!==t&&this.C(i,void 0,e,t),t}}}if("setter"===i){const{name:i}=s;return function(s){const a=this[i];t.call(this,s),this.requestUpdate(i,a,e,!0,s)}}throw Error("Unsupported decorator location: "+i)};function he(e){return(t,s)=>"object"==typeof s?de(e,t,s):((e,t,s)=>{const i=t.hasOwnProperty(s);return t.constructor.createProperty(s,e),i?Object.getOwnPropertyDescriptor(t,s):void 0})(e,t,s)}function _e(e){return he({...e,state:!0,attribute:!1})}const pe=((e,...t)=>{const s=1===e.length?e[0]:t.reduce((t,s,i)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+e[i+1],e[0]);return new r(s,e,i)})`
  :host {
    display: block;
  }

  ha-card {
    padding: 16px;
    color: var(--primary-text-color);
    font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
    transition: all 0.3s ease;
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
  }

  .price-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--ha-card-box-shadow, 0 4px 8px rgba(0,0,0,0.1));
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
`;function ge(e,t){const s={};if(!e||!t)return s;let i=[];if(e.entities&&(i=Object.values(e.entities).filter(e=>e.device_id===t).map(e=>e.entity_id)),0===i.length){const s=Object.keys(e.states);for(const a of s){const s=e.states[a];s&&s.attributes&&s.attributes.station_id&&String(s.attributes.station_id)===String(t)&&i.push(a)}}const a={regular_gas:["_regular_gas"],midgrade_gas:["_midgrade_gas"],premium_gas:["_premium_gas"],diesel:["_diesel"],regular_gas_cash:["_regular_gas_cash"],midgrade_gas_cash:["_midgrade_gas_cash"],premium_gas_cash:["_premium_gas_cash"],diesel_cash:["_diesel_cash"],e85:["_e85"],e85_cash:["_e85_cash"],e15:["_unl88","_e15_gas","_e15"],e15_cash:["_unl88_cash","_e15_gas_cash","_e15_cash"],last_updated:["_last_updated"],ev_level1:["_ev_level_1_chargers","_ev_level1"],ev_level2:["_ev_level_2_chargers","_ev_level2"],ev_dc_fast:["_ev_dc_fast_chargers","_ev_dc_fast"],ev_j1772:["_ev_j1772_connectors","_ev_j1772"],ev_j1772_power:["_ev_j1772_connector_power","_ev_j1772_power"],ev_ccs:["_ev_ccs_connectors","_ev_ccs"],ev_ccs_power:["_ev_ccs_connector_power","_ev_ccs_power"],ev_chademo:["_ev_chademo_connectors","_ev_chademo"],ev_chademo_power:["_ev_chademo_connector_power","_ev_chademo_power"],ev_nacs:["_ev_nacs_connectors","_ev_nacs"],ev_nacs_power:["_ev_nacs_connector_power","_ev_nacs_power"],ev_status:["_ev_station_status","_ev_status"],ev_network:["_ev_charging_network","_ev_network"],ev_pricing:["_ev_charging_pricing","_ev_pricing"],ev_access_hours:["_ev_access_hours"],ev_cards_accepted:["_ev_payment_accepted","_ev_cards_accepted"],ev_date_last_confirmed:["_ev_last_confirmed","_ev_date_last_confirmed"]};for(const e of i){const t=e.toLowerCase();for(const[i,r]of Object.entries(a))if(r.some(e=>t.endsWith(e))){s[i]=e;break}}return s}function ue(e){if(null==e||"unknown"===e||"unavailable"===e)return"-";const t=Number(e);return isNaN(t)?String(e):new Intl.NumberFormat(void 0,{style:"currency",currency:"USD",minimumFractionDigits:2,maximumFractionDigits:3}).format(t)}function ve(e){if(null==e||"unknown"===e||"unavailable"===e)return"";const t=Number(e);return isNaN(t)?String(e):`${t.toFixed(1)} mi`}function fe(e){if(!e||"unknown"===e||"unavailable"===e)return"Unknown";try{const t=new Date(String(e));if(isNaN(t.getTime()))return String(e);const s=(new Date).getTime()-t.getTime();if(s<0)return"Just now";const i=Math.floor(s/6e4),a=Math.floor(i/60),r=Math.floor(a/24),n=Math.floor(r/7),o=Math.floor(r/30),c=Math.floor(r/365);return i<1?"Just now":i<60?`${i}m ago`:a<24?`${a}h ago`:r<7?`${r} day${r>1?"s":""} ago`:n<5?`${n} week${n>1?"s":""} ago`:o<12?`${o} month${o>1?"s":""} ago`:`${c} year${c>1?"s":""} ago`}catch{return String(e)}}const me=[{name:"device_id",label:"GasBuddy Station / Device",helper:"Select the GasBuddy station device configured in your Home Assistant.",selector:{device:{integration:"gasbuddy"}}},{name:"title",label:"Card Title (Optional)",helper:"Custom title shown at the top of the card. Falls back to the station name.",selector:{text:{}}},{name:"regular_gas_entity",label:"Regular Gas Sensor Override",selector:{entity:{domain:"sensor"}}},{name:"premium_gas_entity",label:"Premium Gas Sensor Override",selector:{entity:{domain:"sensor"}}},{name:"diesel_entity",label:"Diesel Sensor Override",selector:{entity:{domain:"sensor"}}},{name:"ev_dc_fast_entity",label:"EV DC Fast Chargers Override",selector:{entity:{domain:"sensor"}}},{name:"ev_level2_entity",label:"EV Level 2 Chargers Override",selector:{entity:{domain:"sensor"}}}];let ye=class extends ne{setConfig(e){this._config=e}render(){return this.hass&&this._config?z`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${me}
        .computeLabel=${e=>e.label||e.name}
        .computeHelper=${e=>e.helper||""}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `:z``}_valueChanged(e){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e.detail.value},bubbles:!0,composed:!0}))}};e([he({attribute:!1})],ye.prototype,"hass",void 0),e([_e()],ye.prototype,"_config",void 0),ye=e([ce("gasbuddy-card-editor")],ye);let be=class extends ne{constructor(){super(...arguments),this._activeTab="gas"}static{this.styles=pe}setConfig(e){if(!e)throw new Error("Invalid configuration");this._config=e,e.default_mode&&(this._activeTab=e.default_mode)}getCardSize(){return 4}shouldUpdate(e){if(e.has("_config")||e.has("_activeTab"))return!0;if(e.has("hass")){const t=e.get("hass");if(!t||!this.hass||!this._config)return!0;const s=this._config.device_id;if(!s)return!0;const i=ge(this.hass,s),a=[this._config.regular_gas_entity||i.regular_gas,this._config.midgrade_gas_entity||i.midgrade_gas,this._config.premium_gas_entity||i.premium_gas,this._config.diesel_entity||i.diesel,this._config.regular_gas_cash_entity||i.regular_gas_cash,this._config.midgrade_gas_cash_entity||i.midgrade_gas_cash,this._config.premium_gas_cash_entity||i.premium_gas_cash,this._config.diesel_cash_entity||i.diesel_cash,this._config.e85_entity||i.e85,this._config.e85_cash_entity||i.e85_cash,this._config.e15_entity||i.e15,this._config.e15_cash_entity||i.e15_cash,this._config.last_updated_entity||i.last_updated,this._config.ev_level1_entity||i.ev_level1,this._config.ev_level2_entity||i.ev_level2,this._config.ev_dc_fast_entity||i.ev_dc_fast,this._config.ev_j1772_entity||i.ev_j1772,this._config.ev_j1772_power_entity||i.ev_j1772_power,this._config.ev_ccs_entity||i.ev_ccs,this._config.ev_ccs_power_entity||i.ev_ccs_power,this._config.ev_chademo_entity||i.ev_chademo,this._config.ev_chademo_power_entity||i.ev_chademo_power,this._config.ev_nacs_entity||i.ev_nacs,this._config.ev_nacs_power_entity||i.ev_nacs_power,this._config.ev_status_entity||i.ev_status,this._config.ev_network_entity||i.ev_network,this._config.ev_pricing_entity||i.ev_pricing,this._config.ev_access_hours_entity||i.ev_access_hours,this._config.ev_cards_accepted_entity||i.ev_cards_accepted,this._config.ev_date_last_confirmed_entity||i.ev_date_last_confirmed].filter(Boolean);for(const e of a){if(t.states[e]!==this.hass.states[e])return!0}return!1}return!0}static getConfigElement(){return document.createElement("gasbuddy-card-editor")}static getStubConfig(e,t){const s=t.find(t=>{const s=e.states[t];return t.startsWith("sensor.")&&s&&s.attributes&&(s.attributes.attribution?.toLowerCase().includes("gasbuddy")||t.toLowerCase().includes("gasbuddy"))});let i="";return s&&e.entities&&e.entities[s]&&(i=e.entities[s].device_id||""),{type:"custom:gasbuddy-card",device_id:i,default_mode:"gas"}}render(){if(!this.hass||!this._config)return z``;const e=this._config.device_id;if(!e)return z`
        <ha-card>
          <div style="padding: 16px; color: red;">
            Please select a GasBuddy Device in the card configuration editor.
          </div>
        </ha-card>
      `;const t=ge(this.hass,e),s={regular_gas:this._config.regular_gas_entity||t.regular_gas,midgrade_gas:this._config.midgrade_gas_entity||t.midgrade_gas,premium_gas:this._config.premium_gas_entity||t.premium_gas,diesel:this._config.diesel_entity||t.diesel,regular_gas_cash:this._config.regular_gas_cash_entity||t.regular_gas_cash,midgrade_gas_cash:this._config.midgrade_gas_cash_entity||t.midgrade_gas_cash,premium_gas_cash:this._config.premium_gas_cash_entity||t.premium_gas_cash,diesel_cash:this._config.diesel_cash_entity||t.diesel_cash,e85:this._config.e85_entity||t.e85,e85_cash:this._config.e85_cash_entity||t.e85_cash,e15:this._config.e15_entity||t.e15,e15_cash:this._config.e15_cash_entity||t.e15_cash,last_updated:this._config.last_updated_entity||t.last_updated,ev_level1:this._config.ev_level1_entity||t.ev_level1,ev_level2:this._config.ev_level2_entity||t.ev_level2,ev_dc_fast:this._config.ev_dc_fast_entity||t.ev_dc_fast,ev_j1772:this._config.ev_j1772_entity||t.ev_j1772,ev_j1772_power:this._config.ev_j1772_power_entity||t.ev_j1772_power,ev_ccs:this._config.ev_ccs_entity||t.ev_ccs,ev_ccs_power:this._config.ev_ccs_power_entity||t.ev_ccs_power,ev_chademo:this._config.ev_chademo_entity||t.ev_chademo,ev_chademo_power:this._config.ev_chademo_power_entity||t.ev_chademo_power,ev_nacs:this._config.ev_nacs_entity||t.ev_nacs,ev_nacs_power:this._config.ev_nacs_power_entity||t.ev_nacs_power,ev_status:this._config.ev_status_entity||t.ev_status,ev_network:this._config.ev_network_entity||t.ev_network,ev_pricing:this._config.ev_pricing_entity||t.ev_pricing,ev_access_hours:this._config.ev_access_hours_entity||t.ev_access_hours,ev_cards_accepted:this._config.ev_cards_accepted_entity||t.ev_cards_accepted,ev_date_last_confirmed:this._config.ev_date_last_confirmed_entity||t.ev_date_last_confirmed},i=e=>{if(!e)return!1;const t=this.hass.states[e];return t&&"unavailable"!==t.state&&"unknown"!==t.state},a=[s.regular_gas,s.midgrade_gas,s.premium_gas,s.diesel,s.regular_gas_cash,s.midgrade_gas_cash,s.premium_gas_cash,s.diesel_cash,s.e15,s.e15_cash,s.e85,s.e85_cash].some(i),r=[s.ev_level1,s.ev_level2,s.ev_dc_fast,s.ev_j1772,s.ev_ccs,s.ev_chademo,s.ev_nacs,s.ev_network].some(i);if(!a&&!r)return z`
        <ha-card>
          <div style="padding: 16px; color: var(--secondary-text-color);">
            No active sensors found for this GasBuddy device. Verify that the integration has loaded data successfully.
          </div>
        </ha-card>
      `;let n=this._activeTab;a&&!r&&(n="gas"),r&&!a&&(n="ev");let o,c,l="Gas Station",d="",h="",_="",p="GasBuddy";for(const e of Object.values(s)){if(!e)continue;const t=this.hass.states[e];if(t&&t.attributes){const e=t.attributes;e.attribution&&"GasBuddy"===p&&(p=e.attribution),e.station_name&&"Gas Station"===l&&(l=String(e.station_name)),e.station_address&&!d?d=String(e.station_address):e.street_address&&!d&&(d=String(e.street_address)),void 0===e.distance_miles||h||(h=ve(e.distance_miles)),e.entity_picture&&!_&&(_=e.entity_picture),"number"==typeof e.latitude&&void 0===o&&(o=e.latitude),"number"==typeof e.longitude&&void 0===c&&(c=e.longitude)}}let g="";if(void 0!==o&&void 0!==c?g=`https://www.google.com/maps/search/?api=1&query=${o},${c}`:d&&(g=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d)}`),"Gas Station"===l){const e=Object.values(s).find(e=>e&&this.hass.states[e]);if(e){l=(this.hass.states[e]?.attributes?.friendly_name||"").replace(/\s(Regular|Midgrade|Premium|Diesel|Last Updated|EV Level|EV DC|EV CCS|EV NACS|EV CHAdeMO|EV J1772).*/i,"").trim()}}return this._config.title&&(l=this._config.title),z`
      <ha-card>
        <!-- Header -->
        <div class="header">
          <div class="header-text">
            <div class="title ellipsis" role="heading" aria-level="2">
              ${g?z`
                    <a
                      class="title-link"
                      href="${g}"
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open in Maps"
                    >
                      ${l}
                      <ha-icon class="title-link-icon" icon="mdi:open-in-new" aria-hidden="true"></ha-icon>
                    </a>
                  `:l}
            </div>
            <div class="subtitle ellipsis">
              ${d}${d&&h?` • ${h}`:h}
            </div>
          </div>
          <div class="brand-logo" aria-hidden="true">
            ${"ev"===n&&s.ev_network?function(e){if(!e)return z`<ha-icon icon="mdi:ev-station" aria-hidden="true"></ha-icon>`;const t=e.toLowerCase();return t.includes("tesla")?z`
      <svg viewBox="0 0 24 24" width="28" height="28" style="fill: #cc0000;" role="img" aria-label="Tesla Network">
        <path d="M12,2C11.5,2 10,4.8 9.8,5.7C10.7,5.5 11.5,5.4 12,5.4C12.5,5.4 13.3,5.5 14.2,5.7C14,4.8 12.5,2 12,2M12,6.8C10.5,6.8 8.8,7.3 7,8.2C6.9,8.5 6.8,8.8 6.8,9C8.3,8.2 10.3,7.8 12,7.8C13.7,7.8 15.7,8.2 17.2,9C17.2,8.8 17.1,8.5 17,8.2C15.2,7.3 13.5,6.8 12,6.8M7.2,10.2C7.1,10.5 7,10.9 7,11.2C8.7,10.5 10.5,10.2 12,10.2C13.5,10.2 15.3,10.5 17,11.2C17,10.9 16.9,10.5 16.8,10.2C15.2,9.6 13.5,9.2 12,9.2C10.5,9.2 8.8,9.6 7.2,10.2M12,11.5C10.2,11.5 8.2,12 6.5,12.8C6.5,13.2 6.5,13.5 6.5,13.8C8,12.8 10.2,12.4 12,12.4C13.8,12.4 16,12.8 17.5,13.8C17.5,13.5 17.5,13.2 17.5,12.8C15.8,12 13.8,11.5 12,11.5M12,14.5C10.8,14.5 9.5,14.7 8.2,15.1L8.2,22C8.2,22 12,21.5 12,20.5L12,15.5C12,15.5 12,14.5 12,14.5Z"/>
      </svg>
    `:t.includes("chargepoint")?z`
      <svg viewBox="0 0 24 24" width="28" height="28" style="fill: #40b83c;" role="img" aria-label="ChargePoint Network">
        <circle cx="12" cy="12" r="10" fill="none" stroke="#40b83c" stroke-width="2.5"/>
        <path d="M14.5,8.5 C13.5,7.5 12,7 10.5,7 C8,7 6,9 6,11.5 C6,14 8,16 10.5,16 C12,16 13.5,15.5 14.5,14.5" fill="none" stroke="#40b83c" stroke-width="3" stroke-linecap="round"/>
        <circle cx="15" cy="11.5" r="1.5"/>
      </svg>
    `:t.includes("evgo")?z`
      <svg viewBox="0 0 24 24" width="28" height="28" style="fill: #0055ff;" role="img" aria-label="EVgo Network">
        <path d="M2,10 L8,10 L5,22 L14,12 L9,12 L12,2 Z" />
        <text x="14" y="21" font-size="7" font-weight="900" fill="#0055ff">go</text>
      </svg>
    `:t.includes("electrify america")?z`
      <svg viewBox="0 0 24 24" width="28" height="28" style="fill: #00a261;" role="img" aria-label="Electrify America Network">
        <rect x="2" y="2" width="20" height="20" rx="4" fill="none" stroke="#00a261" stroke-width="2"/>
        <path d="M6,17 L10,7 L14,17 M7.5,13.5 L12.5,13.5" fill="none" stroke="#00a261" stroke-width="2"/>
        <path d="M15,7 L19,7 M15,12 L18,12 M15,17 L19,17" fill="none" stroke="#00a261" stroke-width="2"/>
      </svg>
    `:t.includes("blink")?z`
      <svg viewBox="0 0 24 24" width="28" height="28" style="fill: #0066cc;" role="img" aria-label="Blink Network">
        <circle cx="12" cy="12" r="10" fill="none" stroke="#0066cc" stroke-width="2"/>
        <path d="M11,4 L16,11 L13,11 L15,18 L9,11 L12,11 Z" />
      </svg>
    `:t.includes("flo")?z`
      <svg viewBox="0 0 24 24" width="28" height="28" style="fill: #1c85c8;" role="img" aria-label="FLO Network">
        <path d="M4,12 C4,7.5 7.5,4 12,4 C16.5,4 20,7.5 20,12 C20,16.5 16.5,20 12,20" fill="none" stroke="#1c85c8" stroke-width="2"/>
        <path d="M8,12 C8,9.8 9.8,8 12,8 C14.2,8 16,9.8 16,12" fill="none" stroke="#1c85c8" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `:t.includes("shell")?z`
      <svg viewBox="0 0 24 24" width="28" height="28" style="fill: #fcd116;" role="img" aria-label="Shell Recharge Network">
        <path d="M12,2 A10,10 0 0,0 2,12 A10,10 0 0,0 12,22 A10,10 0 0,0 22,12 A10,10 0 0,0 12,2 M12,4 C15.5,4 18,6.5 18,10 C18,14.5 12,20 12,20 C12,20 6,14.5 6,10 C6,6.5 8.5,4 12,4 Z" />
        <circle cx="12" cy="10" r="3" fill="#d00000"/>
      </svg>
    `:z`<ha-icon icon="mdi:ev-station" aria-hidden="true"></ha-icon>`}(this.hass.states[s.ev_network]?.state||""):_?z`<img src="${_}" alt="Brand logo" />`:z`<ha-icon icon="mdi:gas-station"></ha-icon>`}
          </div>
        </div>

        <!-- Tab Switcher -->
        ${a&&r?z`
              <div class="tabs" role="tablist">
                <button
                  class="tab ${"gas"===n?"active":""}"
                  role="tab"
                  aria-selected="${"gas"===n?"true":"false"}"
                  @click=${()=>this._activeTab="gas"}
                >
                  Gas Prices
                </button>
                <button
                  class="tab ${"ev"===n?"active":""}"
                  role="tab"
                  aria-selected="${"ev"===n?"true":"false"}"
                  @click=${()=>this._activeTab="ev"}
                >
                  EV Chargers
                </button>
              </div>
            `:""}

        <!-- Tab Content -->
        <div class="tab-content">
          ${"gas"===n?this._renderGasContent(s):this._renderEVContent(s)}
        </div>

        <!-- Footer -->
        <div class="footer">
          <div class="attribution">${p}</div>
          <div class="last-updated">
            <ha-icon icon="mdi:clock-outline" aria-hidden="true"></ha-icon>
            <span>
              Updated:
              ${s.last_updated?fe(this.hass.states[s.last_updated]?.state):"Recent"}
            </span>
          </div>
        </div>
      </ha-card>
    `}_renderGasContent(e){const t=[{key:"regular_gas",name:"Regular",cashKey:"regular_gas_cash"},{key:"midgrade_gas",name:"Midgrade",cashKey:"midgrade_gas_cash"},{key:"premium_gas",name:"Premium",cashKey:"premium_gas_cash"},{key:"diesel",name:"Diesel",cashKey:"diesel_cash"},{key:"e15",name:"UNL88",cashKey:"e15_cash"},{key:"e85",name:"E85",cashKey:"e85_cash"}].filter(t=>{const s=t.key in e&&e[t.key]?this.hass.states[e[t.key]]:void 0,i=t.cashKey in e&&e[t.cashKey]?this.hass.states[e[t.cashKey]]:void 0,a=e=>e&&"unavailable"!==e.state&&"unknown"!==e.state;return a(s)||a(i)});return z`
      <div class="gas-grid">
        ${t.map(t=>{const s=e[t.key],i=e[t.cashKey],a=s?this.hass.states[s]:void 0,r=i?this.hass.states[i]:void 0,n=a?ue(a.state):"",o=r?ue(r.state):"",c=n||o||"-",l=n&&o&&n!==o;let d="";return a&&a.attributes.unit_of_measurement?d=a.attributes.unit_of_measurement:r&&r.attributes.unit_of_measurement&&(d=r.attributes.unit_of_measurement),z`
            <div class="price-card" role="group" aria-label="${t.name} price: ${n&&o?`${n} Credit, ${o} Cash`:`${c} ${n?"Credit":"Cash"}`}">
              <div aria-hidden="true">
                <div class="fuel-type">${t.name}</div>
                ${l?z`
                      <div class="dual-prices">
                        <div class="price-col">
                          <span class="fuel-price">${n}</span>
                          <span class="price-label">Credit</span>
                        </div>
                        <div class="price-col">
                          <span class="fuel-price">${o}</span>
                          <span class="price-label">Cash</span>
                        </div>
                      </div>
                    `:z`
                      <div class="fuel-price">${c}</div>
                      <div class="price-label">${n?"Credit":"Cash"}</div>
                    `}
                <div class="fuel-meta">
                  <span>${d||"USD"}</span>
                </div>
              </div>
            </div>
          `})}
      </div>
    `}_renderEVContent(e){const t=e.ev_level1,s=e.ev_level2,i=e.ev_dc_fast,a=t&&Number(this.hass.states[t]?.state)||0,r=s&&Number(this.hass.states[s]?.state)||0,n=i&&Number(this.hass.states[i]?.state)||0,o=[{name:"J1772",countId:e.ev_j1772,powerId:e.ev_j1772_power},{name:"CCS",countId:e.ev_ccs,powerId:e.ev_ccs_power},{name:"CHAdeMO",countId:e.ev_chademo,powerId:e.ev_chademo_power},{name:"NACS",countId:e.ev_nacs,powerId:e.ev_nacs_power}].filter(e=>e.countId&&"unavailable"!==this.hass.states[e.countId]?.state&&Number(this.hass.states[e.countId]?.state)>0),c=e.ev_network?this.hass.states[e.ev_network]?.state:"",l=e.ev_network?this.hass.states[e.ev_network]:void 0,d=l&&l.attributes?l.attributes.website:void 0,h=e.ev_pricing?this.hass.states[e.ev_pricing]?.state:"",_=e.ev_access_hours?this.hass.states[e.ev_access_hours]?.state:"",p=e.ev_cards_accepted?this.hass.states[e.ev_cards_accepted]?.state:"",g=e.ev_status?this.hass.states[e.ev_status]?.state:"",u=e.ev_date_last_confirmed?this.hass.states[e.ev_date_last_confirmed]?.state:"";return z`
      <div class="ev-section">
        <!-- Charger Badge Summary -->
        <div class="charger-summary">
          ${a>0?z`
                <div class="charger-badge" role="group" aria-label="${a} Level 1 chargers">
                  <ha-icon icon="mdi:ev-station" aria-hidden="true"></ha-icon>
                  <div class="charger-info" aria-hidden="true">
                    <span class="charger-count">${a}</span>
                    <span class="charger-label">Level 1</span>
                  </div>
                </div>
              `:""}
          ${r>0?z`
                <div class="charger-badge" role="group" aria-label="${r} Level 2 chargers">
                  <ha-icon icon="mdi:ev-station" aria-hidden="true"></ha-icon>
                  <div class="charger-info" aria-hidden="true">
                    <span class="charger-count">${r}</span>
                    <span class="charger-label">Level 2</span>
                  </div>
                </div>
              `:""}
          ${n>0?z`
                <div class="charger-badge fast" role="group" aria-label="${n} DC Fast chargers">
                  <ha-icon icon="mdi:flash" aria-hidden="true"></ha-icon>
                  <div class="charger-info" aria-hidden="true">
                    <span class="charger-count">${n}</span>
                    <span class="charger-label">DC Fast</span>
                  </div>
                </div>
              `:""}
        </div>

        <!-- Connectors Grid -->
        ${o.length>0?z`
              <div>
                <div class="connector-section-title">Connectors</div>
                <div class="connectors-grid">
                  ${o.map(e=>{const t=this.hass.states[e.countId]?.state||"0",s=e.powerId?this.hass.states[e.powerId]?.state:void 0,i=s&&"unknown"!==s&&"unavailable"!==s;return z`
                      <div class="connector-card" style="border-color: rgba(var(--rgb-primary-color, 33, 150, 243), 0.2);" role="group" aria-label="${t} ${e.name} connectors${i?`, power capacity ${s} kilowatts`:""}">
                        <div class="connector-name" aria-hidden="true">${e.name}</div>
                        <div class="connector-details" aria-hidden="true">
                          <span class="connector-count">${t}x</span>
                          ${i?z`<span class="connector-power">${s} kW</span>`:""}
                        </div>
                      </div>
                    `})}
                </div>
              </div>
            `:""}

        <!-- Details List -->
        <div class="metadata-list">
          ${c&&"unknown"!==c&&"unavailable"!==c?z`
                <div class="metadata-item">
                  <span class="metadata-key">Network</span>
                  <span
                    class="metadata-val"
                    style="color: ${function(e){if(!e)return"var(--primary-color)";const t=e.toLowerCase();return t.includes("tesla")?"#cc0000":t.includes("chargepoint")?"#40b83c":t.includes("evgo")?"#0055ff":t.includes("electrify america")?"#00a261":t.includes("blink")?"#0066cc":t.includes("flo")?"#1c85c8":t.includes("shell")?"#fcd116":"var(--primary-color)"}(String(c))}; font-weight: 600;"
                  >
                    ${d?z`<a href="${d}" target="_blank" rel="noopener noreferrer">${c}</a>`:c}
                  </span>
                </div>
              `:""}
          ${g&&"unknown"!==g&&"unavailable"!==g?z`
                <div class="metadata-item">
                  <span class="metadata-key">Status</span>
                  <span class="metadata-val">${String(g).toUpperCase()}</span>
                </div>
              `:""}
          ${h&&"unknown"!==h&&"unavailable"!==h?z`
                <div class="metadata-item">
                  <span class="metadata-key">Pricing</span>
                  <span class="metadata-val">${h}</span>
                </div>
              `:""}
          ${_&&"unknown"!==_&&"unavailable"!==_?z`
                <div class="metadata-item">
                  <span class="metadata-key">Access Hours</span>
                  <span class="metadata-val">${_}</span>
                </div>
              `:""}
          ${p&&"unknown"!==p&&"unavailable"!==p?z`
                <div class="metadata-item">
                  <span class="metadata-key">Payments</span>
                  <span class="metadata-val">
                    ${(()=>{const e=function(e){if(!e)return[];const t=e.toLowerCase().split(/[\s,;]+/).map(e=>e.trim()).filter(Boolean),s=[],i=new Set;for(const e of t)"v"!==e&&!e.includes("visa")||i.has("visa")?"m"!==e&&!e.includes("mastercard")&&!e.includes("master")||i.has("mastercard")?("a"===e||e.includes("american")||e.includes("express")||e.includes("amex"))&&!i.has("amex")?(s.push(z`
        <svg viewBox="0 0 36 24" width="36" height="24" class="payment-card-icon" title="American Express" role="img" aria-label="American Express accepted">
          <rect width="36" height="24" rx="3" fill="#0070CD"/>
          <text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-weight="900" font-size="9" letter-spacing="0.5">AMEX</text>
        </svg>
      `),i.add("amex")):"d"!==e&&!e.includes("discover")||i.has("discover")?e.includes("debit")&&!i.has("debit")?(s.push(z`
        <svg viewBox="0 0 36 24" width="36" height="24" class="payment-card-icon" title="Debit Card" role="img" aria-label="Debit card accepted">
          <rect width="36" height="24" rx="3" fill="#008080"/>
          <rect x="4" y="8" width="6" height="5" rx="1" fill="#FFD700"/>
          <text x="21" y="65%" dominant-baseline="middle" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-weight="bold" font-size="7">DEBIT</text>
        </svg>
      `),i.add("debit")):e.includes("credit")&&!i.has("credit")&&(s.push(z`
        <svg viewBox="0 0 36 24" width="36" height="24" class="payment-card-icon" title="Credit Card" role="img" aria-label="Credit card accepted">
          <rect width="36" height="24" rx="3" fill="#4B5563"/>
          <rect x="4" y="8" width="6" height="5" rx="1" fill="#FFD700"/>
          <text x="21" y="65%" dominant-baseline="middle" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-weight="bold" font-size="7">CREDIT</text>
        </svg>
      `),i.add("credit")):(s.push(z`
        <svg viewBox="0 0 36 24" width="36" height="24" class="payment-card-icon" title="Discover" role="img" aria-label="Discover accepted">
          <rect width="36" height="24" rx="3" fill="#F05A28"/>
          <text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-weight="bold" font-size="7" letter-spacing="0.5">DISCOVER</text>
        </svg>
      `),i.add("discover")):(s.push(z`
        <svg viewBox="0 0 36 24" width="36" height="24" class="payment-card-icon" title="Mastercard" role="img" aria-label="Mastercard accepted">
          <rect width="36" height="24" rx="3" fill="#111111"/>
          <circle cx="14" cy="12" r="7" fill="#EB001B"/>
          <circle cx="22" cy="12" r="7" fill="#F79E1B" fill-opacity="0.8"/>
        </svg>
      `),i.add("mastercard")):(s.push(z`
        <svg viewBox="0 0 36 24" width="36" height="24" class="payment-card-icon" title="Visa" role="img" aria-label="Visa accepted">
          <rect width="36" height="24" rx="3" fill="#1A1F71"/>
          <text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-weight="bold" font-style="italic" font-size="11">VISA</text>
        </svg>
      `),i.add("visa"));return s}(String(p));return e.length>0?z`<div class="payment-icons-container">${e}</div>`:p})()}
                  </span>
                </div>
              `:""}
          ${u&&"unknown"!==u&&"unavailable"!==u?z`
                <div class="metadata-item">
                  <span class="metadata-key">Last Confirmed</span>
                  <span class="metadata-val">${fe(u)}</span>
                </div>
              `:""}
        </div>
      </div>
    `}};e([he({attribute:!1})],be.prototype,"hass",void 0),e([_e()],be.prototype,"_config",void 0),e([_e()],be.prototype,"_activeTab",void 0),be=e([ce("gasbuddy-card")],be),window.customCards=window.customCards||[],window.customCards.push({type:"gasbuddy-card",name:"GasBuddy Card",preview:!0,description:"A premium Home Assistant custom card for GasBuddy integration gas prices and EV stations."});console.info("%c  GASBUDDY-CARD  \n%c  Version VERSION  ","color: orange; font-weight: bold; background: black; padding:3px 0px;","color: white; font-weight: bold; background: dimgrey; padding:3px 0px;");export{be as GasBuddyCard};
