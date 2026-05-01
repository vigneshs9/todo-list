import { Component, Inject, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header';
import { TableComponent, TableHeader } from '../shared/table/table';
import { ButtonComponent } from '../shared/button/button';
import { TextFieldComponent } from '../shared/text-field/text-field';
import { DatepickerComponent } from '../shared/datepicker/datepicker';
import { ApiManager } from '../utils/api-manager';
import { Constants } from '../utils/constants';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Utils } from '../utils/utils';
import { MessageService } from '../utils/message.service';

interface Todo {
 title: string;
 date: string;
 createdAt?: string;
 _id?: string;
}
@Component({
 selector: 'app-dashboard',
 standalone: true,
 imports: [FormsModule, HeaderComponent, TableComponent, ButtonComponent, TextFieldComponent, DatepickerComponent, CommonModule],
 templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {
 todoTitle = '';
 todoDate = '';
 todoData = signal<Todo[]>([]);
 editId: string | null = null;
 tableHeaders: TableHeader[] = []
 openTodoModal = signal<boolean>(false);
 minDate: string = new Date().toISOString().split('T')[0];
 loginData: { userId: string, userName: string } | null = null;
 todo: Todo = { title: '', date: Utils.getYMD() };
 isLoading = signal<boolean>(true);
 btnLable = signal<string>('Save');
 private readonly api = inject(ApiManager)
 public readonly messageService = inject(MessageService);
 
 constructor(@Inject(PLATFORM_ID) private readonly platformId: Object) { }
 ngOnInit() {
  if (isPlatformBrowser(this.platformId)) {
   this.loginData = Utils.getFromLocalStorage(Constants.LS_LOGIN_DATA);
  }
  this.setupTable();
  if (this.loginData?.userId) {
   this.fetchTodos();
  }
 }
 setupTable() {
  this.tableHeaders = [
   { key: 'title', label: 'Title' },
   { key: 'todoDateDMY', label: 'Date' },
   { key: 'edit', label: 'Edit', action: 'edit', icon: 'fas fa-edit' },
   { key: 'delete', label: 'Delete', action: 'delete', icon: 'fas fa-trash' }
  ];
 }
 handleTableAction(event: any) {
  console.log('Table action:', event);
  if (event.type === 'edit') {
   this.editTodo(event.row);
  } else if (event.type === 'delete') {
   this.deleteTodo(event.row._id);
  }
 }
 onAddTodo() {
  this.openTodoModal.set(true);
  this.btnLable.set('Save');
 }
 saveTodo() {
  if (!this.isValidForm()) return;
  const payload: any = { title: this.todo.title, date: this.todo.date, userId: this.loginData?.userId };
  if (this.editId) {
   payload['todoId'] = this.editId;
  }
  this.api[`${this.editId ? 'doPut' : 'doPost'}`](Constants.TODOS_ENDPOINT, payload).subscribe({
   next: (response) => {
    setTimeout(() => {
     this.openTodoModal.set(false);
    }, 500)
    this.fetchTodos();
   },
   error: (error) => {
    console.error('Error saving todo:', error);
   }
  });
 }
 fetchTodos() {
  this.isLoading.set(true);
  this.api.doPost(Constants.FETCH_TODO, { userId: this.loginData?.userId }).subscribe({
   next: (res: any) => {
    this.todoData.set(res.data || []);
    this.isLoading.set(false);
   },
   error: (error) => {
    this.isLoading.set(false);
    console.error('Error fetching todos:', error);
   }
  });
 }
 deleteTodo(todoId: string) {
  if (confirm('Are you sure you want to delete this todo?')) {
   this.api.doPost(Constants.DELETE_TODO, { todoId }).subscribe({
    next: () => {
     this.fetchTodos();
    },
    error: (error) => {
     console.error('Error deleting todo:', error);
    }
   });
  }
 }
 editTodo(todo: any) {
  const { title, todoDate } = todo;
  this.todo = { title: title, date: Utils.getYMD(todoDate) };
  this.editId = todo._id;
  this.openTodoModal.set(true);
  this.btnLable.set('Update');
 }
 isValidForm(): boolean {
  if (!this.todo.title) {
   this.messageService.showMessage('Title is required');
   return false;
  }
  if (!this.todo.date) {
   this.messageService.showMessage('Date is required');
   return false;
  }
  return true;
 }
}
