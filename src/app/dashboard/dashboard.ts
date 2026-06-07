import { Component, Inject, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header';
import { TableComponent, TableHeader } from '../shared/table/table';
import { ButtonComponent } from '../shared/button/button';
import { TextFieldComponent } from '../shared/text-field/text-field';
import { DatepickerComponent } from '../shared/datepicker/datepicker';
import { DropdownComponent } from '../shared/dropdown/dropdown';
import { RadioButtonComponent } from '../shared/radio/radio';
import { ApiManager } from '../utils/api-manager';
import { Constants } from '../utils/constants';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Utils } from '../utils/utils';
import { MessageService } from '../utils/message.service';
import { TextareaComponent } from '../shared/textarea/textarea';

interface Todo {
 title: string;
 date: string;
 createdAt?: string;
 _id?: string;
 description: string;
 taskStatus: number;
 priority: number;
}
@Component({
 selector: 'app-dashboard',
 standalone: true,
 imports: [FormsModule, HeaderComponent, TableComponent, ButtonComponent, TextFieldComponent, DatepickerComponent, CommonModule, TextareaComponent, DropdownComponent, RadioButtonComponent],
 templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {
 todoTitle = '';
 todoDate = '';
 todoData = signal<Todo[]>([]);
 editId = signal<string | null>(null);
 tableHeaders: TableHeader[] = []
 openTodoModal = signal<boolean>(false);
 minDate: string = new Date().toISOString().split('T')[0];
 loginData: { userId: string, userName: string } | null = null;
 todo: Todo = { title: '', date: Utils.getYMD(), description: '', taskStatus: 1, priority: 1 };
 isLoading = signal<boolean>(true);
 btnLable = signal<string>('Save');
 taskStatus = signal<any>([
  { label: 'Pending', value: 1, class: 'inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200' },
  { label: 'In Progress', value: 2, class: 'inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200' },
  { label: 'Completed', value: 3, class: 'inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200' },
 ])
 priorityOptions = [
  { label: 'Low', value: 1, class: 'inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-300' },
  { label: 'Medium', value: 2, class: 'inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold text-orange-700 border border-orange-300' },
  { label: 'High', value: 3, class: 'inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold text-red-700 border border-red-300' }
 ]
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
   { key: 'description', label: 'Description' },
   { key: 'taskStatusLabel', label: 'Status', classKey: 'taskStatusClass' },
   { key: 'priorityLabel', label: 'Priority', classKey: 'priorityClass' },
   { key: 'edit', label: 'Edit', action: 'edit', icon: 'fas fa-edit' },
   { key: 'delete', label: 'Delete', action: 'delete', icon: 'fas fa-trash' }
  ];
 }
 handleTableAction(event: any) {
  if (event.type === 'edit') {
   this.editTodo(event.row);
  } else if (event.type === 'delete') {
   this.deleteTodo(event.row._id);
  }
 }
 onAddTodo() {
  this.todo = { title: '', date: Utils.getYMD(), description: '', taskStatus: 1, priority: 1 };
  this.editId.set(null);
  this.openTodoModal.set(true);
  this.btnLable.set('Save');
 }
 saveTodo() {
  if (!this.isValidForm()) return;
  const { title, date, description, taskStatus, priority } = this.todo;
  const payload: any = { title, date, userId: this.loginData?.userId, description, taskStatus, priority };
  if (this.editId()) {
   payload['todoId'] = this.editId();
  }
  this.api[`${this.editId() ? 'doPut' : 'doPost'}`](Constants.TODOS_ENDPOINT, payload).subscribe({
   next: (response) => {
    setTimeout(() => {
     this.openTodoModal.set(false);
    }, 500)
    this.fetchTodos();
   },
   error: (error) => {
    console.error('Error saving todo:', error);
   }
  })
 }
 fetchTodos() {
  this.isLoading.set(true);
  this.api.doPost(Constants.FETCH_TODO, { userId: this.loginData?.userId }).subscribe({
   next: (res: any) => {
    const todos = res.data || [];
    todos.forEach((todo: any) => {
     const statusObj = this.taskStatus().find((s: any) => s.value === todo.taskStatus);
     todo.taskStatusLabel = statusObj ? statusObj.label : '';
     todo.taskStatusClass = statusObj ? statusObj.class : '';
     const priorityObj = this.priorityOptions.find((p: any) => p.value === todo.priority);
     todo.priorityLabel = priorityObj ? priorityObj.label : '';
     todo.priorityClass = priorityObj ? priorityObj.class : '';
     const isOverdue = new Date(todo.todoDate) < new Date() && todo.taskStatus !== 3;
     if (isOverdue && todo.taskStatus !== 3) {
      todo.taskStatusLabel = 'Overdue';
      todo.taskStatusClass = 'inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold bg-red-100 text-red-800 border border-red-200';
      todo.canEdit = false;
     }
    })

    this.todoData.set(todos);
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
  const { title, todoDate, description = "", taskStatus = 1, priority = 1 } = todo;
  this.todo = { title, date: Utils.getYMD(todoDate), description, taskStatus, priority };
  this.editId.set(todo._id);
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
  if (!this.todo.description) {
   this.messageService.showMessage('Description is required');
   return false;
  }
  return true;
 }
}
