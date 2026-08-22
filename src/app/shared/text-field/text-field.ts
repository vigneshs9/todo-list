import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, SimpleChanges, signal } from '@angular/core';

@Component({
 selector: 'app-text-field',
 changeDetection: ChangeDetectionStrategy.Eager,
 templateUrl: './text-field.html'
})
export class TextFieldComponent implements OnChanges {
 @Input() label: string = '';
 @Input() type: string = 'text';
 @Input() regex: string = '';
 @Input() placeholder: string = '';
 @Input() value: string = '';
 @Input() error: string = '';
 @Input() disabled: boolean = false;
 @Output() valueChange = new EventEmitter<string>();
 @Output() inputValueChange = new EventEmitter<string>();
 validationError = signal('');
 validationPattern = signal('');

 private readonly typePatterns: Record<string, string> = {
  email: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
  tel: '^[+]?[0-9 ()-]{7,}$',
  url: 'https?://.+',
  number: '^-?\\d+(\\.\\d+)?$'
 };

 ngOnChanges(changes: SimpleChanges): void {
  if (changes['regex'] || changes['type']) {
   this.validationPattern.set(this.regex || this.typePatterns[this.type] || '');
   this.validationError.set('');
  }
 }

 onBlur(event: Event) {
  const input = event.target as HTMLInputElement;
  this.updateValidationError(input);
  this.valueChange.emit(input.value);
 }
 onInput(event: Event) {
  console.log('Type:', this.type);
  const input = event.target as HTMLInputElement;
  // this.updateValidationError(input);
  this.inputValueChange.emit(input.value);
  this.valueChange.emit(input.value);
 }

 private updateValidationError(input: HTMLInputElement): void {
  if (this.type === 'text' && !this.regex) {
   this.validationError.set('');
   return;
  }
  if (!input.value) {
   this.validationError.set('');
   return;
  }
  const pattern = this.validationPattern();

  if (!pattern) {
   this.validationError.set('');
   return;
  }

  if (input.validity.patternMismatch) {
   this.validationError.set(`Please enter a valid ${this.type}.`);
  } else if (input.validity.typeMismatch) {
   this.validationError.set(`Please enter a valid ${this.type}.`);
  } else {
   this.validationError.set('');
  }
 }
}