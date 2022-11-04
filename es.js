/*! (c) Andrea Giammarchi */
const{is:t}=Object;let s;const e=t=>{const e=s;s=e||[];try{if(t(),!e)for(const{value:t}of s);}finally{s=e}};class n{constructor(t){this._=t}then(){return this.value}toJSON(){return this.value}toString(){return this.value}valueOf(){return this.value}}let o;class r extends n{constructor(t,s,e,n){super(t),this.f=n,this.$=!0,this.r=new Set,this.s=new d(s,e)}get value(){if(this.$){const t=o;o=this;try{this.s.value=this._(this.s._)}finally{this.$=!1,o=t}}return this.s.value}}const i={async:!1,equals:!0},c=(t,s,e=i)=>new r(t,s,e,!1);let l;const h=[],a=()=>{},u=({s:t})=>{"function"==typeof t._&&(t._=t._())};class f extends r{constructor(t,s,e){super(t,s,e,!0),this.e=h}run(){return this.$=!0,this.value,this}stop(){this._=a,this.r.clear(),this.s.c.clear()}}class p extends f{constructor(t,s,e){super(t,s,e),this.i=0,this.a=!!e.async,this.m=!0,this.e=[]}get value(){this.a?this.async():this.sync()}async(){this.m&&(this.m=!1,queueMicrotask((()=>{this.m=!0,this.sync()})))}sync(){const t=l;(l=this).i=0,u(this),super.value,l=t}stop(){super.stop(),u(this);for(const t of this.e.splice(0))t.stop()}}const g=()=>!1;class d extends n{constructor(s,{equals:e}){super(s),this.c=new Set,this.s=!0===e?t:e||g}peek(){return this._}get value(){return o&&(this.c.add(o),o.r.add(this)),this._}set value(t){const e=this._;if(!this.s(this._=t,e)&&this.c.size){const t=[],e=[this];for(const s of e)for(const n of s.c)if(!n.$&&n.r.has(s))if(n.r.clear(),n.$=!0,n.f){t.push(n);const s=[n];for(const t of s)for(const e of t.e)e.r.clear(),e.$=!0,s.push(e)}else e.push(n.s);for(const e of t)s?s.push(e):e.value}}}const y=(t,s=i)=>new d(t,s),m={async:!1},_=(t,s)=>((t,s,e=i)=>{let n;if(l){const{i:o,e:r}=l,i=o===r.length;(i||r[o]._!==t)&&(i||r[o].stop(),r[o]=new p(t,s,e).run()),n=r[o],l.i++}else n=new p(t,s,e).run();return()=>{n.stop()}})(t,s,m)
/*! (c) Andrea Giammarchi - ISC */,v=[],k=/^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i,w=/[&<>'"]/g,b=t=>x[t],x={"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"},$=t=>t.replace(w,b)
/*! (c) Andrea Giammarchi - ISC */,{isArray:N}=Array,{entries:S}=Object,j=(t,s)=>{const e=s?t.value:t;return null==e?"":e},q=t=>{switch(t){case"__token":case"key":case"is":return!1}return!0},A={async:!1,equals:!0},B=(t,s)=>new(s?f:p)(t,void 0,A).run(),C=(t,s)=>{for(let e=0;e<t.length;e++)s=s[t[e]].args;return s},M=(t,s)=>{const e=t.length-1;for(let n=0;n<e;n++)s=s[t[n]].args;return s[t[e]].value},O=(t,s)=>{for(let e=0;e<t.length;e++)s=s.childNodes[t[e]];return s},W=new Map;let E=!1;const T=(t,s)=>{E=!0,W.set(t,s)},L=(t,s,e,n)=>{if(E&&W.has(s))W.get(s)(t,e,n);else if(n[s]!==e)switch(n[s]=e,s){case"class":s+="Name";case"className":case"textContent":t[s]=e;break;case"ref":e.current=t;break;default:s.startsWith("on")?t[s.toLowerCase()]=e:s in t?t[s]=e:null==e?t.removeAttribute(s):t.setAttribute(s,e)}},z=(t,s,e,n)=>{const o=e.length;let r=s.length,i=o,c=0,l=0,h=null;for(;c<r||l<i;)if(r===c){const s=i<o?l?e[l-1].nextSibling:e[i-l]:n;for(;l<i;)t.insertBefore(e[l++],s)}else if(i===l)for(;c<r;)h&&h.has(s[c])||s[c].remove(),c++;else if(s[c]===e[l])c++,l++;else if(s[r-1]===e[i-1])r--,i--;else if(s[c]===e[i-1]&&e[l]===s[r-1]){const n=s[--r].nextSibling;t.insertBefore(e[l++],s[c++].nextSibling),t.insertBefore(e[--i],n),s[r]=e[i]}else{if(!h){h=new Map;let t=l;for(;t<i;)h.set(e[t],t++)}if(h.has(s[c])){const n=h.get(s[c]);if(l<n&&n<i){let o=c,a=1;for(;++o<r&&o<i&&h.get(s[o])===n+a;)a++;if(a>n-l){const o=s[c];for(;l<n;)t.insertBefore(e[l++],o)}else t.replaceChild(e[l++],s[c++])}else c++}else s[c++].remove()}return e};
/*! (c) Andrea Giammarchi - ISC */
class H{constructor(t,s,e,n,o){this.fragment="symbol"===t,this.type=t,this.child=s,this.tree=e,this.details=n,this.html=o}next(t,s,e){return new H(t,this.child.concat(s),e,this.details,this.html)}parse(t){return R.apply(this,t),this}push(t,s=!1,e=this.child,n=this.tree){this.details.push({child:e,tree:n,props:t,hole:s})}}const J=(t,s,e)=>{let n;if(t){const{length:t}=s;if(t){const o=s[t-1];n=s.slice(0,-1).concat(o+e)}else n=v}else n=s.concat(e);return n};function R(t,s){const{type:e,html:n}=this,{length:o}=arguments;switch(e){case"string":if(n.push(`<${t}`),s){const{is:t}=s;if(t&&n.push(` is="${t}"`),s instanceof F)this.push(v);else{const t=[];for(const[e,o]of S(s))q(e)&&(o instanceof F?t.push(e):n.push(` ${"className"===e?"class":e}="${$(o)}"`));t.length&&this.push(t)}}return 2===o?n.push(k.test(t)?" />":`></${t}>`):(n.push(">"),D.apply(this,arguments),n.push(`</${t}>`)),1;case"function":return n.push("\x3c!--🙊--\x3e"),this.push(null),1;case"symbol":return D.apply(this,arguments)}throw new Error(t)}function D(t,s){const{fragment:e,child:n,tree:o,html:r}=this,i=e&&!s?.__token;let c=0;for(let t=2;t<arguments.length;t++){const s=arguments[t];if("object"==typeof s)if(s instanceof F)r.push("\x3c!--🙊--\x3e"),this.push(null,!0,n.concat(t),J(i,o,c++));else{const{type:e,args:n}=s;c+=R.apply(this.next(e,t,J(i,o,c)),n)}else c++,r.push(s)}return c}class F{constructor(t){this.value=t}}class G{constructor(){this.__token=null,this.store=null}get nodes(){return this.store.nodes}}class I extends G{constructor(t){super().key=t}}class K{constructor(t,s,e){this.args=null,this.nodes=e,this.updates=s,this.refresh(t)}refresh(t){if(this.args!==t){this.args=t;for(const t of this.updates)t(this.args)}}}class P{constructor(t,s,e){this.args=t,this.calc=!1,this.init=!0,this.keys=null,this.effect=B((()=>{const{args:t,calc:n,init:o,keys:r}=this;let[i,c,...l]=t;if(o){if(this.init=!1,c)if(c instanceof F)this.keys=v,c=c.value;else{const t=[];for(const[s,e]of S(c))e instanceof F&&(t.push(s),c[s]=e.value);t.length&&(this.keys=t)}}else if(n)if(this.calc=!1,r===v)c=c.value;else if(r)for(const t of r)c[t]=c[t].value;if(this.result=i(c,...l),o){const{type:t,args:n}=this.result,[o,r]=s(n[1].__token,t,n);this.nodes=e(o,r,this.updates=[],"symbol"!==t)}for(const t of this.updates)t(this.result.args)}),!1)}refresh(t){this.args!==t&&(this.args=t,this.calc=!0,this.effect.run())}}
/*! (c) Andrea Giammarchi - ISC */const Q=Symbol();function U(t){return{type:typeof t,args:arguments}}const V=t=>new F(t),X=new WeakMap,Y=(t,s)=>{"function"==typeof t&&(t=t());const{type:e,args:n}=t,{__token:o}=n[1];let r=X.get(s);if(!r||r.__token!==o){const[t,i]=ot(o,e,n);X.set(s,r={__token:o,updates:[]}),s.replaceChildren(et(t,i,r.updates))}for(const t of r.updates)t(n)};let{document:Z}=globalThis;const tt=t=>{Z=t},st=(t,s,e,n)=>{const o=et(t,s,e);return n?[o]:[...o.childNodes]},et=(t,s,e)=>{const o=Z.importNode(t,!0);return((t,s,e)=>{for(const{child:o,tree:r,props:i,hole:c}of s){const s=O(r,t);if(i){const t={};e.push(i.length?e=>{const n=C(o,e)[1];for(const e of i)L(s,e,n[e].value,t)}:e=>{const n=C(o,e)[1].value;for(const[e,o]of S(n))q(e)&&L(s,e,o,t)})}else{const t=e.push(c?r=>{const i=M(o,r);if("object"==typeof i)if(N(i)){const{parentNode:n}=s;let c=!1,l=null,h=v,a=v;(e[t]=(t,e=M(o,t))=>{const r=[],i=[],{length:u}=h;let f=0;for(;f<e.length;f++){const t=f<u,s=e[f],{__token:n,key:o}=s.args[1];c||void 0===o||(c=!0,l={});let a=t?h[f]:null;t&&n===a.__token&&(!c||o.value===a.key)||c&&(a=l[o.value])?it(a,s):(c?(a=new I(o.value),l[o.value]=a):a=new G,rt(a,n,s)),i.push(a),r.push(...a.nodes)}if(f)a=z(n,a,r,s),h=i;else{const{length:t}=a;if(t){const s=Z.createRange();s.setStartBefore(a[0]),s.setEndAfter(a[t-1]),s.deleteContents(),a=v,c&&(l={})}h=v}})(r,i)}else{const c=i instanceof n;if(c&&"object"!=typeof i.peek())e[t]=ct(o,s,i,!0);else{const{parentNode:n}=s,l=new G;(e[t]=(t,e=M(o,t))=>{const r=j(e,c),{__token:i}=r.args[1];if(i===l.__token)it(l,r);else{const{nodes:t}=l;rt(l,i,r),z(n,t,l.nodes,s)}})(r,i)}}else e[t]=ct(o,s,i,!1)}:n=>{const r=nt(C(o,n));s.replaceWith(...r.nodes),e[t]=t=>{r.refresh(C(o,t))}})-1}}})(o,s,e),o},nt=t=>new P(t,ot,st),ot=(t,s,e)=>{let{info:n}=t;if(!n){const{html:o,fragment:r,details:i}=t.ops?{html:[t.html],fragment:"symbol"===s,details:t.ops}:new H(s,v,v,[],[]).parse(e),c=Z.createElement("template");c.innerHTML=o.join("");const{content:l}=c;t.info=n=[r?l:l.childNodes[0],i]}return n},rt=(t,s,{type:e,args:n})=>{if(t.__token=s,"function"===e)t.store=nt(n);else{const o=[],[r,i]=ot(s,e,n),c=st(r,i,o,"string"===e);t.store=new K(n,o,c)}},it=({store:t},{args:s})=>{t.refresh(s)},ct=(t,s,e,n)=>{let o=n?e:j(e,n);const r=Z.createTextNode(n?"":o);if(s.replaceWith(r),n){const s=B((()=>{r.data=j(o,n)}),!0);return e=>{const n=M(t,e);n!==o&&(o=n,s.run())}}return s=>{const e=j(M(t,s),n);e!==o&&(o=e,r.data=e)}};export{p as Effect,f as FX,Q as Fragment,n as Signal,e as batch,c as computed,U as createElement,_ as effect,V as interpolation,Y as render,y as signal,tt as useDocument,T as useProperty};
