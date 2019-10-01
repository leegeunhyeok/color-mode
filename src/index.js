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

    this._ROOT_ATTRIBUTE = 'theme'
    this._DATA_PREFIX = 'color'
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
    const style = document.createElement('style')
    const styleAttribute = document.createAttribute('type')
    styleAttribute.value = 'text/css'
    style.attributes.setNamedItem(styleAttribute)

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

    const detailStyleGeneratedStatus = {}

    Object.keys(this._TAGS).forEach(tag => {
      Object.keys(targetTheme).forEach(color => {
        const value = this._TAGS[tag]

        if (typeof value === 'string') {
          css += `${parentSelector} [data-${this._DATA_PREFIX}="${tag}:${color}"]{`
          css += `${value}:${targetTheme[color]};}`
        } else if (typeof value === 'object') {
          if (detailStyleGeneratedStatus[tag]) {
            return
          }

          detailStyleGeneratedStatus[tag] = true
          css += `${parentSelector} [data-${this._DATA_PREFIX}="${tag}"]{`
          Object.keys(value).forEach(k => {
            let color = k
            if (value[k].charAt(0) === '@') {
              color = targetTheme[value[k].slice(1)]

              if (!color) {
                throw new Error(
                  `Color name '${k.slice(1)}' not found in '${themeName}' theme`
                )
              }
            }
            css += `${toBarCase(k)}:${color};`
          })
          css += '}'
        } else {
          // TODO: Throw type error
        }
      })
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
