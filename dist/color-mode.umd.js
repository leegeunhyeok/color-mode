(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.ColorMode = factory());
}(this, function () { 'use strict';

  /*
  MIT License

  Copyright (c) 2019 GeunHyeok LEE

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
  */
  // @license MIT
  // @version 0.1.0
  // @author Geunhyeok LEE

  var ColorMode = function ColorMode (option) {
    if (window.__COLOR_MODE_INIT__) {
      throw new Error('ColorMode instance is already created')
    }

    if (!option.tags) {
      throw new Error('option.tags is required')
    }

    if (!option.themes.default) {
      throw new Error('Default theme is required')
    }

    this._ROOT_ATTRIBUTE = 'theme'; // <html {_ROOT_ATTRIBUTE}="themeName">
    this._PREFIX = 'colormode'; // <tag {_PREFIX}="value"/>
    this._TAGS = option.tags;
    this._theme = option.initialTheme || 'default';
    this._themes = option.themes;
    this._fallbackTheme = option.fallbackTheme || 'default';
    this._duration = option.animation || 0;

    if (option.initialTheme && !option.themes[option.initialTheme]) {
      console.error(((option.initialTheme) + " theme is not exist"));
      this._theme = 'default';
    }

    this._init();

    document
      .documentElement
      .attributes
      .setNamedItem(
        this._createThemeAttribute(this._theme)
      );
  };

  ColorMode.prototype._init = function _init () {
      var this$1 = this;

    // Create <style type="text/css">...</style> tag
    var style = document.createElement('style');
    var styleAttribute = document.createAttribute('type');
    styleAttribute.value = 'text/css';
    style.attributes.setNamedItem(styleAttribute);

    // Calculate animation duration
    var duration = this._duration / 1000;
    if (duration > 0) {
      style.innerHTML += ("[" + (this._PREFIX) + "] {\n        -webkit-transition: " + duration + "s;\n        -moz-transition: " + duration + "s;\n        -ms-transition: " + duration + "s;\n        -o-transition: " + duration + "s;\n        transition: " + duration + "s;\n      }").replace(/\s|\n/g, '');
    }

    // Generate theme CSS
    Object.keys(this._themes).forEach(function (themeName) {
      style.innerHTML += this$1._generateThemeStyleSheet(themeName);
    });

    // Add <style> tag to <head>
    document.head.appendChild(style);

    // ColorMode global init status (for init once)
    window.__COLOR_MODE_INIT__ = true;
  };

  ColorMode.prototype._generateThemeStyleSheet = function _generateThemeStyleSheet (themeName) {
      var this$1 = this;

    // css string
    var css = '';

    // [parentSelector] [theme] { style }
    var parentSelector = "[" + (this._ROOT_ATTRIBUTE) + "=\"" + themeName + "\"]";

    // All tags
    Object.keys(this._TAGS).forEach(function (tag) {
      /**
       * string: Style attribute name
       * object: Detail style object
       */
      var tagValue = this$1._TAGS[tag];

      if (typeof tagValue === 'string') { // Style attribute name
        // target theme's values
        Object.keys(this$1._themes[themeName]).forEach(function (name) {
          css += this$1._convertTagToDefaultStyle(parentSelector, tagValue, themeName, tag, name);
        });
      } else if (typeof tagValue === 'object') { // detail tag
        css += this$1._convertTagToDetailStyle(parentSelector, tagValue, themeName, tag);
      } else { // Unknown
        throw new Error(("tag value must be string or object. but given '" + (typeof value) + "'"))
      }
    });

    return css
  };

  /**
   * Tag value to CSS string (default)
   * @param {string} parentSelector Base selector
   * @param {string} cssProperty CSS Property
   * @param {string} themeName Theme name
   * @param {string} tag Tag name
   * @param {string} name Theme color name
   */
  ColorMode.prototype._convertTagToDefaultStyle = function _convertTagToDefaultStyle (parentSelector, cssProperty, themeName, tag, name) {
    var css = parentSelector + " [" + (this._PREFIX) + "=\"" + tag + ":" + name + "\"]{";
    return css + cssProperty + ":" + (this._themes[themeName][name]) + ";}"
  };

  /**
   * Tag value to CSS string (detail)
   * @param {string} parentSelector Base selector
   * @param {string} styleObject Detail style object
   * @param {string} themeName Theme name
   * @param {string} tag Tag name
   */
  ColorMode.prototype._convertTagToDetailStyle = function _convertTagToDetailStyle (parentSelector, styleObject, themeName, tag) {
      var this$1 = this;

    var css = parentSelector + " [" + (this._PREFIX) + "=\"" + tag + "\"]{";

    /**
     * Convert camelcase to CSS attribute type (ex: helloWorld -> hello-world)
     * @param {string} word Camelcase string
     */
    function toBarCase (word) {
      var val = '';
      var isUpperCase = function (word) { return word === word.toUpperCase(); };

      // Split by uppercase
      word.split(/([A-Z])/g).forEach(function (el) {
        if (isUpperCase(el)) {
          val += '-' + el.toLowerCase();
        } else {
          val += el;
        }
      });

      return val
    }

    // style object keys
    Object.keys(styleObject).forEach(function (k) {
      // styleObject[k] = (@theme color name || css property value)
      var processed = [];

      if (typeof styleObject[k] !== 'string') {
        throw new Error(("detail style value must be string, but given '" + (typeof styleObject[k]) + "'"))
      }

      styleObject[k].split(' ').forEach(function (splitedValue) {
        var temp = splitedValue;

        // Start with @ => Theme color name
        if (splitedValue.charAt(0) === '@') {
          // Find color
          temp = this$1._themes[themeName][splitedValue.slice(1)];

          // value[k] color of theme is not found
          if (!temp) {
            throw new Error(
              ("Color name '" + (splitedValue.slice(1)) + "' not found in '" + themeName + "' theme")
            )
          }
        }

        processed.push(temp);
      });

      // Add attribute with color
      css += (toBarCase(k)) + ":" + (processed.join(' ')) + ";";
    });

    return css + '}'
  };

  /**
   * Create attribute and set value
   * @param {string} value Attribute value
   * @returns {Attr}
   */
  ColorMode.prototype._createThemeAttribute = function _createThemeAttribute (value) {
    var attr = document.createAttribute(this._ROOT_ATTRIBUTE);
    attr.value = value;
    return attr
  };

  /**
   * Return current theme name
   * @returns {string}
   */
  ColorMode.prototype.getCurrentTheme = function getCurrentTheme () {
    return this._theme
  };

  /**
   * Return all of theme names
   * @returns {array}
   */
  ColorMode.prototype.getThemeList = function getThemeList () {
    return Object.keys(this._themes)
  };

  /**
   * Change color theme to {themeName}
   * @param {string} themeName Theme name
   */
  ColorMode.prototype.set = function set (themeName) {
    // If theme of themeName not found, set to fallbackTheme
    if (!this._themes[themeName]) {
      console.error(("'" + themeName + "' theme is not exist"));
      themeName = this._fallbackTheme;
    }
    this._theme = themeName;

    // Change root(html) attribute value to current theme
    document
      .documentElement
      .attributes
      .setNamedItem(
        this._createThemeAttribute(themeName)
      );
  };

  function ColorMode$1 (option) {
    var colorMode = new ColorMode(option);
    var exportObject = {
      getThemeList: colorMode.getThemeList.bind(colorMode),
      set: colorMode.set.bind(colorMode)
    };

    return Object.defineProperty(exportObject, 'currentTheme', {
      get: function get () {
        return colorMode.getCurrentTheme()
      }
    })
  }

  if (window) {
    window.ColorMode = ColorMode$1;
  }

  return ColorMode$1;

}));
