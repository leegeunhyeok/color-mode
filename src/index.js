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
    this._ROOT_ATTRIBUTE = 'colormode'
    this._DATA_ATTRIBUTE = 'color-type'
    this._theme = option.initTheme || 'default'
    this._themes = option.themes
    this._fallbackTheme = option.fallbackTheme || 'default'
    this._duration = option.animation || 0

    if (!this._themes.default) {
      throw new Error('Default theme is required')
    }

    if (option.initTheme && !option.themes[option.initTheme]) {
      console.error(`${option.initTheme} theme is not exist`)
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
    const style = document.createElement('style')
    const styleAttribute = document.createAttribute('type')
    styleAttribute.value = 'text/css'
    style.attributes.setNamedItem(styleAttribute)

    let duration = this._duration / 1000
    if (duration <= 0) {
      duration = 'none'
    } else {
      duration += 's'
    }

    style.innerHTML = `[${this._DATA_ATTRIBUTE}] {
      -webkit-transition: ${duration};
      -moz-transition: ${duration};
      -ms-transition: ${duration};
      -o-transition: ${duration};
      transition: ${duration};
    }`.replace(/\s|\n/g, '')

    Object.keys(this._themes).forEach(themeName => {
      style.innerHTML += this._generateThemeStyleSheet(themeName)
    })

    document.head.appendChild(style)
    window.__COLOR_MODE_INIT__ = true
  }

  _generateThemeStyleSheet (themeName) {
    let css = ''
    const parentSelector = `[${this._ROOT_ATTRIBUTE}="${themeName}"]`
    const targetTheme = this._themes[themeName]

    function toBarCase (word) {
      let val = ''
      const isUpperCase = word => word === word.toUpperCase()

      word.split(/([A-Z])/g).forEach(el => {
        if (isUpperCase(el)) {
          val += '-' + el.toLowerCase()
        } else {
          val += el
        }
      })

      return val
    }

    Object.keys(targetTheme).forEach(name => {
      css += `${parentSelector} [${this._DATA_ATTRIBUTE}="${name}"]{`
      const style = targetTheme[name]

      if (typeof style === 'string') {
        css += `background-color:${style};`
      } else if (typeof style === 'object') {
        Object.keys(style).forEach(k => {
          css += `${toBarCase(k)}:${style[k]};`
        })
      }
      css += '}'
    })

    return css
  }

  _createThemeAttribute (value) {
    const attr = document.createAttribute(this._ROOT_ATTRIBUTE)
    attr.value = value
    return attr
  }

  get currentTheme () {
    return this._theme
  }

  getThemeList () {
    return Object.keys(this._themes)
  }

  getColorPalette (themeName) {
    return this._themes[themeName]
  }

  set (themeName) {
    if (!this._themes[themeName]) {
      console.error(`'${themeName}' theme is not exist`)
      themeName = this._fallbackTheme
    }
    this._theme = themeName

    document
      .documentElement
      .attributes
      .setNamedItem(
        this._createThemeAttribute(themeName)
      )
  }
}

export default ColorMode
