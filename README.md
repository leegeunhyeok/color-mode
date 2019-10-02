# ColorMode
🎨 Add color theme systme to your page with ColorMode!

## Install
```bash
npm install color-mode
```

## Usage
### ColorMode
ColorMode Class
> ColorMode instance must be create once.

| Parameter | Type | Required |
|:--|:--:|:--:|
| option | object | O |

#### option
| Property | Type | Required | Default | Description |
|:--|:--:|:--:|:--|:--|
| initialTheme | string | X | `default` | Initial theme name  |
| fallbackTheme | string | X | `default` | Fallback theme name |
| animation | number | X | `0` | Theme transform effect duration |
| tags | [object]() | O | none | Theme tags |
| themes | [object]() | O | none | Themes |

##### option.tags

| Key | Value | Type | Required |
|:--|:--:|:--:|:--:|:--|
| `custom tag name` | CSS Property or Style object | string \| object | O |

- (string) CSS Property: `'color'`, `'background-color'`, `'box-shadow'`, ...
- (object) Style object: `{ color: 'dodgerblue', backgroundColor: '#e0e0e0', ... }`
  - Property name must be *CamelCase* `(background-color > backgroundColor)`
  - You can using theme's color with `@` (ex: `@NAME` find 'NAME' color from theme)

```javascript
// Sample
const option = {
  // ...
  tags: {
    myTag: ...,
    fg: 'color', // string (CSS Property)
    bg: 'background-color',
    detail: { // object (Style object)
      backgroundColor: '#2f2f2f',
      color: '@primary' // Find 'primary' color from 'option.themes.*'
    }
  }
}
```

##### option.themes

| Key | Value | Type | Required |
|:--|:--:|:--:|:--:|:--|
| default | CSS Style (color code, etc..) | string | O |
| `custom theme name` | CSS Style (color code, etc..) | string | X |

- `default` theme required
- Define `custom theme name` if you want to add theme
  - Each theme has style name(s)

```javascript
// Sample
const option = {
  // ...
  themes: {
    default: { // required!
      tint: '#007aff',
      tint10: '#d8e7f9',
      onTint: '#ffffff',
      bgPrimary: '#e5e9f2',
      bgSecondary: '#ffffff',
      bgTertiary: '#eef3fc'
    },
    dark: {
      tint: '#6db3ff',
      tint10: '#e4ecf9',
      onTint: '#ffffff',
      bgPrimary: '#262b3a',
      bgSecondary: '#484d5d',
      bgTertiary: '#353a4b'
    },
    myTheme: { ... }
  }
}
```

