/*! (c) Andrea Giammarchi */
const{is:t}=Object;let e;const s=t=>{const s=e;e=s||[];try{if(t(),!s)for(const{value:t}of e);}finally{e=s}};class n{constructor(t){this._=t}then(){return this.value}toJSON(){return this.value}toString(){return this.value}valueOf(){return this.value}}let o;class i extends n{constructor(t,e,s,n){super(t),this.f=n,this.$=!0,this.r=new Set,this.s=new p(e,s)}get value(){if(this.$){const t=o;o=this;try{this.s.value=this._(this.s._)}finally{this.$=!1,o=t}}return this.s.value}}const r={async:!1,equals:!0},c=(t,e,s=r)=>new i(t,e,s,!1);let l;const a=()=>{},h=({s:t})=>{"function"==typeof t._&&(t._=t._())};class u extends i{constructor(t,e,s){super(t,e,s,!0),this.i=0,this.a=!!s.async,this.m=!0,this.e=[]}get value(){this.a?this.async():this.sync()}async(){this.m&&(this.m=!1,queueMicrotask((()=>{this.m=!0,this.sync()})))}sync(){const t=l,{e:e}=l=this;if(this.i=0,h(this),super.value,this.i<e.length)for(const t of e.splice(this.i))t.stop();for(const{value:t}of e);l=t}stop(){h(this),this._=a,this.r.clear(),this.s.c.clear();for(const t of this.e.splice(0))t.stop()}}const f=()=>!1;class p extends n{constructor(e,{equals:s}){super(e),this.c=new Set,this.s=!0===s?t:s||f}peek(){return this._}get value(){return o&&(this.c.add(o),o.r.add(this)),this._}set value(t){const s=this._;if(!this.s(this._=t,s)&&this.c.size){const t=[],s=[this];for(const e of s)for(const n of e.c)if(!n.$&&n.r.has(e))if(n.r.clear(),n.$=!0,n.f){t.push(n);const e=[n];for(const t of e)for(const s of t.e)s.r.clear(),s.$=!0,e.push(s)}else s.push(n.s);for(const s of t)e?e.push(s):s.value}}}const d=(t,e=r)=>new p(t,e),g={async:!1},y=(t,e)=>((t,e,s=r)=>{let n;if(l){const{i:o,e:i}=l;o!==i.length&&i[o]._===t||(i[o]=new u(t,e,s)),n=i[o],l.i++}else(n=new u(t,e,s)).value;return()=>{n.stop()}})(t,e,g)
/*! (c) Andrea Giammarchi - ISC */;var v,m,_="-"+Math.random().toFixed(6)+"%";try{v=document.createElement("template"),m="tabindex","content"in v&&(v.innerHTML='<p tabindex="'+_+'"></p>',v.content.childNodes[0].getAttribute(m)==_)||(_="_dt: "+_.slice(1,-1)+";",!0)}catch(t){}var k=/^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i;const{replace:w}="",b=/[&<>'"]/g,x={"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"},$=t=>x[t],N=t=>w.call(t,b,$);var M=(t,e,s,n,o)=>{const i=s.length;let r=e.length,c=i,l=0,a=0,h=null;for(;l<r||a<c;)if(r===l){const e=c<i?a?n(s[a-1],-0).nextSibling:n(s[c-a],0):o;for(;a<c;)t.insertBefore(n(s[a++],1),e)}else if(c===a)for(;l<r;)h&&h.has(e[l])||t.removeChild(n(e[l],-1)),l++;else if(e[l]===s[a])l++,a++;else if(e[r-1]===s[c-1])r--,c--;else if(e[l]===s[c-1]&&s[a]===e[r-1]){const o=n(e[--r],-1).nextSibling;t.insertBefore(n(s[a++],1),n(e[l++],-1).nextSibling),t.insertBefore(n(s[--c],1),o),e[r]=s[c]}else{if(!h){h=new Map;let t=a;for(;t<c;)h.set(s[t],t++)}if(h.has(e[l])){const o=h.get(e[l]);if(a<o&&o<c){let i=l,u=1;for(;++i<r&&i<c&&h.get(e[i])===o+u;)u++;if(u>o-a){const i=n(e[l],0);for(;a<o;)t.insertBefore(n(s[a++],1),i)}else t.replaceChild(n(s[a++],1),n(e[l++],-1))}else l++}else t.removeChild(n(e[l++],-1))}return s};
/*! (c) Andrea Giammarchi - ISC */const S=[],j=[],{isArray:A}=Array,{entries:C}=Object,W=new Map,B=(t,e)=>{const s=e?t.value:t;return null==s?"":s},q=t=>{switch(t){case"__token":case"key":case"is":return!1}return!0},E=(t,e)=>t[e].args,O=(t,e,s)=>{for(let n=0;n<e;n++)({args:s}=s[t[n]]);return s[t[e]].value},T=({childNodes:t},e)=>t[e],L=(t,e)=>{if(t===S)return e.value;if(t!==j)for(const s of t)e[s]=e[s].value;return e};let H=!1;const z=(t,e)=>{H=!0,W.set(t,e)},F=(t,e,s)=>{H&&W.has(e)?W.get(e)(t,s):"ref"===e?s.current=t:("class"===e?e+="Name":e.startsWith("on")&&(e=e.toLowerCase()),e in t?t[e]!==s&&(t[e]=s):null==s?t.removeAttribute(e):t.setAttribute(e,s))};
/*! (c) Andrea Giammarchi - ISC */
class J{constructor(t,e,s,n,o){this.fragment="symbol"==t,this.type=t,this.child=e,this.tree=s,this.details=n,this.html=o}next(t,e,s){return new J(t,this.child.concat(e),s,this.details,this.html)}push(t,e=!1,s=this.child,n=this.tree){this.details.push({child:s,tree:n,props:t,hole:e})}}class R{constructor(t){this.value=t}}class D{constructor(){this.__token=null,this.store=null,this.nodes=j}}class G extends D{constructor(){super(),this.key=void 0}}class I{constructor(t){this.args=t,this.updates=[]}refresh(t){t!==this.args&&(this.args=t,this.update())}update(){for(const t of this.updates)t(this.args)}}class K extends I{constructor(t){super(t),this.init=!0,this.keys=j,this.result=null,this.dispose=y((()=>{const{init:t,args:e}=this,[s,n,...o]=e;if(t&&(this.init=!1,n))if(n instanceof R)this.keys=S;else{let t=j;for(const[e,s]of C(n))s instanceof R&&(t===j?t=[]:t).push(e);this.keys=t}this.result=s(L(this.keys,n),...o),t||this.update()}))}refresh(t){if(t!==this.args){this.args=t;const[e,s,...n]=t;this.result=e(L(this.keys,s),...n),this.update()}}update(){const{updates:t,result:{args:e}}=this;for(const s of t)s(e)}}
/*! (c) Andrea Giammarchi - ISC */const P=Symbol();function Q(t){return{type:typeof t,args:arguments}}const U=t=>new R(t),V=new WeakMap,X=(t,e)=>{"function"==typeof t&&(t=t());const{type:s,args:n}=t,{__token:o}=n[1];let i=V.get(e);if(!i||i.__token!==o){const[t,r]=ht(o,s,n);V.set(e,i={__token:o,updates:[]}),e.replaceChildren(ot(t,r,i.updates))}for(const t of i.updates)t(n)};let{document:Y}=globalThis;const Z=t=>{Y=t};function tt(t,e){const{type:s,html:n}=this,{length:o}=arguments;switch(s){case"string":if(n.push(`<${t}`),e){const{is:t}=e;if(t&&n.push(` is="${t}"`),e instanceof R)this.push(S);else{const t=[];for(const[s,o]of C(e))q(s)&&(o instanceof R?t.push(s):n.push(` ${"className"===s?"class":s}="${N(o)}"`));t.length&&this.push(t)}}return 2===o?n.push(k.test(t)?" />":`></${t}>`):(n.push(">"),it.apply(this,arguments),n.push(`</${t}>`)),1;case"function":return n.push("\x3c!--🙊--\x3e"),this.push(j),1;case"symbol":return it.apply(this,arguments)}throw new Error(t)}const et=t=>t,st=(t,e,s,n)=>{const o=ot(t,e,s);return n?[o]:[...o.childNodes]},nt=(t,e,s)=>{let n;if(t){const{length:t}=e;if(t){const o=e[t-1];n=e.slice(0,-1).concat(o+s)}else n=j}else n=e.concat(s);return n},ot=(t,e,s)=>{const o=Y.importNode(t,!0);return((t,e,s)=>{for(const{child:o,tree:i,props:r,hole:c}of e){const e=i.reduce(T,t),l=o.length-1;if(r===j){const t=s.push(c?i=>{const r=O(o,l,i);if("object"==typeof r)if(A(r)){const{parentNode:n}=e;let c=0,l=[],a={},h=[];(s[t]=(t,s=O(o,i,t))=>{const{length:i}=l,r=[];let u=!1;for(c=0;c<s.length;c++){const t=s[c],{__token:e,key:n}=t.args[1];u||void 0===n||(u=!0);let o=l[c]||(l[c]=new G);u&&n.value===o.key&&e===o.__token?ft(o,t):u&&a[n.value]?ft(o=l[c]=a[n.value],t):(u&&(o.key=n.value,a[n.value]=o),ut(o,e,t)),r.push(...o.nodes)}if(c){if(c<i){const t=l.splice(c);if(u)for(const{key:e}of t)delete a[e]}h=M(n,h,r,et,e)}else{const{length:t}=h;if(t){const e=Y.createRange();e.setStartBefore(h[0]),e.setEndAfter(h[t-1]),e.deleteContents(),h=r,l=[],a={}}}})(i,r)}else{const c=r instanceof n;if(c&&"object"!=typeof r.value)s[t]=dt(o,l,e,r,!0);else{const{parentNode:n}=e,a=new D;(s[t]=(t,s=O(o,l,t))=>{const i=c?s.value:s,{__token:r}=i.args[1];if(r===a.__token)ft(a,i);else{const{nodes:t}=a;ut(a,r,i),M(n,t,a.nodes,et,e)}})(i,r)}}else s[t]=dt(o,l,e,r,!1)}:n=>{const[i,[r,c]]=ct(o.reduce(E,n));e.replaceWith(ot(r,c,i.updates)),s[t]=t=>{i.refresh(o.reduce(E,t))},i.update()})-1}else s.push(r===S?t=>{const s=o.reduce(E,t)[1].value;for(const[t,n]of C(s))q(t)&&F(e,t,n)}:t=>{const s=o.reduce(E,t)[1];for(const t of r)F(e,t,s[t].value)})}})(o,e,s),o};function it(t,e){const{fragment:s,child:n,tree:o,html:i}=this,r=s&&!e?.__token;let c=0;for(let t=2;t<arguments.length;t++){const e=arguments[t];if("object"==typeof e)if(e instanceof R)i.push("\x3c!--🙊--\x3e"),this.push(j,!0,n.concat(t),nt(r,o,c++));else{const{type:s,args:n}=e;c+=tt.apply(this.next(s,t,nt(r,o,c)),n)}else c++,i.push(e)}return c}const rt=new WeakMap,ct=t=>{const e=new K(t);let s=rt.get(t[0]);if(!s){const{type:n,args:o}=e.result;rt.set(t[0],s=lt.apply(n,o))}return[e,s]};function lt(){const t=new J(this,j,j,[],[]);tt.apply(t,arguments);const e=Y.createElement("template");e.innerHTML=t.html.join("");const{content:s}=e;return["symbol"==this?s:s.childNodes[0],t.details]}const at=new WeakMap,ht=(t,e,s)=>{let n=at.get(t);return n||at.set(t,n=lt.apply(e,s)),n},ut=(t,e,s)=>{if(t.__token=e,"function"===s.type){const[e,[n,o]]=ct(s.args),{result:i,updates:r}=t.store=e;t.nodes=st(n,o,r,"symbol"!==i.type)}else pt(t,e,s,"string"===s.type);t.store.update()},ft=({store:t},{args:e})=>{t.refresh(e)},pt=(t,e,{type:s,args:n},o)=>{const[i,r]=ht(e,s,n),{updates:c}=t.store=new I(n);t.nodes=st(i,r,c,o)},dt=(t,e,s,n,o)=>{const i=Y.createTextNode(B(n,o));return s.replaceWith(i),s=>{i.data=B(O(t,e,s),o)}};export{P as Fragment,n as Signal,s as batch,c as computed,Q as createElement,y as effect,U as interpolation,X as render,d as signal,Z as useDocument,z as useProperty};
