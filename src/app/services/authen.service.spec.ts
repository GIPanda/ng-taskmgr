import { TestBed, inject } from '@angular/core/testing';
import { AuthenService } from './authen.service';
import { Http, BaseResponseOptions, HttpModule, Response, ResponseOptions  } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { serializePath } from '@angular/router/src/url_tree';
import { User } from '../domain';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('AuthenService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        {
          provide: Http,
          useFactory: (mockBackend, options) => {
            return new Http(mockBackend, options);
          },
          deps: [MockBackend, BaseResponseOptions]
        },
        MockBackend,
        BaseResponseOptions,
        AuthenService,
        HttpClient,
        HttpHandler
      ]
    })
    .compileComponents(); // compile template and css
  });

  it('should return an Observable<Authen> after registeriation', inject(
    [AuthenService, MockBackend],
    (service: AuthenService, mockBackend: MockBackend) => {
      const mockUser: User = {
        name: 'someuser@dev.local',
        password: '123abc',
        email: 'someuser@dev.local'
      };
      const mockResponse = {
        id: 'obj123abc',
        name: 'someuser@dev.local',
        email: 'someuser@dev.local',
        password: '123abc'
      };
      mockBackend.connections.subscribe(conn => {
        conn.mockResponse(new Response(new ResponseOptions({
          body: JSON.stringify(mockResponse)
        })));
      });
      service.register(mockUser).subscribe(authen => {
        expect(authen.token).toBeDefined();
        expect(authen.user).toBeDefined();
        expect(authen.user.id).toEqual(mockResponse.id);
      }, (error) => {
        console.log(error);
      });
    }
  ));

});

