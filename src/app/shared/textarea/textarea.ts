import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
 selector: 'app-textarea',
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
