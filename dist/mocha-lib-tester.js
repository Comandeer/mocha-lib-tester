/*! @comandeer/mocha-lib-tester v0.5.0 | (c) 2021 Comandeer | MIT license (see LICENSE) */
"use strict";var e=require("events"),t=require("chalk"),r=require("gauge"),n=require("enumify"),s=require("chokidar"),o=require("eslint"),i=require("glob"),a=require("eslint/lib/cli-engine/formatters/stylish.js"),c=require("mocha"),u=require("util"),l=require("path"),d=require("pirates"),h=require("@babel/register"),p=require("@babel/preset-env"),f=require("istanbul-lib-instrument"),m=require("istanbul-lib-coverage"),g=require("istanbul-lib-report"),y=require("istanbul-reports"),w=require("child_process"),b=require("is-ci"),E=require("npm-run-path");function v(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var T=v(e),S=v(t),q=v(r),R=v(s),C=v(a),j=v(c),L=v(h),x=v(p),O=v(g),k=v(y),P=v(b),W=v(E);const _=Symbol("steps");class A extends T.default{constructor(){super(),this[_]=Object.freeze(new Set)}get steps(){return this[_]}addStep(e){if(!U(e))throw new TypeError("Provided object must be a valid step definition");this.steps.add(e)}addSteps(e){if(!(Array.isArray(e)&&e.every((e=>U(e)))))throw new TypeError("Provided array must contain only valid step definitions");e.forEach((e=>{this.addStep(e)}))}run(e=process.cwd()){if(!("string"==typeof(t=e)&&t.trim().length>0))throw new TypeError("Provided path must be a non-empty string");var t;this.emit("start");const r=[...this.steps];return this._processSteps(r,e)}async _processSteps(e,t){const r=e=>(this.emit("end",e),e),n=e.shift();if(!n)return r(!0);this.emit("step:start",n);try{const s=await n.run(t);if(!function(e){if(!e||"object"!=typeof e)return!1;const t=e.results&&"object"==typeof e.results,r="function"==typeof e.reporter;return t&&r}(s))throw new TypeError(`Step ${n.name} didn't return correct results`);if(this.emit("step:end",n,s),!s.ok)return r(!1);if(0===e.length)return r(!0)}catch(e){return this.emit("error",e),r(!1)}return this._processSteps(e,t)}}function U(e){if(!e||"object"!=typeof e)return!1;const t=function(e){if("string"!=typeof e||0===e.trim().length)return!1;const t=e===e.toLowerCase(),r=!/\s/.test(e);return t&&r}(e.id),r="string"==typeof e.name&&e.name.trim().length>0,n="function"==typeof e.run;return t&&r&&n}class $ extends n.Enumify{}$.AUTO=new $,$.BLUE=new $,$.YELLOW=new $,$.GREEN=new $,$.RED=new $,$.closeEnum();class D extends n.Enumify{}D.LOG=new D,D.ERROR=new D,D.closeEnum();const G=new Map([[$.AUTO,e=>e],[$.BLUE,e=>S.default.blue(e)],[$.YELLOW,e=>S.default.yellow(e)],[$.GREEN,e=>S.default.green(e)],[$.RED,e=>S.default.red(e)]]),N=new q.default(process.stdout,{template:[{type:"activityIndicator",kerning:1,length:1},{type:"section",kerning:1,default:"Working…"}]});let M;class B{constructor(e){if(!(e instanceof T.default))throw new TypeError("The passed runner parameter is not an EventEmitter instance");this.runner=e,function(e){const t=e.runner;t.on("start",e.onStart.bind(e)),t.on("step:start",e.onStepStart.bind(e)),t.on("step:end",e.onStepEnd.bind(e)),t.on("end",e.onEnd.bind(e)),t.on("error",e.onError.bind(e))}(this)}log(e,{type:t=D.LOG,color:r=$.AUTO}={}){if(!(t instanceof D))throw new TypeError("Type option must be a LoggerType instance");if(!(r instanceof $))throw new TypeError("Color option must a LoggerColor instance");const n=t===D.LOG?"log":"error",s=G.get(r);console[n](s(e))}onStart(){this.log("Executing tests…",{color:$.YELLOW})}onStepStart({name:e}){this.log(`---${e}---`,{color:$.BLUE}),function(){const e=()=>{N.pulse(),M=setTimeout(e,500)};N.show("Working…"),e()}()}onStepEnd({name:e},{ok:t,results:r,reporter:n}){if(clearTimeout(M),N.hide(),M=null,n(r,this),!t)return this.log(`Step ${S.default.bold(e)} failed with errors. Skipping subsequent steps.`,{color:$.RED,type:D.ERROR});this.log(`Step ${S.default.bold(e)} finished successfully.`,{color:$.GREEN})}onEnd(e){if(!e)return this.log("There were some errors alonside the way 😿",{color:$.RED});this.log("All steps finished correctly 🎉",{color:$.GREEN})}onError(e){this.log("🚨 Error occured:",{color:$.RED,type:D.ERROR}),this.log(e,{type:D.ERROR})}}function I(e,t){t.log(C.default(e))}function Y(e){if("string"!=typeof e||0===e.length)throw new TypeError("Provided path must be a non-empty string");return new o.ESLint({useEslintrc:!1,cwd:e,baseConfig:{extends:"@comandeer/eslint-config"},overrideConfig:{ignorePatterns:["tests/fixtures/**/*.js"]}}).lintFiles((t=e,["src/**/*.js","bin/**/*","tests/**/*.js"].filter((e=>i.sync(e,{cwd:t}).length>0)))).then((e=>({name:"linter",ok:z(e),results:e,reporter:I})));var t}function z(e){return e.every((({errorCount:e})=>0===e))}const{Base:F,Spec:H}=c.reporters;class V extends H{constructor(e){const t=[],r={};let n=!0;const s=F.consoleLog;F.consoleLog=function(...e){t.push(u.format(...e))},super(e),e.on("test end",(({file:e,state:t,title:n})=>{void 0===r[e]&&(r[e]={}),r[e][n]=t})),e.once("fail",(()=>{n=!1})),e.once("end",(()=>{F.consoleLog=s,e.suite.results={results:r,ok:n,reporter(e,r){r.log(t.join("\n"))}}}))}}const J='import{expect}from"chai";import{use as chaiUse}from"chai";import sinon from"sinon";import chaiAsPromised from"chai-as-promised";import sinonChai from"sinon-chai";import{noCallThru as pqNoCallThru}from"proxyquire";chaiUse(chaiAsPromised),chaiUse(sinonChai);const proxyquire=pqNoCallThru();',K=new Set;function Q(e){if("string"!=typeof e||0===e.length)throw new TypeError("Provided path must be a non-empty string");!function(e){if(K.has(e))return;const t=l.resolve(e,"tests"),r=l.resolve(t,"fixtures");d.addHook((e=>e.startsWith(J)?e:`${J}${e}`),{exts:[".js"],matcher:e=>e.startsWith(t)&&!e.startsWith(r)}),K.add(e)}(e),L.default({cache:!1,babelrc:!1,presets:[[x.default,{targets:{node:"12.0.0"}}]]}),function(e){const t=l.resolve(e,"src"),r=f.createInstrumenter({coverageVariable:"__mltCoverage__"});d.addHook(((e,t)=>r.instrumentSync(e,t)),{exts:[".js"],matcher:e=>e.startsWith(t)})}(e),function(e){Object.keys(require.cache).forEach((t=>{t.startsWith(e)&&delete require.cache[t]}))}(e);const t=new j.default({reporter:V,timeout:15e3});var r;return(r=e,i.sync("tests/**/*.js",{cwd:r,ignore:["tests/fixtures/**/*.js","tests/helpers/**/*.js"],realpath:!0})).forEach((e=>{t.addFile(e)})),new Promise((e=>{t.run((()=>{e({name:"tester",...t.suite.results})}))}))}function X(e){return function(t){const r=O.default.createContext({dir:l.resolve(e,".coverage"),defaultSummarizer:"nested",watermarks:{statements:[50,80],functions:[50,80],branches:[50,80],lines:[50,80]},coverageMap:t}),n=k.default.create("lcovonly"),s=k.default.create("text");n.execute(r),s.execute(r)}}function Z(e,t){e.skipped?t.log("CodeCov upload skipped",{color:$.YELLOW}):(t.log(e.stdout),e.stderr&&t.log(e.stderr,{type:D.ERROR,color:$.RED}))}function ee(e){if("string"!=typeof e||0===e.length)throw new TypeError("Provided path must be a non-empty string");const t={name:"codecov",reporter:Z};return!P.default||process.env.NO_CODECOV?Object.assign({},t,{ok:!0,results:{skipped:!0}}):function(e){return new Promise((t=>{const r=w.exec("codecov",{cwd:e,env:W.default.env()},((e,n,s)=>{t({exitCode:r.exitCode,stdout:n,stderr:s})}))}))}(e).then((({exitCode:e,stdout:r,stderr:n})=>Object.assign({},t,{ok:0===e,results:{stdout:r,stderr:n}})))}const te=[{id:"lint",name:"Linter",watchable:!0,run:e=>Y(e)},{id:"test",name:"Tester",watchable:!0,run:e=>Q(e)},{id:"coverage",name:"Code Coverage",watchable:!0,run:e=>function(e,t){if("string"!=typeof e||0===e.length)throw new TypeError("Provided path must be a non-empty string");if(!t||"object"!=typeof t||Array.isArray(t))throw new TypeError("Provided code coverage data must be an object");const r=m.createCoverageMap(t);return Promise.resolve({name:"code coverage",ok:!0,results:r,reporter:X(e)})}(e,global.__mltCoverage__)},{id:"codecov",name:"CodeCov",watchable:!1,run:e=>ee(e)}];const re=Symbol("config"),ne=Symbol("bannerEmitted"),se=Symbol("isInTheMiddleOfRun"),oe=Symbol("scheduledRun");class ie{constructor(e,t,r={}){if(!(e instanceof A))throw new TypeError("The runner parameter must be a valid Runner instance.");if(!(t instanceof B))throw new TypeError("The logger parameter must be a valid Logger instance.");if(!r||Array.isArray(r)||"object"!=typeof r)throw new TypeError("The config parameter must be an object.");this.runner=e,this.logger=t,this.watcher=null,this.continuous=!1,this[re]=r,this[ne]=!1,this[se]=!1,this._init(r)}async run(){if(this[ne]||(this.logger.log("MLT v0.5.0"),this[ne]=!0),this[se])return;this[se]=!0;const e=await this.runner.run(this.path)?0:1;return this[se]=!1,e}watch(){const e=R.default.watch("{bin,src,tests}/**/*.js",{persistent:!0,ignoreInitial:!0,cwd:process.cwd()});return e.on("all",(()=>{this.scheduleRun()})),this.continuous=!0,this.watcher=e,e}scheduleRun(){if(!this[oe]){if(!this[se])return this.run();this[oe]=!0,this.runner.once("end",(()=>{this[oe]=!1,this.run()}))}}start(){return this[re].isWatch&&this.watch(),this.run()}_init({path:e=process.cwd(),requestedSteps:t=["lint","test","coverage","codecov"],isWatch:r=!1}={}){this.path=e;const n=function({requestedSteps:e,isWatch:t=!1}={}){const r=e.map((e=>te.find((t=>t.id===e))||e)),n=r.filter((e=>"string"==typeof e));if(n.length>0){const e=n.map((e=>`"${e}"`)).join(", ");throw new TypeError(`Provided step names (${e}) are incorrect`)}if(t)return r.filter((e=>e.watchable));return r}({requestedSteps:t,isWatch:r});this.runner.addSteps(n)}}module.exports=function(e){const t=new A,r=new B(t);return new ie(t,r,e)};
//# sourceMappingURL=mocha-lib-tester.js.map
