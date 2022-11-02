/*! (c) Andrea Giammarchi */
const{is:t}=Object;let e;const s=t=>{const s=e;e=s||[];try{if(t(),!s)for(const{value:t}of e);}finally{e=s}};class n{constructor(t){this._=t}then(){return this.value}toJSON(){return this.value}toString(){return this.value}valueOf(){return this.value}}let o;class r extends n{constructor(t,e,s,n){super(t),this.f=n,this.$=!0,this.r=new Set,this.s=new p(e,s)}get value(){if(this.$){const t=o;o=this;try{this.s.value=this._(this.s._)}finally{this.$=!1,o=t}}return this.s.value}}const i={async:!1,equals:!0},c=(t,e,s=i)=>new r(t,e,s,!1);let l;const h=()=>{},a=({s:t})=>{"function"==typeof t._&&(t._=t._())};class u extends r{constructor(t,e,s){super(t,e,s,!0),this.i=0,this.a=!!s.async,this.m=!0,this.e=[]}get value(){this.a?this.async():this.sync()}async(){this.m&&(this.m=!1,queueMicrotask((()=>{this.m=!0,this.sync()})))}sync(){const t=l,{e:e}=l=this;if(this.i=0,a(this),super.value,this.i<e.length)for(const t of e.splice(this.i))t.stop();for(const{value:t}of e);l=t}stop(){a(this),this._=h,this.r.clear(),this.s.c.clear();for(const t of this.e.splice(0))t.stop()}}const f=()=>!1;class p extends n{constructor(e,{equals:s}){super(e),this.c=new Set,this.s=!0===s?t:s||f}peek(){return this._}get value(){return o&&(this.c.add(o),o.r.add(this)),this._}set value(t){const s=this._;if(!this.s(this._=t,s)&&this.c.size){const t=[],s=[this];for(const e of s)for(const n of e.c)if(!n.$&&n.r.has(e))if(n.r.clear(),n.$=!0,n.f){t.push(n);const e=[n];for(const t of e)for(const s of t.e)s.r.clear(),s.$=!0,e.push(s)}else s.push(n.s);for(const s of t)e?e.push(s):s.value}}}const d=(t,e=i)=>new p(t,e),g={async:!1},y=(t,e)=>((t,e,s=i)=>{let n;if(l){const{i:o,e:r}=l;o!==r.length&&r[o]._===t||(r[o]=new u(t,e,s)),n=r[o],l.i++}else(n=new u(t,e,s)).value;return()=>{n.stop()}})(t,e,g)
/*! (c) Andrea Giammarchi - ISC */,_=[],v=/^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i,m=/[&<>'"]/g,k=t=>w[t],w={"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"},b=t=>t.replace(m,k)
/*! (c) Andrea Giammarchi - ISC */,{isArray:x}=Array,{entries:$}=Object,N=(t,e)=>{const s=e?t.value:t;return null==s?"":s},S=t=>{switch(t){case"__token":case"key":case"is":return!1}return!0},j=(t,e)=>{for(let s=0;s<t.length;s++)e=e[t[s]].args;return e},A=(t,e)=>{const s=t.length-1;for(let n=0;n<s;n++)e=e[t[n]].args;return e[t[s]].value},B=(t,e)=>{for(let s=0;s<t.length;s++)e=e.childNodes[t[s]];return e},C=new Map;let M=!1;const q=(t,e)=>{M=!0,C.set(t,e)},O=(t,e,s,n)=>{if(M&&C.has(e))C.get(e)(t,s,n);else if(n[e]!==s)switch(n[e]=s,e){case"class":e+="Name";case"className":case"textContent":t[e]=s;break;case"ref":s.current=t;break;default:e.startsWith("on")?t[e.toLowerCase()]=s:e in t?t[e]=s:null==s?t.removeAttribute(e):t.setAttribute(e,s)}},W=(t,e,s,n)=>{const o=s.length;let r=e.length,i=o,c=0,l=0,h=null;for(;c<r||l<i;)if(r===c){const e=i<o?l?s[l-1].nextSibling:s[i-l]:n;for(;l<i;)t.insertBefore(s[l++],e)}else if(i===l)for(;c<r;)h&&h.has(e[c])||e[c].remove(),c++;else if(e[c]===s[l])c++,l++;else if(e[r-1]===s[i-1])r--,i--;else if(e[c]===s[i-1]&&s[l]===e[r-1]){const n=e[--r].nextSibling;t.insertBefore(s[l++],e[c++].nextSibling),t.insertBefore(s[--i],n),e[r]=s[i]}else{if(!h){h=new Map;let t=l;for(;t<i;)h.set(s[t],t++)}if(h.has(e[c])){const n=h.get(e[c]);if(l<n&&n<i){let o=c,a=1;for(;++o<r&&o<i&&h.get(e[o])===n+a;)a++;if(a>n-l){const o=e[c];for(;l<n;)t.insertBefore(s[l++],o)}else t.replaceChild(s[l++],e[c++])}else c++}else e[c++].remove()}return s};
/*! (c) Andrea Giammarchi - ISC */
class E{constructor(t,e,s,n,o){this.fragment="symbol"===t,this.type=t,this.child=e,this.tree=s,this.details=n,this.html=o}next(t,e,s){return new E(t,this.child.concat(e),s,this.details,this.html)}parse(t){return L.apply(this,t),this}push(t,e=!1,s=this.child,n=this.tree){this.details.push({child:s,tree:n,props:t,hole:e})}}const T=(t,e,s)=>{let n;if(t){const{length:t}=e;if(t){const o=e[t-1];n=e.slice(0,-1).concat(o+s)}else n=_}else n=e.concat(s);return n};function L(t,e){const{type:s,html:n}=this,{length:o}=arguments;switch(s){case"string":if(n.push(`<${t}`),e){const{is:t}=e;if(t&&n.push(` is="${t}"`),e instanceof H)this.push(_);else{const t=[];for(const[s,o]of $(e))S(s)&&(o instanceof H?t.push(s):n.push(` ${"className"===s?"class":s}="${b(o)}"`));t.length&&this.push(t)}}return 2===o?n.push(v.test(t)?" />":`></${t}>`):(n.push(">"),z.apply(this,arguments),n.push(`</${t}>`)),1;case"function":return n.push("\x3c!--🙊--\x3e"),this.push(null),1;case"symbol":return z.apply(this,arguments)}throw new Error(t)}function z(t,e){const{fragment:s,child:n,tree:o,html:r}=this,i=s&&!e?.__token;let c=0;for(let t=2;t<arguments.length;t++){const e=arguments[t];if("object"==typeof e)if(e instanceof H)r.push("\x3c!--🙊--\x3e"),this.push(null,!0,n.concat(t),T(i,o,c++));else{const{type:s,args:n}=e;c+=L.apply(this.next(s,t,T(i,o,c)),n)}else c++,r.push(e)}return c}class H{constructor(t){this.value=t}}class J{constructor(){this.__token=null,this.store=null,this.nodes=_}}class R extends J{constructor(t){super().key=t}}class D{constructor(t){this.args=t,this.updates=[]}refresh(t){t!==this.args&&(this.args=t,this.update())}update(){for(const t of this.updates)t(this.args)}}class F extends D{constructor(t){super(t),this.init=!0,this.keys=null,this.result=null,this.dispose=y((()=>{const{init:t,args:e}=this;let[s,n,...o]=e;if(t&&(this.init=!1,n))if(n instanceof H)this.keys=_,n=n.value;else{const t=[];for(const[e,s]of $(n))s instanceof H&&(t.push(e),n[e]=s.value);t.length&&(this.keys=t)}this.result=s(n,...o),t||this.update()}))}refresh(t){if(t!==this.args){let[e,s,...n]=this.args=t;const{keys:o}=this;if(o===_)s=s.value;else if(o)for(const t of o)s[t]=s[t].value;this.result=e(s,...n),this.update()}}update(){const{updates:t,result:{args:e}}=this;for(const s of t)s(e)}}
/*! (c) Andrea Giammarchi - ISC */const G=Symbol();function I(t){return{type:typeof t,args:arguments}}const K=t=>new H(t),P=new WeakMap,Q=(t,e)=>{"function"==typeof t&&(t=t());const{type:s,args:n}=t,{__token:o}=n[1];let r=P.get(e);if(!r||r.__token!==o){const[t,i]=tt(o,s,n);P.set(e,r={__token:o,updates:[]}),e.replaceChildren(Y(t,i,r.updates))}for(const t of r.updates)t(n)};let{document:U}=globalThis;const V=t=>{U=t},X=(t,e,s,n)=>{const o=Y(t,e,s);return n?[o]:[...o.childNodes]},Y=(t,e,s)=>{const o=U.importNode(t,!0);return((t,e,s)=>{for(const{child:o,tree:r,props:i,hole:c}of e){const e=B(r,t);if(i){const t={};s.push(i.length?s=>{const n=j(o,s)[1];for(const s of i)O(e,s,n[s].value,t)}:s=>{const n=j(o,s)[1].value;for(const[s,o]of $(n))S(s)&&O(e,s,o,t)})}else{const t=s.push(c?r=>{const i=A(o,r);if("object"==typeof i)if(x(i)){const{parentNode:n}=e;let c=!1,l=null,h=_,a=_;(s[t]=(t,s=A(o,t))=>{const r=[],i=[],{length:u}=h;let f=0;for(;f<s.length;f++){const t=f<u,e=s[f],{__token:n,key:o}=e.args[1];c||void 0===o||(c=!0,l={});let a=t?h[f]:null;t&&n===a.__token&&(!c||o.value===a.key)||c&&(a=l[o.value])?st(a,e):(c?(a=new R(o.value),l[o.value]=a):a=new J,et(a,n,e)),i.push(a),r.push(...a.nodes)}if(f){if(c)for(;f<u;f++)delete l[h[f].key];a=W(n,a,r,e),h=i}else{const{length:t}=a;if(t){const e=U.createRange();e.setStartBefore(a[0]),e.setEndAfter(a[t-1]),e.deleteContents(),a=_,c&&(l={})}h=_}})(r,i)}else{const c=i instanceof n;if(c&&"object"!=typeof i.value)s[t]=ot(o,e,i,!0);else{const{parentNode:n}=e,l=new J;(s[t]=(t,s=A(o,t))=>{const r=c?s.value:s,{__token:i}=r.args[1];if(i===l.__token)st(l,r);else{const{nodes:t}=l;et(l,i,r),W(n,t,l.nodes,e)}})(r,i)}}else s[t]=ot(o,e,i,!1)}:n=>{const[r,[i,c]]=Z(j(o,n));e.replaceWith(Y(i,c,r.updates)),s[t]=t=>{r.refresh(j(o,t))},r.update()})-1}}})(o,e,s),o},Z=t=>{const e=new F(t),{type:s,args:n}=e.result;return[e,tt(n[1].__token,s,n)]},tt=(t,e,s)=>t.info||(t.info=((t,e)=>{const{html:s,fragment:n,details:o}=new E(t,_,_,[],[]).parse(e),r=U.createElement("template");r.innerHTML=s.join("");const{content:i}=r;return[n?i:i.childNodes[0],o]})(e,s)),et=(t,e,s)=>{if(t.__token=e,"function"===s.type){const[e,[n,o]]=Z(s.args),{result:r,updates:i}=t.store=e;t.nodes=X(n,o,i,"symbol"!==r.type)}else nt(t,e,s,"string"===s.type);t.store.update()},st=({store:t},{args:e})=>{t.refresh(e)},nt=(t,e,{type:s,args:n},o)=>{const[r,i]=tt(e,s,n),{updates:c}=t.store=new D(n);t.nodes=X(r,i,c,o)},ot=(t,e,s,n)=>{const o=U.createTextNode(N(s,n));return e.replaceWith(o),e=>{o.data=N(A(t,e),n)}};export{G as Fragment,n as Signal,s as batch,c as computed,I as createElement,y as effect,K as interpolation,Q as render,d as signal,V as useDocument,q as useProperty};
