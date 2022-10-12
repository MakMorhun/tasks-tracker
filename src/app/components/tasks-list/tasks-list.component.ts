import { Component, OnInit, OnDestroy } from '@angular/core';
import { TaskService } from 'src/app/services/task.service';
import { Task } from 'src/app/Task';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss']
})
export class TasksListComponent implements OnInit, OnDestroy {

  tasks: Task[]
  isLoading: boolean
  showMessage = false
  private postsSub: Subscription

  constructor(private tasksService: TaskService) { }

  ngOnInit(): void {
    this.isLoading = true
    this.tasksService.getTasks()
    this.postsSub = this.tasksService.getTaskUpdateListener()
      .subscribe(tasksData => {
        this.isLoading = false
        this.tasks = tasksData.tasks
        this.showMessage = this.tasks.length <= 0 ? true : false
      })
  }

  // onChangeReminder(task: Task) {
  //   task.reminder = !task.reminder
  //   this.tasksService.updateReminder(task).subscribe()
  // }

  onDeleteTask(id: string) {
    this.tasksService
      .deleteTask(id)
      .subscribe(() => {
        this.tasksService.getTasks()
      })
  }

  ngOnDestroy(){
    this.postsSub.unsubscribe()
  }
}
