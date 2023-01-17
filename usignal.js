/*! (c) Andrea Giammarchi */
const{is:t}=Object;let e;const s=t=>{const s=e;e=s||[];try{if(t(),!s)for(const{value:t}of e);}finally{e=s}};class n{constructor(t){this._=t}then(){return this.value}toJSON(){return this.value}toString(){return this.value}valueOf(){return this.value}}let i;class o extends n{constructor(t,e,s,n){super(t),this.f=n,this.$=!0,this.r=new Set,this.s=new g(e,s)}get value(){if(this.$){const t=i;i=this;try{this.s.value=this._(this.s._)}finally{this.$=!1,i=t}}return this.s.value}}const c={async:!1,equals:!0},a=(t,e,s=c)=>new o(t,e,s,!1);let r;const l=[],u=()=>{},h=({s:t})=>{"function"==typeof t._&&(t._=t._())};class f extends o{constructor(t,e,s){super(t,e,s,!0),this.e=l}run(){return this.$=!0,this.value,this}stop(){this._=u,this.r.clear(),this.s.c.clear()}}class p extends f{constructor(t,e,s){super(t,e,s),this.i=0,this.a=!!s.async,this.m=!0,this.e=[]}get value(){this.a?this.async():this.sync()}async(){this.m&&(this.m=!1,queueMicrotask((()=>{this.m=!0,this.sync()})))}sync(){const t=r;(r=this).i=0,h(this),super.value,r=t}stop(){super.stop(),h(this);for(const t of this.e.splice(0))t.stop()}}const d=()=>!1;class g extends n{constructor(e,{equals:s}){super(e),this.c=new Set,this.s=!0===s?t:s||d}peek(){return this._}get value(){return i&&(this.c.add(i),i.r.add(this)),this._}set value(t){const s=this._;if(!this.s(this._=t,s)&&this.c.size){const t=[],s=[this];for(const e of s)for(const n of e.c)if(!n.$&&n.r.has(e))if(n.r.clear(),n.$=!0,n.f){t.push(n);const e=[n];for(const t of e)for(const s of t.e)s.r.clear(),s.$=!0,e.push(s)}else s.push(n.s);for(const s of t)e?e.push(s):s.value}}}const v=(t,e=c)=>new g(t,e),y={async:!1},b=(t,e)=>((t,e,s=c)=>{let n;if(r){const{i:i,e:o}=r,c=i===o.length;(c||o[i]._!==t)&&(c||o[i].stop(),o[i]=new p(t,e,s).run()),n=o[i],r.i++}else n=new p(t,e,s).run();return()=>{n.stop()}})(t,e,y);var w=(0,Object.freeze)([]),N=()=>{};const m=(t,e,s)=>{const{parentNode:n}=s,i=e.length;let o=t.length,c=i,a=0,r=0,l=null;for(;a<o||r<c;)if(o===a){const t=c<i?r?e[r-1].nextSibling:e[c-r]:s;for(;r<c;)n.insertBefore(e[r++],t)}else if(c===r)for(;a<o;)l&&l.has(t[a])||t[a].remove(),a++;else if(t[a]===e[r])a++,r++;else if(t[o-1]===e[c-1])o--,c--;else if(t[a]===e[c-1]&&e[r]===t[o-1]){const s=t[--o].nextSibling;n.insertBefore(e[r++],t[a++].nextSibling),n.insertBefore(e[--c],s),t[o]=e[c]}else{if(!l){l=new Map;let t=r;for(;t<c;)l.set(e[t],t++)}if(l.has(t[a])){const s=l.get(t[a]);if(r<s&&s<c){let i=a,u=1;for(;++i<o&&i<c&&l.get(t[i])===s+u;)u++;if(u>s-r){const i=t[a];for(;r<s;)n.insertBefore(e[r++],i)}else n.replaceChild(e[r++],t[a++])}else a++}else t[a++].remove()}return e},{isArray:T}=Array,{getPrototypeOf:S,prototype:{isPrototypeOf:E}}=Object,{COMPONENT:O,ELEMENT:k,FRAGMENT:_,INTERPOLATION:$,STATIC:A}=class{static ATTRIBUTE=1;static COMPONENT=2;static ELEMENT=3;static FRAGMENT=4;static INTERPOLATION=5;static STATIC=6;get properties(){const{attributes:t}=this;if(t.length){const e={};for(const s of t)s.type<2?e[s.name]=s.value:Object.assign(e,s.value);return e}return null}},M=({childNodes:t},e)=>t[e],x=({children:t},e)=>t[e],C=({value:t,properties:e,children:s})=>t(e,...s),I=({name:t})=>"key"===t,P=(t,{content:e})=>t.reduce(M,e),B=(t,e)=>t.reduce(x,e),R=(t,e)=>{const s=null==e?"":String(e);s!==t.data&&(t.data=s)};
/*! (c) Andrea Giammarchi - ISC */var L=(t={})=>{const e=t.document||globalThis.document,s=new Map(t.plugins||[]),n=!!s.size,i=t.diff||m,o=t.effect||(t=>(t(),N)),c=t.getPeek||(t=>t.peek()),a=t.getValue||(t=>t.value),r=t.isSignal||(t.Signal?E.bind(t.Signal.prototype):()=>!1),l=t=>e.createTextNode(t),u=(t,e)=>{t.dispose();const s=o((()=>{const s=C(e);s.id!==t.id?t=h(t,s,!1):t.update(s)}));return t.dispose=s,t},h=(t,e,s)=>e.type===O?u(t,e):((t,e,s)=>(t.dispose(),t=new f(e),s?t.dispose=o((()=>t.update(e))):t.update(e),t))(t,e,s);class f{constructor(t,e=!0){const[s,n]=e?b(t):[w,null];this._=e&&t.type===_,this.id=t.id,this.updates=s,this.content=n,this.dispose=N}get $(){const{content:t,_:e}=this;return e?(this._=!e,(this.content=(({childNodes:t})=>({childNodes:[...t]}))(t)).childNodes):[t]}update(t){for(const e of this.updates)e.call(this,t)}}const p=new f({id:null},!1),d={id:null,view:p},g=new WeakMap;let v;const y=new WeakMap,b=t=>{let e=y.get(t.id);if(!e){const s=[],n=J(t,s,[],w,!1);y.set(t.id,e=[s,n])}const[s,n]=e;return[s.slice(),n.cloneNode(!0)]},M=(t,e,s,n)=>{n?t.setAttribute(e,s):t[e]=s},x=(t,e,s,n,i)=>{if(r(s)){const c="🙊"+e;c in n&&n[c](),n[c]=o((()=>{M(t,e,a(s),i)}))}else M(t,e,s,i)},L=(t,e,i,o)=>{if(n&&s.has(e))s.get(e)(t,i,o);else if(o[e]!==i)switch(o[e]=i,e){case"class":e+="Name";case"className":case"textContent":x(t,e,i,o,!1);break;case"ref":i.current=t;break;default:e.startsWith("on")?t[e.toLowerCase()]=i:e in t?x(t,e,i,o,!1):null==i?t.removeAttribute(e):x(t,e,i,o,!0)}},j=(t,e,s)=>function(n){const i={},o=P(e,this);(this.updates[s]=s=>{const{attributes:n}=B(e,s);for(const e of t){const{name:t,value:s}=n[e];L(o,t,s,i)}})(n)},q=(t,s)=>function(n){let o=w,c=!0,a=-1;const r=P(t,this),l=new Map;(this.updates[s]=s=>{const{value:n}=B(t,s),u=[];for(let t=0;t<n.length;t++){const e=n[t];c&&(c=!c,a=e.attributes.findIndex(I));const s=a<0?t:e.attributes[a].value;let{id:i,view:o}=l.get(s)||d;i!==e.id?(o=h(o,e,!1),l.set(s,{id:e.id,view:o})):o.update(e),u.push(...o.$)}if(u.length)o=i(o,u,r);else if(o!==w){const t=e.createRange();t.setStartBefore(o[0]),t.setEndAfter(o[o.length-1]),t.deleteContents(),l.clear(),o=w,c=!0}})(n)},z=(t,e)=>function(s){let n=w,o=p;const c=P(t,this);(this.updates[e]=e=>{o=u(o,B(t,e)),n=i(n,o.$,c)})(s)},F=(t,e)=>function(s){const n=P(t,this);(this.updates[e]=e=>{R(n,B(t,e).value)})(s)},W=(t,e)=>function(s){let n,r,l=N;const u=P(t,this),{value:f}=B(t,s),d=t=>{n!==t&&(l(),n=t,l=o(r))};if(v(c(f))){let t=w,e=p;r=()=>{const s=a(n);e=h(e,s,!1),t=i(t,e.$,u)}}else r=()=>{R(u,a(n))};this.updates[e]=e=>d(B(t,e).value),d(f)},G=(t,e)=>function(s){let n=w,o=p,c=null;const a=P(t,this);(this.updates[e]=e=>{e=B(t,e).value,c!==e.id?(c=e.id,o=h(o,e,!1),n=i(n,o.$,a)):e.type===O?o.update(C(e)):o.update(e)})(s)},D=({children:t},e,s,n,i)=>{for(let o=0;o<t.length;o++){const c=t[o];if(c.type===A)s.appendChild(l(c.value));else s.appendChild(J(t[o],e,[],n.concat(o),i))}},J=(t,s,n,i,o)=>{let c,a;const{length:u}=s;t:switch(t.type){case $:{const{value:e}=t;switch(!0){case v(e):c=G;break;case T(e):c=q;break;case r(e):c=W;break;default:a=l(""),s.push(F(i,u));break t}}case O:a=l(""),s.push((c||z)(i,u));break;case k:{const{attributes:c,name:r}=t,l=[r],h=[];for(let t=0;t<c.length;t++){const e=c[t];e.type===$||e.dynamic?I(e)||n.push(t):("is"===e.name&&l.push({is:e.value}),h.push(e))}n.length&&s.push(j(n,i,u)),a=o||(o="svg"===r)?e.createElementNS("http://www.w3.org/2000/svg",...l):e.createElement(...l);for(const{name:t,value:e}of h)M(a,t,e,!0);D(t,s,a,i,o);break}case _:a=e.createDocumentFragment(),D(t,s,a,i,o)}return a};return(t,e)=>{const s="function"==typeof t?t():t;v||(v=E.bind(S(s)));const n=h(g.get(e)||p,s,!0);g.set(e,n),e.replaceChildren(...n.$)}};const j=(t={})=>L({...t,Signal:n,effect:b,isSignal:void 0});export{p as Effect,f as FX,n as Signal,s as batch,a as computed,j as createRender,b as effect,v as signal};
