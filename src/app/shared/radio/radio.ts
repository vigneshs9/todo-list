import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
 selector: 'app-radio-button',
 standalone: true,
 imports: [],
 templateUrl: './radio.html',
})
export class RadioButtonComponent {
 @Input() options: Array<{ label: string; value: any }> = [];
 @Input() name = 'radio';
 @Input() selectedValue: any = null;
 @Input() disabled = false;
 @Output() selectionChange = new EventEmitter<any>();

 select(opt: { label: string; value: any }) {
  if (this.disabled) return;
  this.selectedValue = opt.value;
  this.selectionChange.emit(opt.value);
 }

 trackByIndex(i: number) { return i; }
}
