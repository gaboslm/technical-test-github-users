import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserModel } from 'src/app/models/user.model';
import { IResult } from 'src/app/interfaces/result.interface';
import { GitHubUserListDTO } from './user-list.dto';

@Injectable({
  providedIn: 'root'
})
export class UserListService {

  private baseUrl: string = environment.githubAPIUrl;

  constructor(private http: HttpClient) { }

  searchUsers(username: string, perPage: number): Observable<IResult<UserModel[]>> {
    const url = new URL(`${this.baseUrl}/search/users`);
    url.searchParams.append('q', username);
    url.searchParams.append('per_page', perPage.toString());
    return this.http.get<GitHubUserListDTO>(url.toString())
      .pipe(
        map((response: GitHubUserListDTO) => {
          return ({ success: response.items });
        }),
        catchError((error: HttpErrorResponse) => {
          return of({ error: error.message });
        })
      );
  }

  asyncSearchUsers(username: string, perPage: number): Promise<IResult<UserModel[]>> {
    const url = new URL(`${this.baseUrl}/search/users`);
    url.searchParams.append('q', username);
    url.searchParams.append('per_page', perPage.toString());
    return new Promise((resolve, reject) => {
      fetch(url.toString())
        .then((response: Response) => response.json())
        .then((response: GitHubUserListDTO) => {
          return resolve({ success: response.items })
        })
        .catch((error: Error) => {
          return reject({ error: error.message })
        })
    })
  }
}
