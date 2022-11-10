/*! @comandeer/mocha-lib-tester v0.7.0 | (c) 2022 Comandeer | MIT license (see LICENSE) */
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("chalk"),t=require("@comandeer/cli-spinner"),r=require("enumify"),s=require("chokidar"),n=require("threads"),o=require("istanbul-lib-coverage"),i=require("eslint"),a=require("path"),c=require("istanbul-lib-report"),u=require("istanbul-reports"),l=require("util"),d=require("glob"),h=require("mocha"),p=require("pirates"),f=require("@babel/register"),w=require("@babel/preset-env"),m=require("istanbul-lib-instrument"),y=require("https"),g=require("child_process"),b=require("fs"),E=require("stream"),v=require("is-ci");function _(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var S=_(e),C=_(t),q=_(s),x=_(c),L=_(u),R=_(d),T=_(h),j=_(f),O=_(w),k=_(v);const P=Symbol("listeners"),A=Symbol("onceListeners");class W{constructor(){this[P]=new Map,this[A]=new Map}on(e,t){this._getListenersCollection(e).add(t)}once(e,t){this.on(e,t);this._getListenersCollection(e,this[A]).add(t)}off(e,t){const r=this._getListenersCollection(e),s=this._getListenersCollection(e,this[A]);r.delete(t),s.delete(t)}async emit(e,...t){const r=this._getListenersCollection(e),s=this._getListenersCollection(e,this[A]);for(const n of r)await n(...t),s.has(n)&&this.off(e,n)}_getListenersCollection(e,t=this[P]){if(t.has(e))return t.get(e);const r=new Set;return t.set(e,r),r}}const $=Symbol("steps"),M=Symbol("stepResults");class U extends W{constructor(){super(),this[$]=Object.freeze(new Set),this[M]={}}get steps(){return this[$]}addStep(e){if(!D(e,[...this.steps].map((({id:e})=>e))))throw new TypeError("Provided object must be a valid step definition");this.steps.add(e)}addSteps(e){if(!(Array.isArray(e)&&e.every((e=>D(e)))))throw new TypeError("Provided array must contain only valid step definitions");e.forEach((e=>{this.addStep(e)}))}async run(e=process.cwd()){if(!("string"==typeof(t=e)&&t.trim().length>0))throw new TypeError("Provided path must be a non-empty string");var t;await this.emit("start");const r=[...this.steps];return this._processSteps(r,e)}async _processSteps(e,t){const r=async e=>(await this.emit("end",e),e),s=e.shift(),n=this._constructContext(t);if(!s)return r(!0);await this.emit("step:start",s,n);try{const o=this._constructRequiresParameter(s),i=await s.run(t,o);if(!function(e){if(!e||"object"!=typeof e)return!1;return e.results&&"object"==typeof e.results}(i))throw new TypeError(`Step ${s.name} didn't return correct results`);if(this[M][s.id]=i,await this.emit("step:end",s,i,n),!i.ok)return r(!1);if(0===e.length)return r(!0)}catch(e){return await this.emit("error",e),r(!1)}return this._processSteps(e,t)}_constructRequiresParameter({requires:e}){return e?e.reduce(((e,t)=>({...e,...{[t]:this[M][t]}})),{}):{}}_constructContext(e){return{projectPath:e}}}function D(e,t){if(!e||"object"!=typeof e)return!1;const r=function(e){if("string"!=typeof e||0===e.trim().length)return!1;const t=e===e.toLowerCase(),r=!/\s/.test(e);return t&&r}(e.id),s="string"==typeof e.name&&e.name.trim().length>0,n="function"==typeof e.run,o="function"==typeof e.report,i=!Array.isArray(t)||function(e,t){if(void 0===e)return!0;if(void 0!==e&&!Array.isArray(e))return!1;return e.every((e=>t.includes(e)))}(e.requires,t);return r&&s&&n&&o&&i}class G extends r.Enumify{}G.AUTO=new G,G.BLUE=new G,G.YELLOW=new G,G.GREEN=new G,G.RED=new G,G.closeEnum();class N extends r.Enumify{}N.LOG=new N,N.ERROR=new N,N.closeEnum();const B=new Map([[G.AUTO,e=>e],[G.BLUE,e=>S.default.blue(e)],[G.YELLOW,e=>S.default.yellow(e)],[G.GREEN,e=>S.default.green(e)],[G.RED,e=>S.default.red(e)]]),I=new C.default({label:"Working…"});class Y{constructor(e){if(!(e instanceof W))throw new TypeError("The passed runner parameter is not an EventEmitter instance");this.runner=e,function(e){const t=e.runner;t.on("start",e.onStart.bind(e)),t.on("step:start",e.onStepStart.bind(e)),t.on("step:end",e.onStepEnd.bind(e)),t.on("end",e.onEnd.bind(e)),t.on("error",e.onError.bind(e))}(this)}log(e,{type:t=N.LOG,color:r=G.AUTO}={}){if(!(t instanceof N))throw new TypeError("Type option must be a LoggerType instance");if(!(r instanceof G))throw new TypeError("Color option must a LoggerColor instance");const s=t===N.LOG?"log":"error",n=B.get(r);console[s](n(e))}async onStart(){this.log("Executing tests…",{color:G.YELLOW})}async onStepStart({name:e}){this.log(`---${e}---`,{color:G.BLUE}),await I.show()}async onStepEnd({name:e,report:t},r,s){if(await I.hide(),await t(r,this,s),!r.ok)return this.log(`Step ${S.default.bold(e)} failed with errors. Skipping subsequent steps.`,{color:G.RED,type:N.ERROR});this.log(`Step ${S.default.bold(e)} finished successfully.`,{color:G.GREEN})}async onEnd(e){if(await I.hide(),!e)return this.log("There were some errors alonside the way 😿",{color:G.RED});this.log("All steps finished correctly 🎉",{color:G.GREEN})}async onError(e){await I.hide(),this.log("🚨 Error occured:",{color:G.RED,type:N.ERROR}),this.log(e,{type:N.ERROR})}}async function F(e,t){if("string"!=typeof e||0===e.length)throw new TypeError("Provided path must be a non-empty string");if(!t||"object"!=typeof t||Array.isArray(t))throw new TypeError("Provided code coverage data must be an object");return{name:"code coverage",ok:!0,results:o.createCoverageMap(t)}}const z=[{id:"lint",name:"Linter",watchable:!0,run:e=>H("./workers/linter.js",e),report:async function({results:e},t){const r=new i.ESLint,s=(await r.loadFormatter("stylish")).format(e);t.log(s)}},{id:"test",name:"Tester",watchable:!0,run:e=>H("./workers/tester.js",e),report({output:e},t){t.log(e)}},{id:"coverage",name:"Code Coverage",watchable:!0,requires:["test"],run:(e,{test:{coverage:t}})=>F(e,t),report:function({results:e},t,{projectPath:r}){const s=x.default.createContext({dir:a.resolve(r,".coverage"),defaultSummarizer:"nested",watermarks:{statements:[50,80],functions:[50,80],branches:[50,80],lines:[50,80]},coverageMap:e}),n=L.default.create("lcovonly"),o=L.default.create("text");n.execute(s),o.execute(s)}},{id:"codecov",name:"CodeCov",watchable:!1,requires:["coverage"],run:e=>H("./workers/codecov.js",e),report:function({results:e},t){e.skipped?t.log("CodeCov upload skipped",{color:G.YELLOW}):(t.log(e.stdout),e.stderr&&t.log(e.stderr,{type:N.ERROR,color:G.RED}))}}];async function H(e,...t){const r=new n.Worker(e),s=await n.spawn(r),o=await s(...t);return await n.Thread.terminate(s),o}const V=Symbol("config"),J=Symbol("bannerEmitted"),K=Symbol("isInTheMiddleOfRun"),Q=Symbol("scheduledRun");class X{constructor(e,t,r={}){if(!(e instanceof U))throw new TypeError("The runner parameter must be a valid Runner instance.");if(!(t instanceof Y))throw new TypeError("The logger parameter must be a valid Logger instance.");if(!r||Array.isArray(r)||"object"!=typeof r)throw new TypeError("The config parameter must be an object.");this.runner=e,this.logger=t,this.watcher=null,this.continuous=!1,this[V]=r,this[J]=!1,this[K]=!1,this._init(r)}async run(){if(this[J]||(this.logger.log("MLT v0.7.0"),this[J]=!0),this[K])return;this[K]=!0;const e=await this.runner.run(this.path)?0:1;return this[K]=!1,e}watch(){const e=q.default.watch("{bin,src,tests}/**/*.js",{persistent:!0,ignoreInitial:!0,cwd:process.cwd()});return e.on("all",(()=>{this.scheduleRun()})),this.continuous=!0,this.watcher=e,e}scheduleRun(){if(!this[Q]){if(!this[K])return this.run();this[Q]=!0,this.runner.once("end",(()=>{this[Q]=!1,this.run()}))}}start(){return this[V].isWatch&&this.watch(),this.run()}_init({path:e=process.cwd(),requestedSteps:t=["lint","test","coverage","codecov"],isWatch:r=!1}={}){this.path=e;const s=function({requestedSteps:e,isWatch:t=!1}={}){const r=e.map((e=>z.find((t=>t.id===e))||e)),s=r.filter((e=>"string"==typeof e));if(s.length>0){const e=s.map((e=>`"${e}"`)).join(", ");throw new TypeError(`Provided step names (${e}) are incorrect`)}if(t)return r.filter((e=>e.watchable));return r}({requestedSteps:t,isWatch:r});this.runner.addSteps(s)}}const Z=l.promisify(R.default);function ee(e){return e.every((({errorCount:e})=>0===e))}const{Base:te,Spec:re}=h.reporters;class se extends re{constructor(e){const t=[],r={};let s=!0;const n=te.consoleLog;te.consoleLog=function(...e){t.push(l.format(...e))},super(e),e.on("test end",(({file:e,state:t,title:s})=>{void 0===r[e]&&(r[e]={}),r[e][s]=t})),e.once("fail",(()=>{s=!1})),e.once("end",(()=>{te.consoleLog=n,e.suite.results={results:r,ok:s,output:t.join("\n")}}))}}const ne='import{expect}from"chai";import{use as chaiUse}from"chai";import sinon from"sinon";import chaiAsPromised from"chai-as-promised";import sinonChai from"sinon-chai";import{noCallThru as pqNoCallThru}from"proxyquire";chaiUse(chaiAsPromised),chaiUse(sinonChai);const proxyquire=pqNoCallThru();',oe=new Set;const ie=b.promises.chmod,ae=l.promisify(E.pipeline);exports.codeCoverage=F,exports.codecov=async function(e){if("string"!=typeof e||0===e.length)throw new TypeError("Provided path must be a non-empty string");const t={name:"codecov"};if(!k.default||process.env.NO_CODECOV)return Object.assign({},t,{ok:!0,results:{skipped:!0}});const r=await async function(e,t){["linux","darwin","win32"].includes(e)||(e="linux");const r={linux:"codecov",darwin:"codecov",win32:"codecov.exe"}[e],s=`https://uploader.codecov.io/latest/${{linux:"linux",darwin:"macos",win32:"windows"}[e]}/${r}`;try{const e=await(n=s,new Promise(((e,t)=>{y.get(n,(r=>{if(200!==r.statusCode)return t();e(r)})).on("error",t)}))),o=a.resolve(t,r),i=b.createWriteStream(o);return await ae(e,i),o}catch(e){throw new Error("Can't download Codecov uploader")}var n}(process.platform,e);await ie(r,"755");const{exitCode:s,stdout:n,stderr:o}=await function(e,t){return new Promise((r=>{const s=g.exec(e,{cwd:t},((e,t,n)=>{r({exitCode:s.exitCode,stdout:t,stderr:n})}))}))}(r,e);return Object.assign({},t,{ok:0===s,results:{stdout:n,stderr:o}})},exports.linter=async function(e){if("string"!=typeof e||0===e.length)throw new TypeError("Provided path must be a non-empty string");const t=new i.ESLint({useEslintrc:!1,cwd:e,baseConfig:{extends:"@comandeer/eslint-config"},overrideConfig:{ignorePatterns:["tests/__fixtures__/**/*.js"]}}),r=await async function(e){const t=["src/**/*.js","bin/**/*","tests/**/*.js"],r=t.map((t=>Z(t,{cwd:e})));return(await Promise.all(r)).reduce(((e,r,s)=>0===r.length?e:[...e,t[s]]),[])}(e),s=await t.lintFiles(r);return{name:"linter",ok:ee(s),results:s}},exports.mlt=function(e){const t=new U,r=new Y(t);return new X(t,r,e)},exports.tester=async function(e){if("string"!=typeof e||0===e.length)throw new TypeError("Provided path must be a non-empty string");!function(e){if(oe.has(e))return;const t=a.resolve(e,"tests"),r=a.resolve(t,"__fixtures__");p.addHook((e=>e.startsWith(ne)?e:`${ne}${e}`),{exts:[".js"],matcher:e=>e.startsWith(t)&&!e.startsWith(r)}),oe.add(e)}(e),j.default({cache:!1,caller:{name:"mlt",supportsStaticESM:!1,supportsDynamicImport:!0},babelrc:!1,presets:[[O.default,{targets:{node:"16.12.0"}}]]}),function(e){const t=a.resolve(e,"src"),r=m.createInstrumenter({coverageVariable:"__mltCoverage__"});p.addHook(((e,t)=>r.instrumentSync(e,t)),{exts:[".js"],matcher:e=>e.startsWith(t)})}(e),function(e){Object.keys(require.cache).forEach((t=>{t.startsWith(e)&&delete require.cache[t]}))}(e);const t=new T.default({reporter:se,timeout:3e4});var r;return(await(r=e,Z("tests/**/*.js",{cwd:r,ignore:["tests/__fixtures__/**/*.js","tests/__helpers__/**/*.js"],realpath:!0}))).forEach((e=>{t.addFile(e)})),new Promise((e=>{t.run((()=>{e({name:"tester",...t.suite.results,coverage:global.__mltCoverage__})}))}))};
//# sourceMappingURL=mocha-lib-tester.js.map
