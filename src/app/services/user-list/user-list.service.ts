import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserListModel } from 'src/app/models/user.model';
import { IResult } from 'src/app/interfaces/result.interface';
import { GitHubUserListDTO, GithubResponseDTO } from 'src/app/dtos';

@Injectable({
  providedIn: 'root'
})
export class UserListService {

  private baseUrl: string = environment.githubAPIUrl;

  constructor(private http: HttpClient) { }

  searchUsers(username: string, perPage: number): Observable<IResult<UserListModel[]>> {
    const url = new URL(`${this.baseUrl}/search/users`);
    url.searchParams.append('q', username);
    url.searchParams.append('per_page', perPage.toString());

    return this.http.get<GitHubUserListDTO>(url.toString())
      .pipe(
        map((response: GitHubUserListDTO) => {
          const userList: UserListModel[] = this.mapper(response)
          return ({ success: userList });
        }),
        catchError((errorResponse: HttpErrorResponse) => {
          const { error }: { error: GithubResponseDTO } = errorResponse
          return of({ error: error?.message });
        })
      );
  }

  async asyncSearchUsers(username: string, perPage: number): Promise<IResult<UserListModel[]>> {
    const url = new URL(`${this.baseUrl}/search/users`);
    url.searchParams.append('q', username);
    url.searchParams.append('per_page', perPage.toString());

    return fetch(url.toString())
      .then((response: Response) => {
        const { ok } = response
        return response.json().then(data => ({ ok, data }))
      })
      .then((response) => {
        const { ok } = response

        if (!ok) {
          const { data }: { data: GithubResponseDTO } = response
          return ({ error: data.message })
        }

        const { data }: { data: GitHubUserListDTO } = response
        const userList: UserListModel[] = this.mapper(data)
        return ({ success: userList })
      })
  }

  mapper(gitHubUserProfileDTO: GitHubUserListDTO): UserListModel[] {
    return gitHubUserProfileDTO.items.map(element => ({
      id: element.id,
      login: element.login,
    }))
  }
}
