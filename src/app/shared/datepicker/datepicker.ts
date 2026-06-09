import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
@Component({
 selector: 'app-datepicker',
 changeDetection: ChangeDetectionStrategy.Eager,
 templateUrl: './datepicker.html'
})
export class DatepickerComponent {
 @Input() label: string = 'Due Date';
 @Input() value: string = '';
 @Input() min?: string;
 @Input() max?: string;
 @Input() disabled: boolean = false;
 @Output() valueChange = new EventEmitter<string>();
 onChange(event: Event) {
  const input = event.target as HTMLInputElement;
  this.valueChange.emit(input.value);
 }
}