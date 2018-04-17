import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Project } from '../domain';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthenService {
    private readonly domain = 'projects';
    private headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });
    private token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
    '.eyJpc3MiOiJ0b3B0YWwuY29tIiwiZXhwIjoxNDI2NDIwODAwLCJodHRwOi8vdG9wdGFsLmNvbS' +
    '.yRQYnWzskCZUxPwaQupWkiUzKELZ49eM7oWxAQK_ZXw';

    constructor (private http: HttpClient) {}

    register() {

    }

    login() {

    }


}
