import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { ActivatedRoute } from '@angular/router';
import { TaskService } from 'src/app/services/task.service';
import { Task } from 'src/app/Task';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent implements OnInit {

  form: FormGroup
  dateNow = new Date().toJSON().slice(0,16).replace(/-/g,'-')
  dueDate: string
  formStatus = false

  mode = 'create'
  private taskId: any

  constructor(private taskService: TaskService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      text: new FormControl(null,{
        validators: [Validators.required, Validators.minLength(3)]
      }),
      date: new FormControl(null, {
        validators: [Validators.required]
      }),
      reminder: new FormControl(false)
    })
    this.route.paramMap
      .subscribe(paramMap => {
        if (paramMap.has('taskId')){
          this.mode = 'edit'
          this.taskId = paramMap.get('taskId')
          console.log(this.taskId)
          this.taskService.getTask(this.taskId)
            .subscribe( taskEdit => {
              this.dueDate = taskEdit.date.slice(0,16).replace(/-/g,'-')
              this.form.setValue({
                text: taskEdit.text,
                date: taskEdit.date,
                reminder: taskEdit.reminder
              })
            })
        } else {
          this.mode = 'create'
          this.taskId = null
        }
      })
  }

  onSaveTask() {
    if (this.form.invalid){
      this.formStatus = true
      return
    }
    if (this.mode === 'create') {
        this.taskService
          .addTask({
              text: this.form.value.text,
              date: new Date(this.form.value.date),
              reminder: this.form.value.reminder
          })
    } else {
      this.taskService.updatePost({
        _id: this.taskId,
        text: this.form.value.text,
        date: this.form.value.date,
        reminder: this.form.value.reminder
      })
    }
    //this.form.reset()
  }

}
