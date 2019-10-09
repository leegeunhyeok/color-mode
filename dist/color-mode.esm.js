// @license MIT
// @version 0.1.0
// @author Geunhyeok LEE
var e=function(e){if(window.__COLOR_MODE_INIT__)throw new Error("ColorMode instance is already created");if(!e.tags)throw new Error("option.tags is required");if(!e.themes.default)throw new Error("Default theme is required");this._ROOT_ATTRIBUTE="theme",this._PREFIX="colormode",this._TAGS=e.tags,this._theme=e.initialTheme||"default",this._themes=e.themes,this._fallbackTheme=e.fallbackTheme||"default",this._duration=e.animation||0,e.initialTheme&&!e.themes[e.initialTheme]&&(console.error(e.initialTheme+" theme is not exist"),this._theme="default"),this._init(),document.documentElement.attributes.setNamedItem(this._createThemeAttribute(this._theme))};function t(t){var i=new e(t),n={getThemeList:i.getThemeList.bind(i),set:i.set.bind(i)};return Object.defineProperty(n,"currentTheme",{get:function(){return i.getCurrentTheme()}})}e.prototype._init=function(){var e=this,t=document.createElement("style"),i=document.createAttribute("type");i.value="text/css",t.attributes.setNamedItem(i);var n=this._duration/1e3;n>0&&(t.innerHTML+=("["+this._PREFIX+"] {\n        -webkit-transition: "+n+"s;\n        -moz-transition: "+n+"s;\n        -ms-transition: "+n+"s;\n        -o-transition: "+n+"s;\n        transition: "+n+"s;\n      }").replace(/\s|\n/g,"")),Object.keys(this._themes).forEach((function(i){t.innerHTML+=e._generateThemeStyleSheet(i)})),document.head.appendChild(t),window.__COLOR_MODE_INIT__=!0},e.prototype._generateThemeStyleSheet=function(e){var t=this,i="",n="["+this._ROOT_ATTRIBUTE+'="'+e+'"]';return Object.keys(this._TAGS).forEach((function(r){var o=t._TAGS[r];if("string"==typeof o)Object.keys(t._themes[e]).forEach((function(s){i+=t._convertTagToDefaultStyle(n,o,e,r,s)}));else{if("object"!=typeof o)throw new Error("tag value must be string or object. but given '"+typeof value+"'");i+=t._convertTagToDetailStyle(n,o,e,r)}})),i},e.prototype._convertTagToDefaultStyle=function(e,t,i,n,r){return e+" ["+this._PREFIX+'="'+n+":"+r+'"]{'+t+":"+this._themes[i][r]+";}"},e.prototype._convertTagToDetailStyle=function(e,t,i,n){var r=this,o=e+" ["+this._PREFIX+'="'+n+'"]{';return Object.keys(t).forEach((function(e){var n,s=[];if("string"!=typeof t[e])throw new Error("detail style value must be string, but given '"+typeof t[e]+"'");t[e].split(" ").forEach((function(e){var t=e;if("@"===e.charAt(0)&&!(t=r._themes[i][e.slice(1)]))throw new Error("Color name '"+e.slice(1)+"' not found in '"+i+"' theme");s.push(t)})),o+=(n="",e.split(/([A-Z])/g).forEach((function(e){!function(e){return e===e.toUpperCase()}(e)?n+=e:n+="-"+e.toLowerCase()})),n+":"+s.join(" ")+";")})),o+"}"},e.prototype._createThemeAttribute=function(e){var t=document.createAttribute(this._ROOT_ATTRIBUTE);return t.value=e,t},e.prototype.getCurrentTheme=function(){return this._theme},e.prototype.getThemeList=function(){return Object.keys(this._themes)},e.prototype.set=function(e){this._themes[e]||(console.error("'"+e+"' theme is not exist"),e=this._fallbackTheme),this._theme=e,document.documentElement.attributes.setNamedItem(this._createThemeAttribute(e))},window&&(window.ColorMode=t);export default t;
