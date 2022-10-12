System.register("chunks:///_virtual/main",["./uiCameraControl.ts"],(function(){"use strict";return{setters:[null],execute:function(){}}}));

System.register("chunks:///_virtual/uiCameraControl.ts",["./rollupPluginModLoBabelHelpers.js","cc"],(function(t){"use strict";var o,n,i,e;return{setters:[function(t){o=t.inheritsLoose},function(t){n=t.cclegacy,i=t._decorator,e=t.Component}],execute:function(){var s;n._RF.push({},"8149eoySj9OMJxcqmKkFX9P","uiCameraControl",void 0);var c=i.ccclass;i.property,t("Button_Start",c("Button_Start")(s=function(t){function n(){return t.apply(this,arguments)||this}o(n,t);var i=n.prototype;return i.start=function(){},i.onClick_Start=function(){this.node.setPosition(680,0,1e3)},i.onClick_Maker=function(){this.node.setPosition(0,-1e3,1e3)},i.onClick_Battle_Back=function(){this.node.setPosition(680,0,1e3)},i.onClick_Ai_In=function(){this.node.setPosition(0,1020,1e3)},i.onClick_Ai_Back_to_select=function(){this.node.setPosition(680,0,1e3)},i.onClick_Double=function(){this.node.setPosition(680,1020,1e3)},i.onClick_Back_To_Start=function(){this.node.setPosition(0,0,1e3)},i.update=function(t){},n}(e))||s);n._RF.pop()}}}));

(function(r) {
  r('virtual:///prerequisite-imports/main', 'chunks:///_virtual/main'); 
})(function(mid, cid) {
    System.register(mid, [cid], function (_export, _context) {
    return {
        setters: [function(_m) {
            var _exportObj = {};

            for (var _key in _m) {
              if (_key !== "default" && _key !== "__esModule") _exportObj[_key] = _m[_key];
            }
      
            _export(_exportObj);
        }],
        execute: function () { }
    };
    });
});