import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { TaskList, Task } from '../domain';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TaskListService {
    private readonly domain = 'taskLists';
    private headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });
    constructor (private http: HttpClient) {}

    // POST
    add(taskList: TaskList): Observable<TaskList> {
        const uri = `${environment.apiUrl}/${this.domain}`;
        return this.http
            .post(uri, JSON.stringify(taskList), {headers: this.headers})
            .map(res => res as TaskList);
    }

    // PUT
    update(taskList: TaskList): Observable<TaskList> {
        const uri = `${environment.apiUrl}/${this.domain}/${taskList.id}`;
        const toUpdate = {
            name: taskList.name,
        };
        return this.http
            .patch(uri, JSON.stringify(toUpdate), {headers: this.headers})
            .map(res => res as TaskList);
    }

    // DELETE
    delete(taskList: TaskList): Observable<TaskList> {
        const uri = `${environment.apiUrl}/${this.domain}/${taskList.id}`;
        return this.http.delete(uri)
            .mapTo(taskList);
    }

    // GET
    get(projectId: string): Observable<TaskList[]> {
        const uri = `${environment.apiUrl}/${this.domain}`;
        return this.http
            .get(uri, {params: {projectId: projectId}})
            .map(res => res as TaskList[]);
    }

    swapOrder(src: TaskList, target: TaskList): Observable<TaskList[]> {
        const dragUri = `${environment.apiUrl}/${this.domain}/${src.id}`;
        const dropUri = `${environment.apiUrl}/${this.domain}/${target.id}`;
        const drag$ = this.http
            .patch(dragUri, JSON.stringify({order: target.order}), {headers: this.headers})
            .map(res => res as TaskList);
        const drop$ = this.http
            .patch(dropUri, JSON.stringify({order: src.order}), {headers: this.headers})
            .map(res => res as TaskList);
        return Observable
            .concat(drag$, drop$)
            .reduce((accumLists, seedList) => [...accumLists, seedList], []);
    }
}
