import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Project } from '../domain';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ProjectService {
    private readonly domain = 'projects';
    private headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });
    constructor (private http: HttpClient) {}

    // POST
    add(project: Project): Observable<Project> {
        project.id = null;
        const uri = `${environment.apiUrl}/${this.domain}`;
        return this.http
            .post(uri, JSON.stringify(project), {headers: this.headers})
            .map(res => res as Project);
    }

    // PUT
    update(project: Project): Observable<Project> {
        const uri = `${environment.apiUrl}/${this.domain}/${project.id}`;
        const toUpdate = {
            name: project.name,
            desc: project.desc,
            coverImg: project.coverImg
        };
        return this.http
            .patch(uri, JSON.stringify(toUpdate), {headers: this.headers})
            .map(res => res as Project);
    }

    // DELETE
    delete(project: Project): Observable<Project> {
        const delTasks$ = Observable.from(project.taskLists ? project.taskLists : [])
            .mergeMap(listId => this.http.delete(`${environment.apiUrl}/taskLists/${listId}`))
            .count();
        return delTasks$
            .switchMap(_ => this.http.delete(`${environment.apiUrl}/${this.domain}/${project.id}`))
            .mapTo(project);
    }

    // GET
    get(userId: string): Observable<Project[]> {
        const uri = `${environment.apiUrl}/${this.domain}`;
        return this.http
            .get(uri, {params: {members_like: userId}})
            .map(res => res as Project[]);
    }
}
