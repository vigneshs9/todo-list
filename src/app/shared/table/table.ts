import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export type TableAction = 'view' | 'edit' | 'delete';

export interface TableHeader {
 key: string;
 label: string;
 icon?: string;
 action?: TableAction;
 classKey?: string;
}

@Component({
 selector: 'app-table',
 standalone: true,
 imports: [CommonModule],
 templateUrl: './table.html'
})
export class TableComponent {
 headers = signal<TableHeader[]>([]);
 data = signal<any[]>([]);
 loading = signal<boolean>(true);
 @Input() set headersInput(value: TableHeader[]) {
  this.headers.set(value ?? []);
 }

 @Input() set dataInput(value: any[]) {
  this.data.set(Array.isArray(value) ? value : []);
 }
 @Input() set loadingInput(v: boolean) {
  this.loading.set(v);
 }
 @Output() action = new EventEmitter<{ type: TableAction; row: any }>();

 emitAction(type: TableAction, row: any) {
  this.action.emit({ type, row });
 }
}
