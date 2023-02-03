/*! (c) Andrea Giammarchi */
let e=null;const t=t=>{let s=e;s||(e=new Set);try{t()}finally{if(!s){[e,s]=[null,e];for(const e of s)e._()}}},s=e=>{const t=[...e];return e.clear(),t};class n extends Set{constructor(e){super()._=e}dispose(){for(const e of s(this))e.delete(this),e.dispose?.()}}let i=null;const o=e=>{const t=new n((()=>{const s=i;i=t;try{e()}finally{i=s}}));return t},r=(e,t)=>{const s=o((()=>{t=e(t)}));return i&&i.add(s),s._(),()=>s.dispose()};class a extends Set{constructor(e){super()._=e}get value(){return i&&i.add(this.add(i)),this._}set value(t){if(this._!==t){this._=t;const n=!e;for(const t of s(this))n?t._():e.add(t)}}peek(){return this._}then(e){e(this.value)}toJSON(){return this.value}valueOf(){return this.value}toString(){return String(this.value)}}const l=e=>new a(e);class c extends a{constructor(e,t){super(t).f=e,this.e=null}get value(){return this.e||(this.e=o((()=>{super.value=this.f(this._)})))._(),super.value}set value(e){throw new Error("computed is read-only")}}const u=(e,t)=>new c(e,t);var d=(0,Object.freeze)([]),h=()=>{};const f=(e,t,s)=>{const{parentNode:n}=s,i=t.length;let o=e.length,r=i,a=0,l=0,c=null;for(;a<o||l<r;)if(o===a){const e=r<i?l?t[l-1].nextSibling:t[r-l]:s;for(;l<r;)n.insertBefore(t[l++],e)}else if(r===l)for(;a<o;)c&&c.has(e[a])||e[a].remove(),a++;else if(e[a]===t[l])a++,l++;else if(e[o-1]===t[r-1])o--,r--;else if(e[a]===t[r-1]&&t[l]===e[o-1]){const s=e[--o].nextSibling;n.insertBefore(t[l++],e[a++].nextSibling),n.insertBefore(t[--r],s),e[o]=t[r]}else{if(!c){c=new Map;let e=l;for(;e<r;)c.set(t[e],e++)}if(c.has(e[a])){const s=c.get(e[a]);if(l<s&&s<r){let i=a,u=1;for(;++i<o&&i<r&&c.get(e[i])===s+u;)u++;if(u>s-l){const i=e[a];for(;l<s;)n.insertBefore(t[l++],i)}else n.replaceChild(t[l++],e[a++])}else a++}else e[a++].remove()}return t},{isArray:p}=Array,{entries:g,getPrototypeOf:v,prototype:{isPrototypeOf:b}}=Object,{COMPONENT:w,ELEMENT:N,FRAGMENT:y,INTERPOLATION:m,STATIC:S}=class{static ATTRIBUTE=1;static COMPONENT=2;static ELEMENT=3;static FRAGMENT=4;static INTERPOLATION=5;static STATIC=6;get properties(){const{attributes:e}=this;if(e.length){const t={};for(const s of e)s.type<2?t[s.name]=s.value:Object.assign(t,s.value);return t}return null}},T=({childNodes:e},t)=>e[t],E=({children:e},t)=>e[t],O=({value:e,properties:t,children:s})=>e(t,...s),k=({name:e})=>"key"===e,_=(e,{content:t})=>e.reduce(T,t),A=(e,t)=>e.reduce(E,t),C=(e,t)=>{const s=null==t?"":String(t);s!==e.data&&(e.data=s)};
/*! (c) Andrea Giammarchi - ISC */var M=(e={})=>{const t=e.document||globalThis.document,s=new Map(e.plugins||[]),n=!!s.size,i=e.diff||f,o=e.effect||(e=>(e(),h)),r=e.getPeek||(e=>e.peek()),a=e.getValue||(e=>e.value),l=e.isSignal||(e.Signal?b.bind(e.Signal.prototype):()=>!1),c=e=>t.createTextNode(e),u=(e,t)=>{let s=P.get(e);return s||P.set(e,s={}),s[t]||(s[t]={})},T=(e,t)=>{e.dispose();const s=o((()=>{const s=O(t);s.id!==e.id?e=E(e,s,!1):e.update(s)}));return e.dispose=s,e},E=(e,t,s)=>t.type===w?T(e,t):((e,t,s)=>(e.dispose(),e=new M(t),s?e.dispose=o((()=>e.update(t))):e.update(t),e))(e,t,s);class M{constructor(e,t=!0){const[s,n]=t?$(e):[d,null];this._=t&&e.type===y,this.id=e.id,this.updates=s,this.content=n,this.dispose=h}get $(){const{content:e,_:t}=this;return t?(this._=!t,(this.content=(({childNodes:e})=>({childNodes:[...e]}))(e)).childNodes):[e]}update(e){for(const t of this.updates)t.call(this,e)}}const x=new M({id:null},!1),I={id:null,view:x},P=new WeakMap;let B;const R=new WeakMap,$=e=>{let t=R.get(e.id);if(!t){const s=[],n=q(e,s,[],d,!1);R.set(e.id,t=[s,n])}const[s,n]=t;return[s.slice(),n.cloneNode(!0)]},L=(e,t,s,n)=>{n?e.setAttribute(t,s):e[t]=s},W=(e,t,s,n,i)=>{if(l(s)){const r="🙊"+t;r in n&&n[r](),n[r]=o((()=>{L(e,t,a(s),i)}))}else L(e,t,s,i)},j=(e,t,i,o)=>{if(n&&s.has(t))s.get(t)(e,i,o);else if(o[t]!==i)switch(o[t]=i,t){case"class":t+="Name";case"className":case"textContent":W(e,t,i,o,!1);break;case"ref":i.current=e;break;default:t.startsWith("on")?e[t.toLowerCase()]=i:t in e?W(e,t,i,o,!1):null==i?e.removeAttribute(t):W(e,t,i,o,!0)}},F=(e,t,s)=>function(n){const i={},o=_(t,this);(this.updates[s]=s=>{const{attributes:n}=A(t,s);for(const t of e){const e=n[t],{type:s,value:r}=e;if(s<2)j(o,e.name,r,i);else for(const[e,t]of g(r))j(o,e,t,i)}})(n)},z=(e,s)=>function(n){let o=d,r=!0,a=-1;const l=_(e,this),c=new Map;(this.updates[s]=s=>{const{value:n}=A(e,s),h=[];for(let e=0;e<n.length;e++){const t=n[e];r&&(r=!r,a=t.attributes.findIndex(k));const s=a<0?e:t.attributes[a].value;let{id:i,view:o}=c.get(s)||I;i!==(t.id||(t.id=u(l,e)))?(o=E(o,t,!1),c.set(s,{id:t.id,view:o})):o.update(t),h.push(...o.$)}if(h.length)o=i(o,h,l);else if(o!==d){const e=t.createRange();e.setStartBefore(o[0]),e.setEndAfter(o[o.length-1]),e.deleteContents(),c.clear(),o=d,r=!0}})(n)},G=(e,t)=>function(s){let n=d,o=x;const r=_(e,this);(this.updates[t]=t=>{o=T(o,A(e,t)),n=i(n,o.$,r)})(s)},D=(e,t)=>function(s){const n=_(e,this);(this.updates[t]=t=>{C(n,A(e,t).value)})(s)},J=(e,t)=>function(s){let n,l,u=h;const f=_(e,this),{value:p}=A(e,s),g=e=>{n!==e&&(u(),n=e,u=o(l))};if(B(r(p))){let e=d,t=x;l=()=>{const s=a(n);t=E(t,s,!1),e=i(e,t.$,f)}}else{const e=c("");f.replaceWith(e),l=()=>{C(e,a(n))}}this.updates[t]=t=>g(A(e,t).value),g(p)},U=(e,t)=>function(s){let n=d,o=x,r=null;const a=_(e,this);(this.updates[t]=t=>{t=A(e,t).value,r!==t.id?(r=t.id,o=E(o,t,!1),n=i(n,o.$,a)):t.type===w?o.update(O(t)):o.update(t)})(s)},V=({children:e},t,s,n,i)=>{for(let o=0;o<e.length;o++){const r=e[o];if(r.type===S)s.appendChild(c(r.value));else s.appendChild(q(e[o],t,[],n.concat(o),i))}},q=(e,s,n,i,o)=>{let r,a;const{length:u}=s;e:switch(e.type){case m:{const{value:t}=e;switch(!0){case B(t):r=U;break;case p(t):r=z;break;case l(t):r=J;break;default:a=c(""),s.push(D(i,u));break e}}case w:a=t.createComment("🙊"),s.push((r||G)(i,u));break;case N:{const{attributes:r,name:l}=e,c=[l],d=[];for(let e=0;e<r.length;e++){const t=r[e];t.type===m||t.dynamic?k(t)||n.push(e):("is"===t.name&&c.push({is:t.value}),d.push(t))}n.length&&s.push(F(n,i,u)),a=o||(o="svg"===l)?t.createElementNS("http://www.w3.org/2000/svg",...c):t.createElement(...c);for(const{name:e,value:t}of d)L(a,e,t,!0);V(e,s,a,i,o);break}case y:a=t.createDocumentFragment(),V(e,s,a,i,o)}return a};return(e,t)=>{const s="function"==typeof e?e():e;B||(B=b.bind(v(s)));const n=E(P.get(t)||x,s,!0);P.set(t,n),t.replaceChildren(...n.$)}};const x=(e={})=>M({...e,Signal:a,effect:r,isSignal:void 0});export{c as Computed,a as Signal,t as batch,u as computed,x as createRender,r as effect,l as signal};
