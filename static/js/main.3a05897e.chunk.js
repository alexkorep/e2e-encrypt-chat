(this["webpackJsonpe2e-encrypt-chat"]=this["webpackJsonpe2e-encrypt-chat"]||[]).push([[0],{125:function(e,t){},130:function(e,t,n){},132:function(e,t,n){"use strict";n.r(t);var a=n(1),r=n.n(a),c=n(12),i=n.n(c),o=(n(86),n(36)),u=n(49),s=n(64),l=n.n(s),d=n(34),f=n(35),p=n.n(f),b=n(48),h=n.n(b),m=(n(130),localStorage.getItem("userId")||Math.random().toString(10).slice(2));localStorage.setItem("userId",m);var v=new l.a({publishKey:"pub-c-5e44bacc-d9b4-4d11-9462-089626f7f2e6",subscribeKey:"sub-c-347badce-45ed-11ea-aea8-722f8d3d4603",uuid:m}),y=p.a.box.keyPair(),g=function(e){return"https://i.pravatar.cc/36?u=".concat(e)},x=function(e,t){var n=p.a.box.open(new Uint8Array(t.box),new Uint8Array(t.nonce),new Uint8Array(e),y.secretKey);return h.a.encodeUTF8(n)};var w={container:{flex:1,display:"flex",flexDirection:"row",height:"100vh"},conversationList:{display:"flex",flex:1,flexDirection:"column",padding:"12px",overflowY:"scroll"},chat:{display:"flex",flex:3,flexDirection:"column",borderWidth:"1px",borderColor:"#ccc",borderRightStyle:"solid",borderLeftStyle:"solid"},userrec:{padding:"8px"}},E=function(){var e=Object(a.useState)([]),t=Object(u.a)(e,2),n=t[0],c=t[1],i=Object(a.useReducer)((function(e,t){var n=t.action,a=t.uuid;if("join"===n||"state-change"===n||"here-now"===n){if(a===m)return e;e[a]=Object(o.a)({},e[a],{id:a});var r=t.state?t.state.publicKey:null;return r&&(e[a].publicKey=r),Object(o.a)({},e)}return"leave"===n||"timeout"===n?(delete e[a],Object(o.a)({},e)):e}),{}),s=Object(u.a)(i,2),l=s[0],f=s[1];Object(a.useEffect)((function(){var e={message:function(e){var t=e.message,n=t.messages;console.log("Incoming messages",n);var a=n.filter((function(e){return console.log("msg.to === userId",e.to,m),e.user.id!==m&&l[e.user.id]&&e.to===m})).map((function(e){var t=l[e.user.id].publicKey,n=e.encrypted;return Object(o.a)({},e,{text:x(t,n)})}));c((function(e){return d.GiftedChat.append(e,a)}))},presence:function(e){f(e)}};v.subscribe({channels:["chat"],withPresence:!0}),v.addListener(e);var t=Array.from(y.publicKey);return v.setState({channels:["chat"],state:{publicKey:t}}),v.hereNow({channels:["chat"],includeState:!0},(function(e,t){t.channels.chat.occupants.forEach((function(e){f({action:"here-now",uuid:e.uuid,state:{publicKey:e.state?e.state.publicKey:null}})}))})),function(){v.unsubscribe({channels:["chat"]}),v.removeListener(e)}}),[]);var b=function(e){c((function(t){return d.GiftedChat.append(t,e)})),Object.values(l).forEach((function(t){var n=t.publicKey,a=e.map((function(e){var a=e.createdAt,r=e.text,c=e.id,i=function(e,t){var n=p.a.randomBytes(24),a=p.a.box(h.a.decodeUTF8(t),n,new Uint8Array(e),y.secretKey);return{box:Array.from(a),nonce:Array.from(n)}}(n,r);return{createdAt:a,user:e.user,encrypted:i,id:c,to:t.id}}));v.publish({channel:"chat",message:{messages:a}})}))};return r.a.createElement("div",{className:"App",style:w.container},r.a.createElement("div",{style:w.conversationList},r.a.createElement("h2",null,"Participants"),Object.values(l).map((function(e){return r.a.createElement("div",{key:e.id,style:w.userrec},r.a.createElement("div",null,r.a.createElement(d.GiftedAvatar,{user:{id:e.id,avatar:g(e.id)}})),r.a.createElement("div",null,e.id),r.a.createElement("div",null,"Public key: ",(t=e.publicKey)?t.map((function(e){return e.toString(10)})).join("-"):"none"));var t}))),r.a.createElement("div",{style:w.chat},r.a.createElement(d.GiftedChat,{messages:n,onSend:function(e){return b(e)},user:{id:m,name:m.toString(),avatar:g(m)}})))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(r.a.createElement(E,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))},82:function(e,t,n){e.exports=n(132)},86:function(e,t,n){}},[[82,1,2]]]);
//# sourceMappingURL=main.3a05897e.chunk.js.map