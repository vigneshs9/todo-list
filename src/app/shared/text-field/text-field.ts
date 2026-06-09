import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
 selector: 'app-text-field',
 changeDetection: ChangeDetectionStrategy.Eager,
 templateUrl: './text-field.html'
})
export class TextFieldComponent {
 @Input() label: string = '';
 @Input() type: string = 'text';
 @Input() placeholder: string = '';
 @Input() value: string = '';
 @Input() error: string = '';
 @Input() disabled: boolean = false;
 @Output() valueChange = new EventEmitter<string>();
 @Output() inputValueChange = new EventEmitter<string>();

 onBlur(event: Event) {
  const input = event.target as HTMLInputElement;
  this.valueChange.emit(input.value);
 }
 onInput(event: Event) {
  const input = event.target as HTMLInputElement;
  this.inputValueChange.emit(input.value);
 }
}