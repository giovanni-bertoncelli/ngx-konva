# ngx-konva

This library provides you simple Angular bindings for [KonvaJS](https://konvajs.org/). This is still a work in progress and not an official release of Konva framework. PRs and contributions are more than welcome.

This project is inspired by the more official library [n2-konva](https://github.com/konvajs/ng2-konva) that, as for now, seems not to be maintaned.

Supported Angular version: `16`.

- [Installation](#installation)
- [Konva API implementation status](#konva-api-implementation-status)
- [Example usage](#example-usage)
- [Stage autoscale](#stage-autoscale)
- [Basic shapes](#basic-shapes)
- [Images](#images)
- [Labels](#labels)
- [Transitions (Konva.Tween)](#transitions-konvatween)
- [Events handling](#events-handling)
  - [KoHoverDirective](#kohoverdirective)
  - [KoPointerDirective](#kopointerdirective)
  - [KoDragDirective](#kodragdirective)
  - [KoTransformDirective](#kotransformdirective)
- [Inner events](#inner-events)
  - [ko-layer](#ko-layer)
  - [ko-stage](#ko-stage)
  - [ko-nestable](#ko-nestable)
- [How to contribute](#how-to-contribute)
  - [Event listeners](#event-listeners)
- [Full API Documentation](#full-api-documentation)

## Installation

```bash
npm install ngx-konva konva
```

Simply import `NgxKonvaModule` inside any module you need to use it in:

```typescript
import { NgxKonvaModule } from 'ngx-konva';

@NgModule({
  // ... your stuff
  imports: [
    // ... other modules import
    NgxKonvaModule,
  ],
  // ... other module stuff
})
export class MyModule { }
```

## Konva API implementation status

| API                                                                          | Status | Component                                                                     |
| ---------------------------------------------------------------------------- | ------ | ----------------------------------------------------------------------------- |
| [`Stage`](https://konvajs.org/api/Konva.Stage.html#main)                     | ✅      | `ko-stage`                                                                    |
| [`Layer`](https://konvajs.org/api/Konva.Layer.html#main)                     | ✅      | `ko-layer`                                                                    |
| [`Rect`](https://konvajs.org/api/Konva.Rect.html#main)                       | ✅      | `ko-rect`                                                                     |
| [`Circle`](https://konvajs.org/api/Konva.Circle.html#main)                   | ✅      | `ko-circle`                                                                   |
| [`Line`](https://konvajs.org/api/Konva.Line.html#main)                       | ✅      | `ko-line`                                                                     |
| [`RegularPolygon`](https://konvajs.org/api/Konva.RegularPolygon.html#main)   | ✅      | `ko-regular-polygon`                                                          |
| [`Text`](https://konvajs.org/api/Konva.Text.html#main)                       | ✅      | `ko-text`                                                                     |
| [`TextPath`](https://konvajs.org/api/Konva.TextPath.html#main)               | ✅      | `ko-text-path`                                                                |
| [`Ellipse`](https://konvajs.org/api/Konva.Ellipse.html#main)                 | ✅      | `ko-ellipse`                                                                  |
| [`Wedge`](https://konvajs.org/api/Konva.Wedge.html#main)                     | ✅      | `ko-wedge`                                                                    |
| [`Group`](https://konvajs.org/api/Konva.Group.html#main)                     | ✅      | `ko-group`                                                                    |
| [`Ring`](https://konvajs.org/api/Konva.Ring.html#main)                       | ✅      | `ko-ring`                                                                     |
| [`Image`](https://konvajs.org/api/Konva.Image.html#main)                     | ✅      | `ko-image`                                                                    |
| [`Label`](https://konvajs.org/api/Konva.Label.html#main)                     | ✅      | `ko-label`                                                                    |
| [`Path`](https://konvajs.org/api/Konva.Path.html#main)                       | ✅      | `ko-path`                                                                     |
| [`Sprite`](https://konvajs.org/api/Konva.Sprite.html#main)                   | ❌      |                                                                               |
| [`Star`](https://konvajs.org/api/Konva.Star.html#main)                       | ✅      | `ko-star`                                                                     |
| [`Arrow`](https://konvajs.org/api/Konva.Arrow.html#main)                     | ✅      | `ko-arrow`                                                                    |
| [`Shape`](https://konvajs.org/api/Konva.Shape.html#main)                     | ✅      | `ko-shape` (for [custom shapes](https://konvajs.org/docs/shapes/Custom.html)) |
| [`Arc`](https://konvajs.org/api/Konva.Arc.html#main)                         | ✅      | `ko-arc`                                                                      |
| [`Tween`](https://konvajs.org/api/Konva.Tween.html#main)                     | ✅      | `transitionWith` @Input                                                       |
| [`Filters`](https://konvajs.org/docs/filters/Blur.html)                      | ❌      |                                                                               |
| [`Animations`](https://konvajs.org/docs/animations/Create_an_Animation.html) | ❌      |                                                                               |

## Example usage

Each element respect the hierarchy described here: https://konvajs.org/docs/overview.html.

```html
<ko-stage [config]="{width: 100, height: 100}">
      <ko-layer>
        <ko-circle [config]="{ 
          radius: 120,
          fill: 'blue',
          stroke: 'black',
          strokeWidth: 4,
          x: 0,
          y: 0
        }"></ko-circle>
        <ko-image [config]="{x: 100, y: 100}"
          src="https://upload.wikimedia.org/wikipedia/it/0/08/Dartfener.jpg">
        </ko-image>
      </ko-layer>
</ko-stage>
```

Each item has an @Input `config` you can use dynamically to change the configuration of the Node.
All properties allowed are handled by `config`, but if you need to change the `id` of a Node use the related `id` @Input.

> **Note:** Each Node is identified by an automatically generated `id` to avoid adding the same node multiple times, use the `id` @Input accordingly.

In order to listen to events refer to [Events handling](#events-handling).

## Stage autoscale

If you do not want to handle `width/height` directly on `ko-stage` you can use the component `ko-stage-autoscale` and modifying the parent container size: the `ko-stage-autoscale` will size and scale automatically the container in order to fit it perfectly, even when the container resizes.

The first container size different from 0, 0 will be considered the initial 1 scale.

```html
<div id="container" [style.width.px]="width" [style.height.px]="height">
  <ko-stage-autoscale>
        <ko-layer>
          <ko-circle [config]="{ 
            radius: 120,
            fill: 'blue',
            stroke: 'black',
            strokeWidth: 4,
            x: 0,
            y: 0
          }"></ko-circle>
        </ko-layer>
  </ko-stage-autoscale>
</div>
```

If you want to capture the initial canvas resolution you can listen to the EventEmitter `(initDimensions)` that will return `{ width: number, height: number }` of the `scale: 1` canvas.

Since the stage is already scaled to fit the container if you need to add an additional scale to your stage you can use the handy @Input `additionalScale` from the component.

## Basic shapes

Apart for nodes that are described in the next paragraphs, for each of the basic shapes provided by Konva there is a component that can be used. Take a look to the [Konva API implementation status](#konva-api-implementation-status) to see which component you should use. 

Each of these components receives a @Input `config` compatible with the shape configuration and a `centerOrigin` @Input to offset the origin at the center of the figure.

```html
<ko-ring [config]="{
  x: 500,
  y: 500,
  innerRadius: 40,
  outerRadius: 70,
  fill: 'yellow',
  stroke: 'black',
  strokeWidth: 4,
}"></ko-ring>
<ko-shape [config]="{
  x: 10,
  y: 20,
  fill: '#00D2FF',
  width: 100,
  height: 50,
  sceneFunc: this.sceneFunc
}"></ko-shape>
```

## Images

In order to simplify the [Konva Image API](https://konvajs.org/docs/shapes/Image.html) the `[config]` provided for `ko-image` does not include `config.image`. You can use the @input `[src]` to specify the image to load and all the loading work will be done internally for you.

```html
<ko-stage [config]="{width: 100, height: 100}">
      <ko-layer>
        <ko-image [config]="{x: 100, y: 100}"
          src="https://upload.wikimedia.org/wikipedia/it/0/08/Dartfener.jpg">
        </ko-image>
      </ko-layer>
</ko-stage>
```

## Labels

You can use `ko-label` to render a [Label](https://konvajs.org/docs/shapes/Label.html) provided with a text and a tag. You can disable both of them by using the @Inputs `textDisabled` and `tagDisabled`, and you can change the configuration of each component by updating the @Input `config` for the Label, `textConfig` for the Text and `tagConfig` for the Tag.

```html
<ko-label [config]="{       
          x: 500,
          y: 500,
          opacity: 0.75,
          zIndex: 10
        }" 
        [tagConfig]="{
          fill: 'black',
          pointerDirection: 'down',
          pointerWidth: 10,
          pointerHeight: 10,
          lineJoin: 'round',
          shadowColor: 'black',
          shadowBlur: 10,
          shadowOffsetX: 10,
          shadowOffsetY: 10,
          shadowOpacity: 0.5,
        }" 
        [textConfig]="{
          text: 'Tooltip pointing down',
          fontFamily: 'Calibri',
          fontSize: 18,
          padding: 5,
          fill: 'red',
        }">
</ko-label>
```

## Transitions (Konva.Tween)

In order to use [Tween](https://konvajs.org/api/Konva.Tween.html#main) and transition between states in a component you can use the `transitionWith` @Input available for every kind of shape. Consider that the passed `[config]` is considered the initial state of the component and it will not apply an initial animation. Each modification on `[config]` @Input will cancel (if not already finished) the previous transition and bring the component to the next state with the configuration passed inside `transitionWith`, that accepts the `TweenConfig.duration` and `TweenConfig.easing` parameters.

If you want to skip a transition in one of the `[config]` updates you can alway pass the `_skipTransition: true` parameter and for that change no animation will be triggered.

```html
<ko-image [transitionWith]="{duration: 2}" [config]="imageConfig"
    src="https://upload.wikimedia.org/wikipedia/it/0/08/Dartfener.jpg"></ko-image>
```

Try changing `imageConfig` over time to see the animation happening.

You can subscribe to the Tween events by using the `(transitionOnFinish)` and `(transitionOnUpdate)` @Output.

> **Tip:** if you need it, `KoNestable.Easing` exports the default Tween easing functions.

## Events handling

In order to avoid consuming memory setting up unused listeners, the Node events are handled through directives.

These are the directives you can use:

### KoHoverDirective

```html
<ko-circle koHover (onHoverStart)="handleStart($event)" (onHoverEnd)="handleEnd($event)" [config]="{ 
          radius: 120,
          fill: 'blue',
          stroke: 'black',
          strokeWidth: 4,
          x: 0,
          y: 0
}"></ko-circle>
```

It allows to capture when the user hover on a Node. Each `onHoverStart` and `onHoverEnd` emits the underlying `Shape` of KonvaJS.

### KoPointerDirective

```html
<ko-circle koPointer (koPointerDblClick)="onDblClick($event)" [config]="{ 
          radius: 120,
          fill: 'blue',
          stroke: 'black',
          strokeWidth: 4,
          x: 0,
          y: 0
}"></ko-circle>
```

It allows to capture all pointer events. [Full API](https://github.com/ctinnovation/ngx-konva/blob/main/docs/classes/KoPointerDirective.md).

### KoDragDirective

```html
<ko-circle koDrag (koDragMove)="onDragMove($event)" (koDragStart)="onDragStart($event)"
   (koDragEnd)="onDragEnd($event)" [config]="{ 
          radius: 120,
          fill: 'blue',
          stroke: 'black',
          strokeWidth: 4,
          x: 0,
          y: 0
}"></ko-circle>
```

It allows to capture all drag events. [Reference](https://konvajs.org/docs/drag_and_drop/Drag_Events.html#sidebar).

### KoTransformDirective

```html
<ko-circle koTransform (koTransform)="onTransform($event)" (koTransformStart)="onTransformStart($event)"
   (koTransformEnd)="onTransformEnd($event)" [config]="{ 
          radius: 120,
          fill: 'blue',
          stroke: 'black',
          strokeWidth: 4,
          x: 0,
          y: 0
}"></ko-circle>
```

It allows to capture all transform events. [Reference](https://konvajs.org/docs/select_and_transform/Transform_Events.html#sidebar).
Optional inputs:

- `koTransformEnabled`: boolean value indicating whether the transform GUI element should be available to the user
- `koTransformOptions`: options for the underlying Transform object (i.e. rotateEnabled, resizeEnabled, keepRatio, enabledAnchors, etc.)

## Inner events

### ko-layer

`ko-layers` provides you these output:

- `(onNewItem)`: when a new `Shape` or `Layer` is added to the current layer. Argument: the `Shape | Layer` added.
- `(beforeUpdate)` `(afterUpdate)`: called before/after the layers gets updated. Argument: `Stage`. Useful to use the underlying KonvaJS API on the passed argument.

### ko-stage

`ko-layers` provides you these output:

- `(onNewLayer)`: when a new `Layer` is added to the current layer. Argument: the `Layer` added.
- `(beforeUpdate)` `(afterUpdate)`: called before/after the layers gets updated. Argument: `Layer`. Useful to use the underlying KonvaJS API on the passed argument.

### ko-nestable

`ko-nestable` (all basic shapes) provides you these output:

- `(beforeUpdate)` `(afterUpdate)`: called before/after the layers gets updated. Argument: `KoNestableNode`. Useful to use the underlying KonvaJS API on the passed argument and modifying directly the Konva Node.

## How to contribute

Contributing is quite simple: in order to complete coverage of the KonvaJS API we have to add more shapes.

To add more "simple" shapes take a look to the `./projects/ngx-konva/src/lib/ko-shape.component.ts` component:

- Add the new selector
- Update the `ko-nestable.ts` types
- Check if the default configuration handling is fine

If you need to handle children inside the new component or create more complex shapes please create a specific component for that. Extend the `KoNestable` class for each component that should be nestable inside a Layer and provide the `getKoItem` to return the underlying shape. By doing that `KoNestable` will take care of adding and destroying the Shape instances your component will use. Again, take a look to `KoShapeComponent` to see an example.

### Event listeners

In order to add new event listeners to the shapes see `ko-hover.directive.ts` as an example of an event listener directive.

## Full API Documentation

See [/docs](https://github.com/ctinnovation/ngx-konva/tree/main/docs) for full API Documentation.