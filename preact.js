function t(){throw new Error("Cycle detected")}function e(){if(o>1)return void o--;let t,e=!1;for(;void 0!==n;){let i=n;for(n=void 0,r++;void 0!==i;){const s=i.o;if(i.o=void 0,i.f&=-3,!(8&i.f)&&a(i))try{i.c()}catch(i){e||(t=i,e=!0)}i=s}}if(r=0,o--,e)throw t}function i(t){if(o>0)return t();o++;try{return t()}finally{e()}}let s,n,o=0,r=0,c=0;function h(t){if(void 0===s)return;let e=t.n;return void 0===e||e.t!==s?(e={i:0,S:t,p:s.s,n:void 0,t:s,e:void 0,x:void 0,r:e},void 0!==s.s&&(s.s.n=e),s.s=e,t.n=e,32&s.f&&t.S(e),e):-1===e.i?(e.i=0,void 0!==e.n&&(e.n.p=e.p,void 0!==e.p&&(e.p.n=e.n),e.p=s.s,e.n=void 0,s.s.n=e,s.s=e),e):void 0}function f(t){this.v=t,this.i=0,this.n=void 0,this.t=void 0}function u(t){return new f(t)}function a(t){for(let e=t.s;void 0!==e;e=e.n)if(e.S.i!==e.i||!e.S.h()||e.S.i!==e.i)return!0;return!1}function l(t){for(let e=t.s;void 0!==e;e=e.n){const i=e.S.n;if(void 0!==i&&(e.r=i),e.S.n=e,e.i=-1,void 0===e.n){t.s=e;break}}}function d(t){let e,i=t.s;for(;void 0!==i;){const t=i.p;-1===i.i?(i.S.U(i),void 0!==t&&(t.n=i.n),void 0!==i.n&&(i.n.p=t)):e=i,i.S.n=i.r,void 0!==i.r&&(i.r=void 0),i=t}t.s=e}function p(t){f.call(this,void 0),this.x=t,this.s=void 0,this.g=c-1,this.f=4}function v(t){return new p(t)}function y(t){const i=t.u;if(t.u=void 0,"function"==typeof i){o++;const n=s;s=void 0;try{i()}catch(e){throw t.f&=-2,t.f|=8,g(t),e}finally{s=n,e()}}}function g(t){for(let e=t.s;void 0!==e;e=e.n)e.S.U(e);t.x=void 0,t.s=void 0,y(t)}function S(t){if(s!==this)throw new Error("Out-of-order effect");d(this),s=t,this.f&=-2,8&this.f&&g(this),e()}function b(t){this.x=t,this.u=void 0,this.s=void 0,this.o=void 0,this.f=32}function w(t){const e=new b(t);try{e.c()}catch(t){throw e.d(),t}return e.d.bind(e)}f.prototype.h=function(){return!0},f.prototype.S=function(t){this.t!==t&&void 0===t.e&&(t.x=this.t,void 0!==this.t&&(this.t.e=t),this.t=t)},f.prototype.U=function(t){if(void 0!==this.t){const e=t.e,i=t.x;void 0!==e&&(e.x=i,t.e=void 0),void 0!==i&&(i.e=e,t.x=void 0),t===this.t&&(this.t=i)}},f.prototype.subscribe=function(t){const e=this;return w((function(){const i=e.value,s=32&this.f;this.f&=-33;try{t(i)}finally{this.f|=s}}))},f.prototype.valueOf=function(){return this.value},f.prototype.toString=function(){return this.value+""},f.prototype.peek=function(){return this.v},Object.defineProperty(f.prototype,"value",{get(){const t=h(this);return void 0!==t&&(t.i=this.i),this.v},set(i){if(i!==this.v){r>100&&t(),this.v=i,this.i++,c++,o++;try{for(let t=this.t;void 0!==t;t=t.x)t.t.N()}finally{e()}}}}),(p.prototype=new f).h=function(){if(this.f&=-3,1&this.f)return!1;if(32==(36&this.f))return!0;if(this.f&=-5,this.g===c)return!0;if(this.g=c,this.f|=1,this.i>0&&!a(this))return this.f&=-2,!0;const t=s;try{l(this),s=this;const t=this.x();(16&this.f||this.v!==t||0===this.i)&&(this.v=t,this.f&=-17,this.i++)}catch(t){this.v=t,this.f|=16,this.i++}return s=t,d(this),this.f&=-2,!0},p.prototype.S=function(t){if(void 0===this.t){this.f|=36;for(let t=this.s;void 0!==t;t=t.n)t.S.S(t)}f.prototype.S.call(this,t)},p.prototype.U=function(t){if(void 0!==this.t&&(f.prototype.U.call(this,t),void 0===this.t)){this.f&=-33;for(let t=this.s;void 0!==t;t=t.n)t.S.U(t)}},p.prototype.N=function(){if(!(2&this.f)){this.f|=6;for(let t=this.t;void 0!==t;t=t.x)t.t.N()}},p.prototype.peek=function(){if(this.h()||t(),16&this.f)throw this.v;return this.v},Object.defineProperty(p.prototype,"value",{get(){1&this.f&&t();const e=h(this);if(this.h(),void 0!==e&&(e.i=this.i),16&this.f)throw this.v;return this.v}}),b.prototype.c=function(){const t=this.S();try{8&this.f||void 0===this.x||(this.u=this.x())}finally{t()}},b.prototype.S=function(){1&this.f&&t(),this.f|=1,this.f&=-9,y(this),l(this),o++;const e=s;return s=this,S.bind(this,e)},b.prototype.N=function(){2&this.f||(this.f|=2,this.o=n,n=this)},b.prototype.d=function(){this.f|=8,1&this.f||g(this)};var N=(0,Object.freeze)([]),m=()=>{};const x=(t,e,i)=>{const{parentNode:s}=i,n=e.length;let o=t.length,r=n,c=0,h=0,f=null;for(;c<o||h<r;)if(o===c){const t=r<n?h?e[h-1].nextSibling:e[r-h]:i;for(;h<r;)s.insertBefore(e[h++],t)}else if(r===h)for(;c<o;)f&&f.has(t[c])||t[c].remove(),c++;else if(t[c]===e[h])c++,h++;else if(t[o-1]===e[r-1])o--,r--;else if(t[c]===e[r-1]&&e[h]===t[o-1]){const i=t[--o].nextSibling;s.insertBefore(e[h++],t[c++].nextSibling),s.insertBefore(e[--r],i),t[o]=e[r]}else{if(!f){f=new Map;let t=h;for(;t<r;)f.set(e[t],t++)}if(f.has(t[c])){const i=f.get(t[c]);if(h<i&&i<r){let n=c,u=1;for(;++n<o&&n<r&&f.get(t[n])===i+u;)u++;if(u>i-h){const n=t[c];for(;h<i;)s.insertBefore(e[h++],n)}else s.replaceChild(e[h++],t[c++])}else c++}else t[c++].remove()}return e},{isArray:T}=Array,{entries:E,getPrototypeOf:O,prototype:{isPrototypeOf:k}}=Object,{COMPONENT:C,ELEMENT:A,FRAGMENT:M,INTERPOLATION:P,STATIC:I}=class{static ATTRIBUTE=1;static COMPONENT=2;static ELEMENT=3;static FRAGMENT=4;static INTERPOLATION=5;static STATIC=6;get properties(){const{attributes:t}=this;if(t.length){const e={};for(const i of t)i.type<2?e[i.name]=i.value:Object.assign(e,i.value);return e}return null}},U=({childNodes:t},e)=>t[e],B=({children:t},e)=>t[e],R=({value:t,properties:e,children:i})=>t(e,...i),$=({name:t})=>"key"===t,j=(t,{content:e})=>t.reduce(U,e),L=(t,e)=>t.reduce(B,e),W=(t,e)=>{const i=null==e?"":String(e);i!==t.data&&(t.data=i)};
/*! (c) Andrea Giammarchi - ISC */var F=(t={})=>{const e=t.document||globalThis.document,i=new Map(t.plugins||[]),s=!!i.size,n=t.diff||x,o=t.effect||(t=>(t(),m)),r=t.getPeek||(t=>t.peek()),c=t.getValue||(t=>t.value),h=t.isSignal||(t.Signal?k.bind(t.Signal.prototype):()=>!1),f=t=>e.createTextNode(t),u=(t,e)=>{let i=y.get(t);return i||y.set(t,i={}),i[e]||(i[e]={})},a=(t,e)=>{t.dispose();const i=o((()=>{const i=R(e);i.id!==t.id?t=l(t,i,!1):t.update(i)}));return t.dispose=i,t},l=(t,e,i)=>e.type===C?a(t,e):((t,e,i)=>(t.dispose(),t=new d(e),i?t.dispose=o((()=>t.update(e))):t.update(e),t))(t,e,i);class d{constructor(t,e=!0){const[i,s]=e?b(t):[N,null];this._=e&&t.type===M,this.id=t.id,this.updates=i,this.content=s,this.dispose=m}get $(){const{content:t,_:e}=this;return e?(this._=!e,(this.content=(({childNodes:t})=>({childNodes:[...t]}))(t)).childNodes):[t]}update(t){for(const e of this.updates)e.call(this,t)}}const p=new d({id:null},!1),v={id:null,view:p},y=new WeakMap;let g;const S=new WeakMap,b=t=>{let e=S.get(t.id);if(!e){const i=[],s=H(t,i,[],N,!1);S.set(t.id,e=[i,s])}const[i,s]=e;return[i.slice(),s.cloneNode(!0)]},w=(t,e,i,s)=>{s?t.setAttribute(e,i):t[e]=i},U=(t,e,i,s,n)=>{if(h(i)){const r="🙊"+e;r in s&&s[r](),s[r]=o((()=>{w(t,e,c(i),n)}))}else w(t,e,i,n)},B=(t,e,n,o)=>{if(s&&i.has(e))i.get(e)(t,n,o);else if(o[e]!==n)switch(o[e]=n,e){case"class":e+="Name";case"className":case"textContent":U(t,e,n,o,!1);break;case"ref":n.current=t;break;default:e.startsWith("on")?t[e.toLowerCase()]=n:e in t?U(t,e,n,o,!1):null==n?t.removeAttribute(e):U(t,e,n,o,!0)}},F=(t,e,i)=>function(s){const n={},o=j(e,this);(this.updates[i]=i=>{const{attributes:s}=L(e,i);for(const e of t){const t=s[e],{type:i,value:r}=t;if(i<2)B(o,t.name,r,n);else for(const[t,e]of E(r))B(o,t,e,n)}})(s)},_=(t,i)=>function(s){let o=N,r=!0,c=-1;const h=j(t,this),f=new Map;(this.updates[i]=i=>{const{value:s}=L(t,i),a=[];for(let t=0;t<s.length;t++){const e=s[t];r&&(r=!r,c=e.attributes.findIndex($));const i=c<0?t:e.attributes[c].value;let{id:n,view:o}=f.get(i)||v;n!==(e.id||(e.id=u(h,t)))?(o=l(o,e,!1),f.set(i,{id:e.id,view:o})):o.update(e),a.push(...o.$)}if(a.length)o=n(o,a,h);else if(o!==N){const t=e.createRange();t.setStartBefore(o[0]),t.setEndAfter(o[o.length-1]),t.deleteContents(),f.clear(),o=N,r=!0}})(s)},z=(t,e)=>function(i){let s=N,o=p;const r=j(t,this);(this.updates[e]=e=>{o=a(o,L(t,e)),s=n(s,o.$,r)})(i)},G=(t,e)=>function(i){const s=j(t,this);(this.updates[e]=e=>{W(s,L(t,e).value)})(i)},D=(t,e)=>function(i){let s,h,u=m;const a=j(t,this),{value:d}=L(t,i),v=t=>{s!==t&&(u(),s=t,u=o(h))};if(g(r(d))){let t=N,e=p;h=()=>{const i=c(s);e=l(e,i,!1),t=n(t,e.$,a)}}else{const t=f("");a.replaceWith(t),h=()=>{W(t,c(s))}}this.updates[e]=e=>v(L(t,e).value),v(d)},V=(t,e)=>function(i){let s=N,o=p,r=null;const c=j(t,this);(this.updates[e]=e=>{e=L(t,e).value,r!==e.id?(r=e.id,o=l(o,e,!1),s=n(s,o.$,c)):e.type===C?o.update(R(e)):o.update(e)})(i)},q=({children:t},e,i,s,n)=>{for(let o=0;o<t.length;o++){const r=t[o];if(r.type===I)i.appendChild(f(r.value));else i.appendChild(H(t[o],e,[],s.concat(o),n))}},H=(t,i,s,n,o)=>{let r,c;const{length:u}=i;t:switch(t.type){case P:{const{value:e}=t;switch(!0){case g(e):r=V;break;case T(e):r=_;break;case h(e):r=D;break;default:c=f(""),i.push(G(n,u));break t}}case C:c=e.createComment("🙊"),i.push((r||z)(n,u));break;case A:{const{attributes:r,name:h}=t,f=[h],a=[];for(let t=0;t<r.length;t++){const e=r[t];e.type===P||e.dynamic?$(e)||s.push(t):("is"===e.name&&f.push({is:e.value}),a.push(e))}s.length&&i.push(F(s,n,u)),c=o||(o="svg"===h)?e.createElementNS("http://www.w3.org/2000/svg",...f):e.createElement(...f);for(const{name:t,value:e}of a)w(c,t,e,!0);q(t,i,c,n,o);break}case M:c=e.createDocumentFragment(),q(t,i,c,n,o)}return c};return(t,e)=>{const i="function"==typeof t?t():t;g||(g=k.bind(O(i)));const s=l(y.get(e)||p,i,!0);y.set(e,s),e.replaceChildren(...s.$)}};const _=(t={})=>F({...t,Signal:f,effect:w,isSignal:void 0});export{f as Signal,i as batch,v as computed,_ as createRender,w as effect,u as signal};
