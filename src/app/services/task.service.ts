import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Router } from '@angular/router'
import { Subject } from 'rxjs'

import { environment } from 'src/environments/environment'
import { Task } from '../Task'

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type' : 'application/json'
  })
}

const BACKEND_URL = environment.apiUrl + 'tasks/'

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private tasks: Task[]

  private tasksUpdated = new Subject<{tasks: Task[]}>()

  constructor(private http: HttpClient,
              private router: Router) { }

  getTasks() {
    this.http.get<Task[]>(BACKEND_URL)
      .subscribe((data) => {
        this.tasks = data
        this.tasksUpdated.next({tasks: [...this.tasks]})
      })
  }

  getTask(taskId: string) {
    return this.http.get<{
      _id: string,
      text: string,
      date: string,
      reminder: boolean,
    }>(BACKEND_URL + taskId)
  }

  getTaskUpdateListener() {
    return this.tasksUpdated.asObservable();
  }

  // updateReminder(task: Task) {
  //   const url = `${this.apiUrl}/${task._id}`
  //   return this.http.put(url, task, httpOptions)
  // }

  addTask(task: {text: string, date: Date, reminder: boolean}) {
    this.http
      .post(BACKEND_URL, task)
      .subscribe(() => {
        this.router.navigate(['/'])
      })
  }

  updatePost(task: Task) {
    this.http
      .put(BACKEND_URL + 'edit/'+ task._id, task)
      .subscribe(() => {
        this.router.navigate(['/'])
      })
  }

  deleteTask(id: string) {
    return this.http.delete(BACKEND_URL + id)
  }
}
