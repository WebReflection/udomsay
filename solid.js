let e=1,t=!1,n=!1,o=[],r=null,s=null,l=0,i=null,u=null;function c(r,c){i||function(){const e=new MessageChannel,t=e.port2;if(i=()=>t.postMessage(null),e.port1.onmessage=()=>{if(null!==u){const e=performance.now();l=e+5;const n=!0;try{u(n,e)?t.postMessage(null):u=null}catch(e){throw t.postMessage(null),e}}},navigator&&navigator.scheduling&&navigator.scheduling.isInputPending){const e=navigator.scheduling;s=()=>{const t=performance.now();return t>=l&&(!!e.isInputPending()||t>=300)}}else s=()=>performance.now()>=l}();let a=performance.now(),d=1073741823;c&&c.timeout&&(d=c.timeout);const h={id:e++,fn:r,startTime:a,expirationTime:a+d};return function(e,t){e.splice(function(){let n=0,o=e.length-1;for(;n<=o;){const r=o+n>>1,s=t.expirationTime-e[r].expirationTime;if(s>0)n=r+1;else{if(!(s<0))return r;o=r-1}}return n}(),0,t)}(o,h),t||n||(t=!0,u=f,i()),h}function a(e){e.fn=null}function f(e,l){t=!1,n=!0;try{return function(e,t){let n=t;r=o[0]||null;for(;null!==r&&(!(r.expirationTime>n)||e&&!s());){const e=r.fn;if(null!==e){r.fn=null;e(r.expirationTime<=n),n=performance.now(),r===o[0]&&o.shift()}else o.shift();r=o[0]||null}return null!==r}(e,l)}finally{r=null,n=!1}}const d={};function h(e){d.context=e}const p=(e,t)=>e===t,g=Symbol("solid-proxy"),v=Symbol("solid-track"),b=Symbol("solid-dev-component"),w={equals:p};let y=null,m=pe;const k={owned:null,cleanups:null,context:null,owner:null},S={};var x=null;let O=null,A=null,P=null,T=null,E=null,M=null,N=0;const[F,C]=$(!1);function j(e,t){const n=T,o=x,r=0===e.length,s=r?k:{owned:null,cleanups:null,context:null,owner:t||o},l=r?e:()=>e((()=>_((()=>we(s)))));x=s,T=null;try{return he(l,!0)}finally{T=n,x=o}}function $(e,t){const n={value:e,observers:null,observerSlots:null,comparator:(t=t?Object.assign({},w,t):w).equals||void 0};return[ie.bind(n),e=>("function"==typeof e&&(e=O&&O.running&&O.sources.has(n)?e(n.tValue):e(n.value)),ue(n,e))]}function V(e,t,n){const o=fe(e,t,!0,1);A&&O&&O.running?E.push(o):ce(o)}function q(e,t,n){const o=fe(e,t,!1,1);A&&O&&O.running?E.push(o):ce(o)}function I(e,t,n){m=ge;const o=fe(e,t,!1,1),r=re&&Se(x,re.id);r&&(o.suspense=r),o.user=!0,M?M.push(o):ce(o)}function B(e,t){let n;const o=fe((()=>{n?n():_(e),n=void 0}),void 0,!1,0),r=re&&Se(x,re.id);return r&&(o.suspense=r),o.user=!0,e=>{n=e,ce(o)}}function L(e,t,n){n=n?Object.assign({},w,n):w;const o=fe(e,t,!0,0);return o.observers=null,o.observerSlots=null,o.comparator=n.equals||void 0,A&&O&&O.running?(o.tState=1,E.push(o)):ce(o),ie.bind(o)}function R(e,t,n){let o,r,s;2===arguments.length&&"object"==typeof t||1===arguments.length?(o=!0,r=e,s=t||{}):(o=e,r=t,s=n||{});let l=null,i=S,u=null,c=!1,a=!1,f="initialValue"in s,h="function"==typeof o&&L(o);const p=new Set,[g,v]=(s.storage||$)(s.initialValue),[b,w]=$(void 0),[y,m]=$(void 0,{equals:!1}),[k,A]=$(f?"ready":"unresolved");if(d.context){let e;u=`${d.context.id}${d.context.count++}`,"initial"===s.ssrLoadFrom?i=s.initialValue:d.load&&(e=d.load(u))&&(i=e[0])}function P(e,t,n,o){return l===e&&(l=null,f=!0,e!==i&&t!==i||!s.onHydrated||queueMicrotask((()=>s.onHydrated(o,{value:t}))),i=S,O&&e&&c?(O.promises.delete(e),c=!1,he((()=>{O.running=!0,E(t,n)}),!1)):E(t,n)),t}function E(e,t){he((()=>{t||v((()=>e)),A(t?"errored":"ready"),w(t);for(const e of p.keys())e.decrement();p.clear()}),!1)}function M(){const e=re&&Se(x,re.id),t=g(),n=b();if(n&&!l)throw n;return T&&!T.user&&e&&V((()=>{y(),l&&(e.resolved&&O&&c?O.promises.add(l):p.has(e)||(e.increment(),p.add(e)))})),t}function N(e=!0){if(!1!==e&&a)return;a=!1;const t=h?h():o;if(c=O&&O.running,null==t||!1===t)return void P(l,_(g));O&&l&&O.promises.delete(l);const n=i!==S?i:_((()=>r(t,{value:g(),refetching:e})));return"object"==typeof n&&n&&"then"in n?(l=n,a=!0,queueMicrotask((()=>a=!1)),he((()=>{A(f?"refreshing":"pending"),m()}),!1),n.then((e=>P(n,e,void 0,t)),(e=>P(n,void 0,me(e),t)))):(P(l,n,void 0,t),n)}return Object.defineProperties(M,{state:{get:()=>k()},error:{get:()=>b()},loading:{get(){const e=k();return"pending"===e||"refreshing"===e}},latest:{get(){if(!f)return M();const e=b();if(e&&!l)throw e;return g()}}}),h?V((()=>N(!1))):N(!1),[M,{refetch:N,mutate:v}]}function z(e,t){let n,o=t?t.timeoutMs:void 0;const r=fe((()=>(n&&n.fn||(n=c((()=>l((()=>r.value))),void 0!==o?{timeout:o}:void 0)),e())),void 0,!0),[s,l]=$(r.value,t);return ce(r),l((()=>r.value)),s}function W(e,t=p,n){const o=new Map,r=fe((n=>{const r=e();for(const[e,s]of o.entries())if(t(e,r)!==t(e,n))for(const e of s.values())e.state=1,e.pure?E.push(e):M.push(e);return r}),void 0,!0,1);return ce(r),e=>{const n=T;if(n){let t;(t=o.get(e))?t.add(n):o.set(e,t=new Set([n])),U((()=>{t.delete(n),!t.size&&o.delete(e)}))}return t(e,O&&O.running&&O.sources.has(r)?r.tValue:r.value)}}function D(e){return he(e,!1)}function _(e){const t=T;T=null;try{return e()}finally{T=t}}function G(e,t,n){const o=Array.isArray(e);let r,s=n&&n.defer;return n=>{let l;if(o){l=Array(e.length);for(let t=0;t<e.length;t++)l[t]=e[t]()}else l=e();if(s)return void(s=!1);const i=_((()=>t(l,r,n)));return r=l,i}}function H(e){I((()=>_(e)))}function U(e){return null===x||(null===x.cleanups?x.cleanups=[e]:x.cleanups.push(e)),e}function K(e){y||(y=Symbol("error")),null===x||(null===x.context?x.context={[y]:[e]}:x.context[y]?x.context[y].push(e):x.context[y]=[e])}function J(){return T}function Q(){return x}function X(e,t){const n=x;x=e;try{return he(t,!0)}catch(e){ke(e)}finally{x=n}}function Y(e=c){A=e}function Z(e){if(O&&O.running)return e(),O.done;const t=T,n=x;return Promise.resolve().then((()=>{let o;return T=t,x=n,(A||re)&&(o=O||(O={sources:new Set,effects:[],promises:new Set,disposed:new Set,queue:new Set,running:!0}),o.done||(o.done=new Promise((e=>o.resolve=e))),o.running=!0),he(e,!1),T=x=null,o?o.done:void 0}))}function ee(){return[F,Z]}function te(e,t){const n=Symbol("context");return{id:n,Provider:Oe(n),defaultValue:e}}function ne(e){let t;return void 0!==(t=Se(x,e.id))?t:e.defaultValue}function oe(e){const t=L(e),n=L((()=>xe(t())));return n.toArray=()=>{const e=n();return Array.isArray(e)?e:null!=e?[e]:[]},n}let re;function se(){return re||(re=te({}))}function le(e){if(P){const t=P;P=(n,o)=>{const r=t(n,o),s=e((e=>r.track(e)),o);return{track:e=>s.track(e),dispose(){s.dispose(),r.dispose()}}}}else P=e}function ie(){const e=O&&O.running;if(this.sources&&(!e&&this.state||e&&this.tState))if(!e&&1===this.state||e&&1===this.tState)ce(this);else{const e=E;E=null,he((()=>ve(this)),!1),E=e}if(T){const e=this.observers?this.observers.length:0;T.sources?(T.sources.push(this),T.sourceSlots.push(e)):(T.sources=[this],T.sourceSlots=[e]),this.observers?(this.observers.push(T),this.observerSlots.push(T.sources.length-1)):(this.observers=[T],this.observerSlots=[T.sources.length-1])}return e&&O.sources.has(this)?this.tValue:this.value}function ue(e,t,n){let o=O&&O.running&&O.sources.has(e)?e.tValue:e.value;if(!e.comparator||!e.comparator(o,t)){if(O){const o=O.running;(o||!n&&O.sources.has(e))&&(O.sources.add(e),e.tValue=t),o||(e.value=t)}else e.value=t;e.observers&&e.observers.length&&he((()=>{for(let t=0;t<e.observers.length;t+=1){const n=e.observers[t],o=O&&O.running;o&&O.disposed.has(n)||((o&&!n.tState||!o&&!n.state)&&(n.pure?E.push(n):M.push(n),n.observers&&be(n)),o?n.tState=1:n.state=1)}if(E.length>1e6)throw E=[],new Error}),!1)}return t}function ce(e){if(!e.fn)return;we(e);const t=x,n=T,o=N;T=x=e,ae(e,O&&O.running&&O.sources.has(e)?e.tValue:e.value,o),O&&!O.running&&O.sources.has(e)&&queueMicrotask((()=>{he((()=>{O&&(O.running=!0),T=x=e,ae(e,e.tValue,o),T=x=null}),!1)})),T=n,x=t}function ae(e,t,n){let o;try{o=e.fn(t)}catch(t){e.pure&&(O&&O.running?(e.tState=1,e.tOwned&&e.tOwned.forEach(we),e.tOwned=void 0):(e.state=1,e.owned&&e.owned.forEach(we),e.owned=null)),ke(t)}(!e.updatedAt||e.updatedAt<=n)&&(null!=e.updatedAt&&"observers"in e?ue(e,o,!0):O&&O.running&&e.pure?(O.sources.add(e),e.tValue=o):e.value=o,e.updatedAt=n)}function fe(e,t,n,o=1,r){const s={fn:e,state:o,updatedAt:null,owned:null,sources:null,sourceSlots:null,cleanups:null,value:t,owner:x,context:null,pure:n};if(O&&O.running&&(s.state=0,s.tState=o),null===x||x!==k&&(O&&O.running&&x.pure?x.tOwned?x.tOwned.push(s):x.tOwned=[s]:x.owned?x.owned.push(s):x.owned=[s]),P){const[e,t]=$(void 0,{equals:!1}),n=P(s.fn,t);U((()=>n.dispose()));const o=()=>Z(t).then((()=>r.dispose())),r=P(s.fn,o);s.fn=t=>(e(),O&&O.running?r.track(t):n.track(t))}return s}function de(e){const t=O&&O.running;if(!t&&0===e.state||t&&0===e.tState)return;if(!t&&2===e.state||t&&2===e.tState)return ve(e);if(e.suspense&&_(e.suspense.inFallback))return e.suspense.effects.push(e);const n=[e];for(;(e=e.owner)&&(!e.updatedAt||e.updatedAt<N);){if(t&&O.disposed.has(e))return;(!t&&e.state||t&&e.tState)&&n.push(e)}for(let o=n.length-1;o>=0;o--){if(e=n[o],t){let t=e,r=n[o+1];for(;(t=t.owner)&&t!==r;)if(O.disposed.has(t))return}if(!t&&1===e.state||t&&1===e.tState)ce(e);else if(!t&&2===e.state||t&&2===e.tState){const t=E;E=null,he((()=>ve(e,n[0])),!1),E=t}}}function he(e,t){if(E)return e();let n=!1;t||(E=[]),M?n=!0:M=[],N++;try{const t=e();return function(e){E&&(A&&O&&O.running?function(e){for(let t=0;t<e.length;t++){const n=e[t],o=O.queue;o.has(n)||(o.add(n),A((()=>{o.delete(n),he((()=>{O.running=!0,de(n)}),!1),O&&(O.running=!1)})))}}(E):pe(E),E=null);if(e)return;let t;if(O)if(O.promises.size||O.queue.size){if(O.running)return O.running=!1,O.effects.push.apply(O.effects,M),M=null,void C(!0)}else{const e=O.sources,n=O.disposed;M.push.apply(M,O.effects),t=O.resolve;for(const e of M)"tState"in e&&(e.state=e.tState),delete e.tState;O=null,he((()=>{for(const e of n)we(e);for(const t of e){if(t.value=t.tValue,t.owned)for(let e=0,n=t.owned.length;e<n;e++)we(t.owned[e]);t.tOwned&&(t.owned=t.tOwned),delete t.tValue,delete t.tOwned,t.tState=0}C(!1)}),!1)}const n=M;M=null,n.length&&he((()=>m(n)),!1);t&&t()}(n),t}catch(e){E||(M=null),ke(e)}}function pe(e){for(let t=0;t<e.length;t++)de(e[t])}function ge(e){let t,n=0;for(t=0;t<e.length;t++){const o=e[t];o.user?e[n++]=o:de(o)}for(d.context&&h(),t=0;t<n;t++)de(e[t])}function ve(e,t){const n=O&&O.running;n?e.tState=0:e.state=0;for(let o=0;o<e.sources.length;o+=1){const r=e.sources[o];r.sources&&(!n&&1===r.state||n&&1===r.tState?r!==t&&de(r):(!n&&2===r.state||n&&2===r.tState)&&ve(r,t))}}function be(e){const t=O&&O.running;for(let n=0;n<e.observers.length;n+=1){const o=e.observers[n];(!t&&!o.state||t&&!o.tState)&&(t?o.tState=2:o.state=2,o.pure?E.push(o):M.push(o),o.observers&&be(o))}}function we(e){let t;if(e.sources)for(;e.sources.length;){const t=e.sources.pop(),n=e.sourceSlots.pop(),o=t.observers;if(o&&o.length){const e=o.pop(),r=t.observerSlots.pop();n<o.length&&(e.sourceSlots[r]=n,o[n]=e,t.observerSlots[n]=r)}}if(O&&O.running&&e.pure){if(e.tOwned){for(t=0;t<e.tOwned.length;t++)we(e.tOwned[t]);delete e.tOwned}ye(e,!0)}else if(e.owned){for(t=0;t<e.owned.length;t++)we(e.owned[t]);e.owned=null}if(e.cleanups){for(t=0;t<e.cleanups.length;t++)e.cleanups[t]();e.cleanups=null}O&&O.running?e.tState=0:e.state=0,e.context=null}function ye(e,t){if(t||(e.tState=0,O.disposed.add(e)),e.owned)for(let t=0;t<e.owned.length;t++)ye(e.owned[t])}function me(e){return e instanceof Error||"string"==typeof e?e:new Error("Unknown error")}function ke(e){e=me(e);const t=y&&Se(x,y);if(!t)throw e;for(const n of t)n(e)}function Se(e,t){return e?e.context&&void 0!==e.context[t]?e.context[t]:Se(e.owner,t):void 0}function xe(e){if("function"==typeof e&&!e.length)return xe(e());if(Array.isArray(e)){const t=[];for(let n=0;n<e.length;n++){const o=xe(e[n]);Array.isArray(o)?t.push.apply(t,o):t.push(o)}return t}return e}function Oe(e,t){return function(t){let n;return q((()=>n=_((()=>(x.context={[e]:t.value},oe((()=>t.children)))))),void 0),n}}function Ae(e){return{subscribe(t){if(!(t instanceof Object)||null==t)throw new TypeError("Expected the observer to be an object.");const n="function"==typeof t?t:t.next&&t.next.bind(t);if(!n)return{unsubscribe(){}};const o=j((t=>(I((()=>{const t=e();_((()=>n(t)))})),t)));return Q()&&U(o),{unsubscribe(){o()}}},[Symbol.observable||"@@observable"](){return this}}}function Pe(e){const[t,n]=$(void 0,{equals:!1});if("subscribe"in e){const t=e.subscribe((e=>n((()=>e))));U((()=>"unsubscribe"in t?t.unsubscribe():t()))}else{U(e(n))}return t}const Te=Symbol("fallback");function Ee(e){for(let t=0;t<e.length;t++)e[t]()}function Me(e,t,n={}){let o=[],r=[],s=[],l=0,i=t.length>1?[]:null;return U((()=>Ee(s))),()=>{let u,c,a=e()||[];return a[v],_((()=>{let e,t,d,h,p,g,v,b,w,y=a.length;if(0===y)0!==l&&(Ee(s),s=[],o=[],r=[],l=0,i&&(i=[])),n.fallback&&(o=[Te],r[0]=j((e=>(s[0]=e,n.fallback()))),l=1);else if(0===l){for(r=new Array(y),c=0;c<y;c++)o[c]=a[c],r[c]=j(f);l=y}else{for(d=new Array(y),h=new Array(y),i&&(p=new Array(y)),g=0,v=Math.min(l,y);g<v&&o[g]===a[g];g++);for(v=l-1,b=y-1;v>=g&&b>=g&&o[v]===a[b];v--,b--)d[b]=r[v],h[b]=s[v],i&&(p[b]=i[v]);for(e=new Map,t=new Array(b+1),c=b;c>=g;c--)w=a[c],u=e.get(w),t[c]=void 0===u?-1:u,e.set(w,c);for(u=g;u<=v;u++)w=o[u],c=e.get(w),void 0!==c&&-1!==c?(d[c]=r[u],h[c]=s[u],i&&(p[c]=i[u]),c=t[c],e.set(w,c)):s[u]();for(c=g;c<y;c++)c in d?(r[c]=d[c],s[c]=h[c],i&&(i[c]=p[c],i[c](c))):r[c]=j(f);r=r.slice(0,l=y),o=a.slice(0)}return r}));function f(e){if(s[c]=e,i){const[e,n]=$(c);return i[c]=n,t(a[c],e)}return t(a[c])}}}function Ne(e,t,n={}){let o,r=[],s=[],l=[],i=[],u=0;return U((()=>Ee(l))),()=>{const c=e()||[];return c[v],_((()=>{if(0===c.length)return 0!==u&&(Ee(l),l=[],r=[],s=[],u=0,i=[]),n.fallback&&(r=[Te],s[0]=j((e=>(l[0]=e,n.fallback()))),u=1),s;for(r[0]===Te&&(l[0](),l=[],r=[],s=[],u=0),o=0;o<c.length;o++)o<r.length&&r[o]!==c[o]?i[o]((()=>c[o])):o>=r.length&&(s[o]=j(a));for(;o<r.length;o++)l[o]();return u=i.length=l.length=c.length,r=c.slice(0),s=s.slice(0,u)}));function a(e){l[o]=e;const[n,r]=$(c[o]);return i[o]=r,t(n,o)}}}let Fe=!1;function Ce(){Fe=!0}function je(e,t){if(Fe&&d.context){const n=d.context;h({...d.context,id:`${d.context.id}${d.context.count++}-`,count:0});const o=_((()=>e(t||{})));return h(n),o}return _((()=>e(t||{})))}function $e(){return!0}const Ve={get:(e,t,n)=>t===g?n:e.get(t),has:(e,t)=>t===g||e.has(t),set:$e,deleteProperty:$e,getOwnPropertyDescriptor:(e,t)=>({configurable:!0,enumerable:!0,get:()=>e.get(t),set:$e,deleteProperty:$e}),ownKeys:e=>e.keys()};function qe(e){return(e="function"==typeof e?e():e)?e:{}}function Ie(...e){let t=!1;for(let n=0;n<e.length;n++){const o=e[n];t=t||!!o&&g in o,e[n]="function"==typeof o?(t=!0,L(o)):o}if(t)return new Proxy({get(t){for(let n=e.length-1;n>=0;n--){const o=qe(e[n])[t];if(void 0!==o)return o}},has(t){for(let n=e.length-1;n>=0;n--)if(t in qe(e[n]))return!0;return!1},keys(){const t=[];for(let n=0;n<e.length;n++)t.push(...Object.keys(qe(e[n])));return[...new Set(t)]}},Ve);const n={};for(let t=e.length-1;t>=0;t--)if(e[t]){const o=Object.getOwnPropertyDescriptors(e[t]);for(const t in o)t in n||Object.defineProperty(n,t,{enumerable:!0,get(){for(let n=e.length-1;n>=0;n--){const o=(e[n]||{})[t];if(void 0!==o)return o}}})}return n}function Be(e,...t){const n=new Set(t.flat());if(g in e){const o=t.map((t=>new Proxy({get:n=>t.includes(n)?e[n]:void 0,has:n=>t.includes(n)&&n in e,keys:()=>t.filter((t=>t in e))},Ve)));return o.push(new Proxy({get:t=>n.has(t)?void 0:e[t],has:t=>!n.has(t)&&t in e,keys:()=>Object.keys(e).filter((e=>!n.has(e)))},Ve)),o}const o=Object.getOwnPropertyDescriptors(e);return t.push(Object.keys(o).filter((e=>!n.has(e)))),t.map((t=>{const n={};for(let r=0;r<t.length;r++){const s=t[r];s in e&&Object.defineProperty(n,s,o[s]?o[s]:{get:()=>e[s],set:()=>!0,enumerable:!0})}return n}))}function Le(e){let t,n;const o=o=>{const r=d.context;if(r){const[o,s]=$();(n||(n=e())).then((e=>{h(r),s((()=>e.default)),h()})),t=o}else if(!t){const[o]=R((()=>(n||(n=e())).then((e=>e.default))));t=o}let s;return L((()=>(s=t())&&_((()=>{if(!r)return s(o);const e=d.context;h(r);const t=s(o);return h(e),t}))))};return o.preload=()=>n||((n=e()).then((e=>t=()=>e.default)),n),o}let Re,ze=0;function We(){const e=d.context;return e?`${e.id}${e.count++}`:"cl-"+ze++}function De(e){const t="fallback"in e&&{fallback:()=>e.fallback};return L(Me((()=>e.each),e.children,t||void 0))}function _e(e){const t="fallback"in e&&{fallback:()=>e.fallback};return L(Ne((()=>e.each),e.children,t||void 0))}function Ge(e){let t=!1;const n=e.keyed,o=L((()=>e.when),void 0,{equals:(e,n)=>t?e===n:!e==!n});return L((()=>{const r=o();if(r){const o=e.children,s="function"==typeof o&&o.length>0;return t=n||s,s?_((()=>o(r))):o}return e.fallback}),void 0,void 0)}function He(e){let t=!1,n=!1;const o=oe((()=>e.children)),r=L((()=>{let e=o();Array.isArray(e)||(e=[e]);for(let t=0;t<e.length;t++){const o=e[t].when;if(o)return n=!!e[t].keyed,[t,o,e[t]]}return[-1]}),void 0,{equals:(e,n)=>e[0]===n[0]&&(t?e[1]===n[1]:!e[1]==!n[1])&&e[2]===n[2]});return L((()=>{const[o,s,l]=r();if(o<0)return e.fallback;const i=l.children,u="function"==typeof i&&i.length>0;return t=n||u,u?_((()=>i(s))):i}),void 0,void 0)}function Ue(e){return e}function Ke(){Re&&[...Re].forEach((e=>e()))}function Je(e){let t,n;d.context&&d.load&&(n=d.load(d.context.id+d.context.count))&&(t=n[0]);const[o,r]=$(t,void 0);return Re||(Re=new Set),Re.add(r),U((()=>Re.delete(r))),L((()=>{let t;if(t=o()){const n=e.fallback,o="function"==typeof n&&n.length?_((()=>n(t,(()=>r())))):n;return K(r),o}return K(r),e.children}),void 0,void 0)}const Qe=(e,t)=>e.showContent===t.showContent&&e.showFallback===t.showFallback,Xe=te();function Ye(e){let t,[n,o]=$((()=>({inFallback:!1})));const r=ne(Xe),[s,l]=$([]);r&&(t=r.register(L((()=>n()().inFallback))));const i=L((n=>{const o=e.revealOrder,r=e.tail,{showContent:l=!0,showFallback:i=!0}=t?t():{},u=s(),c="backwards"===o;if("together"===o){const e=u.every((e=>!e())),t=u.map((()=>({showContent:e&&l,showFallback:i})));return t.inFallback=!e,t}let a=!1,f=n.inFallback;const d=[];for(let e=0,t=u.length;e<t;e++){const n=c?t-e-1:e,o=u[n]();if(a||o){const e=!a;e&&(f=!0),d[n]={showContent:e,showFallback:!(r&&(!e||"collapsed"!==r))&&i},a=!0}else d[n]={showContent:l,showFallback:i}}return a||(f=!1),d.inFallback=f,d}),{inFallback:!1});return o((()=>i)),je(Xe.Provider,{value:{register:e=>{let t;return l((n=>(t=n.length,[...n,e]))),L((()=>i()[t]),void 0,{equals:Qe})}},get children(){return e.children}})}function Ze(e){let t,n,o,r,s,l=0;const[i,u]=$(!1),c=se(),a={increment:()=>{1==++l&&u(!0)},decrement:()=>{0==--l&&u(!1)},inFallback:i,effects:[],resolved:!1},f=Q();if(d.context&&d.load){const e=d.context.id+d.context.count;let t=d.load(e);if(t&&(o=t[0])&&"$$f"!==o){"object"==typeof o&&"then"in o||(o=Promise.resolve(o));const[t,l]=$(void 0,{equals:!1});r=t,o.then((t=>{if(t||d.done)return t&&(s=t),l();d.gather(e),h(n),l(),h()}))}}const p=ne(Xe);let g;return p&&(t=p.register(a.inFallback)),U((()=>g&&g())),je(c.Provider,{value:a,get children(){return L((()=>{if(s)throw s;if(n=d.context,r)return r(),r=void 0;n&&"$$f"===o&&h();const l=L((()=>e.children));return L((r=>{const s=a.inFallback(),{showContent:i=!0,showFallback:u=!0}=t?t():{};return(!s||o&&"$$f"!==o)&&i?(a.resolved=!0,g&&g(),g=n=o=void 0,c=a.effects,M.push.apply(M,c),c.length=0,l()):u?g?r:j((t=>(g=t,n&&(h({id:n.id+"f",count:0}),n=void 0),e.fallback)),f):void 0;var c}))}))}})}let et;var tt=(0,Object.freeze)([]),nt=()=>{};const ot=(e,t,n)=>{const{parentNode:o}=n,r=t.length;let s=e.length,l=r,i=0,u=0,c=null;for(;i<s||u<l;)if(s===i){const e=l<r?u?t[u-1].nextSibling:t[l-u]:n;for(;u<l;)o.insertBefore(t[u++],e)}else if(l===u)for(;i<s;)c&&c.has(e[i])||e[i].remove(),i++;else if(e[i]===t[u])i++,u++;else if(e[s-1]===t[l-1])s--,l--;else if(e[i]===t[l-1]&&t[u]===e[s-1]){const n=e[--s].nextSibling;o.insertBefore(t[u++],e[i++].nextSibling),o.insertBefore(t[--l],n),e[s]=t[l]}else{if(!c){c=new Map;let e=u;for(;e<l;)c.set(t[e],e++)}if(c.has(e[i])){const n=c.get(e[i]);if(u<n&&n<l){let r=i,a=1;for(;++r<s&&r<l&&c.get(e[r])===n+a;)a++;if(a>n-u){const r=e[i];for(;u<n;)o.insertBefore(t[u++],r)}else o.replaceChild(t[u++],e[i++])}else i++}else e[i++].remove()}return t},{isArray:rt}=Array,{entries:st,getPrototypeOf:lt,prototype:{isPrototypeOf:it}}=Object,{COMPONENT:ut,ELEMENT:ct,FRAGMENT:at,INTERPOLATION:ft,STATIC:dt}=class{static ATTRIBUTE=1;static COMPONENT=2;static ELEMENT=3;static FRAGMENT=4;static INTERPOLATION=5;static STATIC=6;get properties(){const{attributes:e}=this;if(e.length){const t={};for(const n of e)n.type<2?t[n.name]=n.value:Object.assign(t,n.value);return t}return null}},ht=({childNodes:e},t)=>e[t],pt=({children:e},t)=>e[t],gt=({value:e,properties:t,children:n})=>e(t,...n),vt=({name:e})=>"key"===e,bt=(e,{content:t})=>e.reduce(ht,t),wt=(e,t)=>e.reduce(pt,t),yt=(e,t)=>{const n=null==t?"":String(t);n!==e.data&&(e.data=n)};
/*! (c) Andrea Giammarchi - ISC */var mt=(e={})=>{const t=e.document||globalThis.document,n=new Map(e.plugins||[]),o=!!n.size,r=e.diff||ot,s=e.effect||(e=>(e(),nt)),l=e.getPeek||(e=>e.peek()),i=e.getValue||(e=>e.value),u=e.isSignal||(e.Signal?it.bind(e.Signal.prototype):()=>!1),c=e=>t.createTextNode(e),a=(e,t)=>{e.dispose();const n=s((()=>{const n=gt(t);n.id!==e.id?e=f(e,n,!1):e.update(n)}));return e.dispose=n,e},f=(e,t,n)=>t.type===ut?a(e,t):((e,t,n)=>(e.dispose(),e=new d(t),n?e.dispose=s((()=>e.update(t))):e.update(t),e))(e,t,n);class d{constructor(e,t=!0){const[n,o]=t?w(e):[tt,null];this._=t&&e.type===at,this.id=e.id,this.updates=n,this.content=o,this.dispose=nt}get $(){const{content:e,_:t}=this;return t?(this._=!t,(this.content=(({childNodes:e})=>({childNodes:[...e]}))(e)).childNodes):[e]}update(e){for(const t of this.updates)t.call(this,e)}}const h=new d({id:null},!1),p={id:null,view:h},g=new WeakMap;let v;const b=new WeakMap,w=e=>{let t=b.get(e.id);if(!t){const n=[],o=M(e,n,[],tt,!1);b.set(e.id,t=[n,o])}const[n,o]=t;return[n.slice(),o.cloneNode(!0)]},y=(e,t,n,o)=>{o?e.setAttribute(t,n):e[t]=n},m=(e,t,n,o,r)=>{if(u(n)){const l="🙊"+t;l in o&&o[l](),o[l]=s((()=>{y(e,t,i(n),r)}))}else y(e,t,n,r)},k=(e,t,r,s)=>{if(o&&n.has(t))n.get(t)(e,r,s);else if(s[t]!==r)switch(s[t]=r,t){case"class":t+="Name";case"className":case"textContent":m(e,t,r,s,!1);break;case"ref":r.current=e;break;default:t.startsWith("on")?e[t.toLowerCase()]=r:t in e?m(e,t,r,s,!1):null==r?e.removeAttribute(t):m(e,t,r,s,!0)}},S=(e,t,n)=>function(o){const r={},s=bt(t,this);(this.updates[n]=n=>{const{attributes:o}=wt(t,n);for(const t of e){const e=o[t],{type:n,value:l}=e;if(n<2)k(s,e.name,l,r);else for(const[e,t]of st(l))k(s,e,t,r)}})(o)},x=(e,n)=>function(o){let s=tt,l=!0,i=-1;const u=bt(e,this),c=new Map;(this.updates[n]=n=>{const{value:o}=wt(e,n),a=[];for(let e=0;e<o.length;e++){const t=o[e];l&&(l=!l,i=t.attributes.findIndex(vt));const n=i<0?e:t.attributes[i].value;let{id:r,view:s}=c.get(n)||p;r!==t.id?(s=f(s,t,!1),c.set(n,{id:t.id,view:s})):s.update(t),a.push(...s.$)}if(a.length)s=r(s,a,u);else if(s!==tt){const e=t.createRange();e.setStartBefore(s[0]),e.setEndAfter(s[s.length-1]),e.deleteContents(),c.clear(),s=tt,l=!0}})(o)},O=(e,t)=>function(n){let o=tt,s=h;const l=bt(e,this);(this.updates[t]=t=>{s=a(s,wt(e,t)),o=r(o,s.$,l)})(n)},A=(e,t)=>function(n){const o=bt(e,this);(this.updates[t]=t=>{yt(o,wt(e,t).value)})(n)},P=(e,t)=>function(n){let o,u,a=nt;const d=bt(e,this),{value:p}=wt(e,n),g=e=>{o!==e&&(a(),o=e,a=s(u))};if(v(l(p))){let e=tt,t=h;u=()=>{const n=i(o);t=f(t,n,!1),e=r(e,t.$,d)}}else{const e=c("");d.replaceWith(e),u=()=>{yt(e,i(o))}}this.updates[t]=t=>g(wt(e,t).value),g(p)},T=(e,t)=>function(n){let o=tt,s=h,l=null;const i=bt(e,this);(this.updates[t]=t=>{t=wt(e,t).value,l!==t.id?(l=t.id,s=f(s,t,!1),o=r(o,s.$,i)):t.type===ut?s.update(gt(t)):s.update(t)})(n)},E=({children:e},t,n,o,r)=>{for(let s=0;s<e.length;s++){const l=e[s];if(l.type===dt)n.appendChild(c(l.value));else n.appendChild(M(e[s],t,[],o.concat(s),r))}},M=(e,n,o,r,s)=>{let l,i;const{length:a}=n;e:switch(e.type){case ft:{const{value:t}=e;switch(!0){case v(t):l=T;break;case rt(t):l=x;break;case u(t):l=P;break;default:i=c(""),n.push(A(r,a));break e}}case ut:i=t.createComment("🙊"),n.push((l||O)(r,a));break;case ct:{const{attributes:l,name:u}=e,c=[u],f=[];for(let e=0;e<l.length;e++){const t=l[e];t.type===ft||t.dynamic?vt(t)||o.push(e):("is"===t.name&&c.push({is:t.value}),f.push(t))}o.length&&n.push(S(o,r,a)),i=s||(s="svg"===u)?t.createElementNS("http://www.w3.org/2000/svg",...c):t.createElement(...c);for(const{name:e,value:t}of f)y(i,e,t,!0);E(e,n,i,r,s);break}case at:i=t.createDocumentFragment(),E(e,n,i,r,s)}return i};return(e,t)=>{const n="function"==typeof e?e():e;v||(v=it.bind(lt(n)));const o=f(g.get(t)||h,n,!0);g.set(t,o),t.replaceChildren(...o.$)}};const{defineProperty:kt}=Object,St=new WeakSet,xt=Symbol(),Ot=(e,...t)=>{const[n,o]=$(e,...t);return St.add(n),[kt(n,xt,{get:()=>e}),t=>o(e=t)]},At=(e={})=>mt({...e,effect:I,getPeek:e=>e[xt],getValue:e=>e(),isSignal:e=>St.has(e)});export{b as $DEVCOMP,g as $PROXY,v as $TRACK,et as DEV,Je as ErrorBoundary,De as For,_e as Index,Ue as Match,Ge as Show,Ze as Suspense,Ye as SuspenseList,He as Switch,D as batch,a as cancelCallback,oe as children,je as createComponent,V as createComputed,te as createContext,z as createDeferred,I as createEffect,L as createMemo,B as createReaction,At as createRender,q as createRenderEffect,R as createResource,j as createRoot,W as createSelector,Ot as createSignal,We as createUniqueId,le as enableExternalSource,Ce as enableHydration,Y as enableScheduling,p as equalFn,Pe as from,J as getListener,Q as getOwner,Ne as indexArray,Le as lazy,Me as mapArray,Ie as mergeProps,Ae as observable,G as on,U as onCleanup,K as onError,H as onMount,c as requestCallback,Ke as resetErrorBoundaries,X as runWithOwner,d as sharedConfig,Be as splitProps,Z as startTransition,_ as untrack,ne as useContext,ee as useTransition};
