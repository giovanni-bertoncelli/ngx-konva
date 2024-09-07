import { Directive, EventEmitter, OnDestroy, OnInit, Optional, Input, Output, Self, forwardRef } from '@angular/core';
import { KonvaEventObject } from 'konva/lib/Node';
import { KoShape } from '../common';
import { KoListeningDirective } from '../common/ko-listening';
import { KoNestable, KoNestableNode } from '../common/ko-nestable';
import { Transformer } from 'konva/lib/shapes/Transformer';

@Directive({
  selector: '[koTransform]',
  providers: [{
    provide: KoListeningDirective,
    useValue: forwardRef(() => KoTransformDirective)
  }],
})
export class KoTransformDirective implements OnInit, OnDestroy {
  @Input() set
  koTransformEnabled(enable:boolean) {
    if (enable || enable === undefined) {
      this.addTransformer();
    } else {
      this.removeTransformer();
    }
  };

  @Input() koTransformOptions: any = [];

  @Output()
  koTransformStart = new EventEmitter<KonvaEventObject<any>>();

  @Output()
  koTransform = new EventEmitter<KonvaEventObject<any>>();

  @Output()
  koTransformEnd = new EventEmitter<KonvaEventObject<any>>();
  
  private node: KoNestableNode;
  private transformer: Transformer | null = null;

  onTransformStarterListener = this.onTransformStart.bind(this);
  onTransformEndListener = this.onTransformEnd.bind(this);
  onTranformListener = this.onTransform.bind(this);

  constructor(
    @Optional() @Self() nestable: KoNestable
  ) {
    if (!nestable) {
      throw new Error('koTransform attachable only to ko-nestable');
    }
    this.node = nestable.getKoItem() as KoShape;
    this.addTransformer();
    this.addListeners();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.node.off('transformstart', this.onTransformStarterListener);
    this.node.off('transformend', this.onTransformEndListener);
    this.node.off('transform', this.onTranformListener);
    this.removeTransformer();
  }

  addTransformer() {
    this.transformer = new Transformer({...this.koTransformOptions, nodes: [this.node]});
    this.node.getLayer()?.add(this.transformer);
  }

  removeTransformer() {
    this.transformer?.setNodes([]);
    this.transformer?.destroy();
    this.transformer = null;
  }

  addListeners() {
    this.node.on('transformstart', this.onTransformStarterListener);
    this.node.on('transformend', this.onTransformEndListener);
    this.node.on('transform', this.onTranformListener);
  }

  onTransformStart(event: KonvaEventObject<any>) {
    this.koTransformStart.emit(event);
  }

  onTransformEnd(event: KonvaEventObject<any>) {
    this.koTransformEnd.emit(event);
  }

  onTransform(event: KonvaEventObject<any>) {
    this.koTransform.emit(event);
  }

}
