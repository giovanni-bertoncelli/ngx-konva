import { AfterViewInit, Component, ContentChildren, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList } from '@angular/core';
import { Group } from 'konva/lib/Group';
import { Layer } from 'konva/lib/Layer';
import { KoShape } from '../common';
import { KoNestable, KoNestableConfig } from '../common/ko-nestable';


@Component({
  selector: 'ko-layer',
  template: `<ng-content></ng-content>`,
  styles: [``],
  providers: [{
    provide: KoNestable,
    useExisting: KoLayerComponent
  }]
})
export class KoLayerComponent extends KoNestable implements OnInit, OnDestroy, AfterViewInit {
  @ContentChildren(KoNestable)
  children!: QueryList<KoNestable>;

  layer: Layer;

  private _config: KoNestableConfig = {};

  @Input()
  set config(c: KoNestableConfig) {
    this._config = c;
    this._config.id = this.id;
    this.updateLayer();
  };

  @Output()
  onNewItem = new EventEmitter<Layer | KoShape | Group>();

  @Output()
  beforeUpdate = new EventEmitter<Layer>();

  @Output()
  afterUpdate = new EventEmitter<Layer>();

  constructor() {
    super();
    this.layer = new Layer(this._config);
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  ngAfterViewInit(): void {
    this.sub.add(
      this.children.changes.subscribe(this.updateChildren.bind(this))
    );
    this.updateChildren();
  }

  override getKoItem(): Layer {
    return this.layer;
  }

  updateLayer() {
    this.beforeUpdate.emit(this.layer);
    this.setConfig(this._config);
    this.layer.draw();
    this.afterUpdate.emit(this.layer);
  }

  private updateChildren() {
    for (const child of this.children.toArray()) {
      const found = this.layer.findOne(`#${child.id}`);

      if (found) {
        continue;
      }

      const koItem = child.getKoItem();
      this.layer.add(koItem);
      this.onNewItem.emit(koItem);
      koItem.fire('ko:added', this.layer);
    }

    this.layer.draw();
  }
}
