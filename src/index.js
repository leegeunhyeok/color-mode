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
// @author Geunhyeok LEE
// @license MIT

class ColorMode {
  constructor (option) {
    if (!this._themes.default) {
      throw new Error('Default theme is required')
    }

    this._ROOT_ATTRIBUTE = 'colormode'
    this._DATA_ATTRIBUTE = 'data-color'
    this._theme = option.initTheme || 'default'
    this._themes = option.themes
    this._animation = option['animation'] || 500
    document
      .documentElement
      .attributes
      .setNamedItem(
        this._createThemeAttribute(this._theme || 'default')
      )
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

  _createThemeAttribute (value) {
    const attr = document.createAttribute(this._ROOT_ATTRIBUTE)
    attr.value = value
    return attr
  }

  apply (themeName) {
    if (!this._themes[themeName]) {
      console.error(`'${themeName}' theme is not exist`)
      themeName = 'default'
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
