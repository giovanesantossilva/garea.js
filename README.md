# Garea.js

> A simple selection of area in JavaScript

## Table of contents

- [Main](#main)
- [Getting started](#getting-started)
- [Options](#options)
- [Methods](#methods)
- [Events](#events)
- [License](#license)

## Main

```text
dist/
├── garea.js        (UMD)
├── garea.common.js (CommonJS, default)
└── garea.esm.js    (ES Module)
```

## Getting started

### Installation
 
```shell
npm install garea.js
```
or
```shell
yarn add garea.js
```

In browser:

```html
<script src="garea.js"></script>
```

### Usage

#### Syntax

```js
new Garea(idCanvas [, config]);
```

#### Example

```html
<div>
  <img id="image" width="400" height="600" src="picture.jpg">
  <canvas id="crop" width="400" height="600"></canvas>
</div>
```

```css
#image {
  user-select: 'none';
  position: 'absolute';
}

#crop {
  z-index: '9';
  position: 'absolute';
}
```

```js
import { Garea } from 'garea.js';

const area = new Garea('crop', { r: 7, m: 30 });
area.draw();
area.onListener('onchange', points => {
    console.log(points);
});
```

## Options

You may set garea options with `new Garea(idCanvas, config)`.
If you want to change the global default options, You may use `Garea.config = config`.


### r - raio

- Type: `Number`
- Default: `5`

Description: `size of the points in the area.`

### m - margin

- Type: `Number`
- Default: `30`

Description: `standard margin when points are not passed.`

## Methods

### draw()

Draw the area.

````js
const area = new Garea('crop');
area.draw();
````

### reset()

Reset area to default while keeping margins.
````js
const area = new Garea('crop');
area.reset();
````

### set config(config)

Configurations of area

- **config**
    - Type: `Object`

````js
const area = new Garea('crop');
area.config = { r: 7, m: 30 };
````

### set resolution(resolution)

Resolution of canvas

- **resolution**
    - Type: `Object`

````js
const area = new Garea('crop');
area.resolution = { w: 400, h: 600 };
````

### set points(points)

- **points**
    - Type: `Array`
    
````js
const area = new Garea('crop');
area.points = [{x: 30, y: 30}, {x: 570, y: 30}, {x: 570, y: 370}, {x: 30, y: 370}]
````

## Events

### onListener(event, callback)

Listen to the actions of the area.

````js
const area = new Garea('crop');
area.onListener('onchange', () => {});
````

- **events**:
  - Type: `String`'
  - Options:
      - `'onchange'`: when the value of some of the points changes
      - `'onmousedown'`: when you click on one of the points
      - `'onmouseup'`: when you release the clicked point
      
## License

[MIT](https://opensource.org/licenses/MIT) © [Giovane Santos](https://giovanesantossilva.github.io/)