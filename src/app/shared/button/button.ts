import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
 selector: 'app-button',
 changeDetection: ChangeDetectionStrategy.Eager,
 templateUrl: './button.html'
})
export class ButtonComponent {
 @Input() label: string = 'Button';
 @Input() type: 'button' | 'submit' | 'reset' = 'button';
 @Input() variant: 'primary' | 'secondary' | 'tertiary' = 'primary';
 @Input() disabled: boolean = false;

 @Output() clicked = new EventEmitter<void>();
 get buttonClass(): string {
  const base = 'px-4 py-2 rounded-lg font-medium transition focus:outline-none cursor-pointer';
  const variants = {
   primary: 'bg-blue-600 text-white hover:bg-blue-700',
   secondary: 'bg-gray-600 text-white hover:bg-gray-700',
   tertiary: 'bg-transparent text-blue-600 hover:underline'
  };
  return `${base} ${variants[this.variant]} ${this.disabled ? 'opacity-50 cursor-not-allowed' : ''}`;
 }
 onClick() {
  if (!this.disabled) {
   this.clicked.emit();
  }
 }
}