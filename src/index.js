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

class ColorMode {
  constructor (option) {
    if (window.__COLOR_MODE_INIT__) {
      throw new Error('ColorMode instance is already created')
    }

    if (!option.tags) {
      throw new Error('option.tags is required')
    }

    if (!option.themes.default) {
      throw new Error('Default theme is required')
    }

    this._ROOT_ATTRIBUTE = 'theme' // <html {_ROOT_ATTRIBUTE}="themeName">
    this._DATA_PREFIX = 'theme' // data-{_DATA_PREFIX}
    this._TAGS = option.tags
    this._theme = option.initialTheme || 'default'
    this._themes = option.themes
    this._fallbackTheme = option.fallbackTheme || 'default'
    this._duration = option.animation || 0

    if (option.initialTheme && !option.themes[option.initialTheme]) {
      console.error(`${option.initialTheme} theme is not exist`)
      this._theme = 'default'
    }

    this._init()

    document
      .documentElement
      .attributes
      .setNamedItem(
        this._createThemeAttribute(this._theme)
      )
  }

  _init () {
    // Create <style type="text/css">...</style> tag
    const style = document.createElement('style')
    const styleAttribute = document.createAttribute('type')
    styleAttribute.value = 'text/css'
    style.attributes.setNamedItem(styleAttribute)

    // Calculate animation duration
    const duration = this._duration / 1000
    if (duration > 0) {
      style.innerHTML += `[data-${this._DATA_PREFIX}] {
        -webkit-transition: ${duration}s;
        -moz-transition: ${duration}s;
        -ms-transition: ${duration}s;
        -o-transition: ${duration}s;
        transition: ${duration}s;
      }`.replace(/\s|\n/g, '')
    }

    // Generate theme CSS
    Object.keys(this._themes).forEach(themeName => {
      style.innerHTML += this._generateThemeStyleSheet(themeName)
    })

    // Add <style> tag to <head>
    document.head.appendChild(style)

    // ColorMode global init status (for init once)
    window.__COLOR_MODE_INIT__ = true
  }

  _generateThemeStyleSheet (themeName) {
    // css string
    let css = ''

    // [parentSelector] [theme] { style }
    const parentSelector = `[${this._ROOT_ATTRIBUTE}="${themeName}"]`

    // All tags
    Object.keys(this._TAGS).forEach(tag => {
      /**
       * string: Style attribute name
       * object: Detail style object
       */
      const tagValue = this._TAGS[tag]

      if (typeof tagValue === 'string') { // Style attribute name
        // target theme's values
        Object.keys(this._themes[themeName]).forEach(name => {
          css += this._convertTagToDefaultStyle(parentSelector, tagValue, themeName, tag, name)
        })
      } else if (typeof tagValue === 'object') { // detail tag
        css += this._convertTagToDetailStyle(parentSelector, tagValue, themeName, tag)
      } else { // Unknown
        throw new Error(`tag value must be string or object. but given '${typeof value}'`)
      }
    })

    return css
  }

  /**
   * Tag value to CSS string (default)
   * @param {string} parentSelector Base selector
   * @param {string} cssProperty CSS Property
   * @param {string} themeName Theme name
   * @param {string} tag Tag name
   * @param {string} name Theme color name
   */
  _convertTagToDefaultStyle (parentSelector, cssProperty, themeName, tag, name) {
    const css = `${parentSelector} [data-${this._DATA_PREFIX}="${tag}:${name}"]{`
    return css + `${cssProperty}:${this._themes[themeName][name]};}`
  }

  /**
   * Tag value to CSS string (detail)
   * @param {string} parentSelector Base selector
   * @param {string} styleObject Detail style object
   * @param {string} themeName Theme name
   * @param {string} tag Tag name
   */
  _convertTagToDetailStyle (parentSelector, styleObject, themeName, tag) {
    let css = `${parentSelector} [data-${this._DATA_PREFIX}="${tag}"]{`

    /**
     * Convert camelcase to CSS attribute type (ex: helloWorld -> hello-world)
     * @param {string} word Camelcase string
     */
    function toBarCase (word) {
      let val = ''
      const isUpperCase = word => word === word.toUpperCase()

      // Split by uppercase
      word.split(/([A-Z])/g).forEach(el => {
        if (isUpperCase(el)) {
          val += '-' + el.toLowerCase()
        } else {
          val += el
        }
      })

      return val
    }

    // style object keys
    Object.keys(styleObject).forEach(k => {
      // styleObject[k] = (@theme color name || css property value)
      const processed = []

      if (typeof styleObject[k] !== 'string') {
        throw new Error(`detail style value must be string, but given '${typeof styleObject[k]}'`)
      }

      styleObject[k].split(' ').forEach(splitedValue => {
        let temp = splitedValue

        // Start with @ => Theme color name
        if (splitedValue.charAt(0) === '@') {
          // Find color
          temp = this._themes[themeName][splitedValue.slice(1)]

          // value[k] color of theme is not found
          if (!temp) {
            throw new Error(
              `Color name '${splitedValue.slice(1)}' not found in '${themeName}' theme`
            )
          }
        }

        processed.push(temp)
      })

      // Add attribute with color
      css += `${toBarCase(k)}:${processed.join(' ')};`
    })

    return css + '}'
  }

  /**
   * Create attribute and set value
   * @param {string} value Attribute value
   * @returns {Attr}
   */
  _createThemeAttribute (value) {
    const attr = document.createAttribute(this._ROOT_ATTRIBUTE)
    attr.value = value
    return attr
  }

  /**
   * Return current theme name
   * @returns {string}
   */
  get currentTheme () {
    return this._theme
  }

  /**
   * Return all of theme names
   * @returns {array}
   */
  getThemeList () {
    return Object.keys(this._themes)
  }

  /**
   * Change color theme to {themeName}
   * @param {string} themeName Theme name
   */
  set (themeName) {
    // If theme of themeName not found, set to fallbackTheme
    if (!this._themes[themeName]) {
      console.error(`'${themeName}' theme is not exist`)
      themeName = this._fallbackTheme
    }
    this._theme = themeName

    // Change root(html) attribute value to current theme
    document
      .documentElement
      .attributes
      .setNamedItem(
        this._createThemeAttribute(themeName)
      )
  }
}

export default ColorMode
