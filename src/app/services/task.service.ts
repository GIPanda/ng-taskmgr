import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Task, TaskList } from '../domain';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TaskService {
    private readonly domain = 'tasks';
    private headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });
    constructor (private http: HttpClient) {}

    // POST
    add(task: Task): Observable<Task> {
        task.id = null;
        const uri = `${environment.apiUrl}/${this.domain}`;
        return this.http
            .post(uri, JSON.stringify(task), {headers: this.headers})
            .map(res => res as Task);
    }

    // PUT
    update(task: Task): Observable<Task> {
        const uri = `${environment.apiUrl}/${this.domain}/${task.id}`;
        const toUpdate = {
            desc: task.desc,
            priority: task.priority,
            dueDate: task.dueDate,
            reminder: task.reminder,
            ownerId: task.ownerId,
            participantIds: task.participantIds,
            remark: task.remark
        };
        return this.http
            .patch(uri, JSON.stringify(toUpdate), {headers: this.headers})
            .map(res => res as Task);
    }

    // DELETE
    delete(task: Task): Observable<Task> {
        const uri = `${environment.apiUrl}/${this.domain}/${task.id}`;
        return this.http
            .delete(uri)
            .mapTo(task);
    }

    // GET
    get(taskListId: string): Observable<Task[]> {
        const uri = `${environment.apiUrl}/${this.domain}`;
        return this.http
            .get(uri, {params: {taskListId: taskListId}})
            .map(res => res as Task[]);
    }

    getByLists(lists: TaskList[]): Observable<Task[]> {
        return Observable.from(lists)
            .mergeMap(list => this.get(list.id))
            .reduce((accumTasks: Task[], seedTasks: Task[]) => [...accumTasks, ...seedTasks], []);
    }

    completeToggle(task: Task): Observable<Task> {
        const uri = `${environment.apiUrl}/${this.domain}/${task.id}`;
        return this.http
            .patch(uri, JSON.stringify({completed: !task.completed}), {headers: this.headers})
            .map(res => res as Task);
    }

    move(taskId: string, taskListId: string): Observable<Task> {
        const uri = `${environment.apiUrl}/${this.domain}/${taskId}`;
        return this.http
            .patch(uri, JSON.stringify({taskListId: taskListId}), {headers: this.headers})
            .map(res => res as Task);
    }

    moveAll(srcListId: string, targetListId: string): Observable<Task[]> {
        return this.get(srcListId)
            .mergeMap(tasks => Observable.from(tasks))
            .mergeMap(task => this.move(task.id, targetListId))
            .reduce((accumTasks, seedTask) => [...accumTasks, seedTask], []);
    }
}
