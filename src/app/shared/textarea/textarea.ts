import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
 selector: 'app-textarea',
 changeDetection: ChangeDetectionStrategy.Eager,
 templateUrl: './textarea.html'
})
export class TextareaComponent {
 @Input() label: string = '';
 @Input() placeholder: string = '';
 @Input() value: string = '';
 @Input() rows: number = 4;
 @Input() error: string = '';
 @Input() disabled: boolean = false;
 @Output() valueChange = new EventEmitter<string>();

 onInput(event: Event) {
  const textarea = event.target as HTMLTextAreaElement;
  this.valueChange.emit(textarea.value);
 }
}
