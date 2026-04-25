import { Component, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header';
import { TableComponent, TableHeader } from '../shared/table/table';
import { ButtonComponent } from '../shared/button/button';
import { TextFieldComponent } from '../shared/text-field/text-field';
import { DatepickerComponent } from '../shared/datepicker/datepicker';
import { ApiManager } from '../utils/api-manager';
import { Constants } from '../utils/constants';
import { CommonModule, isPlatformBrowser } from '@angular/common';


interface Todo {
 title: string;
 date: string;
 createdAt?: string;
 id?: string;
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
 todoData: Todo[] = [];
 editId: string | null = null;
 tableHeaders: TableHeader[] = []
 openTodoModal: boolean = false;
 minDate: string = new Date().toISOString().split('T')[0];
 loginData: { userId: string, userName: string } | null = null;
 todo: Todo = { title: '', date: '' };
 isLoading = true;
 btnLable: string = 'Save'
 constructor(@Inject(PLATFORM_ID) private readonly platformId: Object) { }
 private readonly api = inject(ApiManager)
 ngOnInit() {
  if (isPlatformBrowser(this.platformId)) {
   this.loginData = JSON.parse(localStorage.getItem('loginData') || 'null');
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
  this.openTodoModal = true;
  this.btnLable = 'Save'
 }
 saveTodo() {
  const payload: any = { title: this.todo.title, date: this.todo.date, userId: this.loginData?.userId };
  if (this.editId) {
   payload['todoId'] = this.editId;
  }
  this.api[`${this.editId ? 'doPut' : 'doPost'}`](Constants.TODOS_ENDPOINT, payload).subscribe({
   next: (response) => {
    setTimeout(() => {
     this.openTodoModal = false;
    }, 500)
    this.fetchTodos();
   },
   error: (error) => {
    console.error('Error saving todo:', error);
   }
  });
 }
 fetchTodos() {
  this.isLoading = true;
  this.api.doPost(Constants.FETCH_TODO, { userId: this.loginData?.userId }).subscribe({
   next: (res: any) => {
    this.todoData = res.data || []
    this.isLoading = false;
   },
   error: (error) => {
    this.isLoading = false;
    console.error('Error fetching todos:', error);
   }
  });
 }
 deleteTodo(todoId: string) {
  this.api.doPost(Constants.DELETE_TODO, { todoId }).subscribe({
   next: () => {
    this.fetchTodos();
   },
   error: (error) => {
    console.error('Error deleting todo:', error);
   }
  });
 }
 editTodo(todo: any) {
  const { title, todoDate } = todo;
  this.todo = { title: title, date: new Date(todoDate).toISOString().split('T')[0] };
  this.editId = todo._id;
  this.openTodoModal = true;
  this.btnLable = 'Update'
 }
}
