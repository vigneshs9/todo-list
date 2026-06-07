import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
 selector: 'app-dropdown',
 standalone: true,
 imports: [],
 templateUrl: './dropdown.html'
})
export class DropdownComponent {
 @Input() options: Array<{ label: string; value: any }> = [];
 @Input() placeholder = 'Select';
 @Input() disabled = false;
 @Input() selectedValue: any = null;
 @Output() selectionChange = new EventEmitter<any>();

 isOpen = false;

 get selected() {
  return this.options.find(o => o.value === this.selectedValue) || null;
 }

 toggle(event?: Event) {
  if (this.disabled) return;
  this.isOpen = !this.isOpen;
  if (event) event.stopPropagation();
 }

 select(option: { label: string; value: any }, event?: Event) {
  if (this.disabled) return;
  this.selectedValue = option.value;
  this.selectionChange.emit(option.value);
  this.isOpen = false;
  if (event) event.stopPropagation();
 }

 @HostListener('document:click')
 close() {
  this.isOpen = false;
 }

 trackByIndex(i: number) { return i; }
}
