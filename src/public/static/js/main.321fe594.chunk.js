(this["webpackJsonpsse-express-frontend"]=this["webpackJsonpsse-express-frontend"]||[]).push([[0],{223:function(e,t,n){},260:function(e,t,n){"use strict";n.r(t);var c=n(94),a=n(46),r=n.n(a),s=n(121),o=n.n(s),i=(n(223),n(217)),u=n(173),d=(n(224),n(216));function j(e){return Object(c.jsx)(d.a,{licenseKey:"non-commercial-and-evaluation",data:e.data.map((function(e){var t=e.country,n=e.code,c=e.currency,a=e.level,r=e.units;return[t,n,c,a.toFixed(3),r]})),colHeaders:!0,rowHeaders:!0,width:"600",height:"300"})}var b=function(){var e=Object(a.useState)([]),t=Object(u.a)(e,2),n=t[0],r=t[1],s=Object(a.useState)(!1),o=Object(u.a)(s,2),d=o[0],b=o[1];return Object(a.useEffect)((function(){d||(new EventSource("/api/v1/sse/events").onmessage=function(e){var t=JSON.parse(e.data);Array.isArray(t)?r(t):r([].concat(Object(i.a)(n),[t]))},b(!0))}),[d,n]),Object(c.jsx)("div",{className:"app",children:Object(c.jsx)(j,{data:n})})},f=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,261)).then((function(t){var n=t.getCLS,c=t.getFID,a=t.getFCP,r=t.getLCP,s=t.getTTFB;n(e),c(e),a(e),r(e),s(e)}))};o.a.render(Object(c.jsx)(r.a.StrictMode,{children:Object(c.jsx)(b,{})}),document.getElementById("root")),f()}},[[260,1,2]]]);
//# sourceMappingURL=main.321fe594.chunk.js.map