import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IResult } from 'src/app/interfaces';
import { GithubResponseDTO, GitHubUserProfileDTO } from 'src/app/dtos';
import { UserProfileModel } from 'src/app/models';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  private baseUrl: string = environment.githubAPIUrl;

  constructor(private http: HttpClient) { }

  getUserProfile(username: string): Observable<IResult<UserProfileModel>> {
    const url = new URL(`${this.baseUrl}/users/${username}`);

    return this.http.get<GitHubUserProfileDTO>(url.toString())
      .pipe(
        map((response: GitHubUserProfileDTO) => {
          const userModel: UserProfileModel = this.mapper(response)
          return ({ success: userModel });
        }),
        catchError((errorResponse: HttpErrorResponse) => {
          const { error }: { error: GithubResponseDTO } = errorResponse
          return of({ error: error?.message });
        })
      );
  }

  async asyncGetUserProfile(username: string): Promise<IResult<UserProfileModel>> {
    const url = new URL(`${this.baseUrl}/users/${username}`);

    return fetch(url.toString())
      .then((response: Response) => {
        const { ok } = response
        return response.json().then(data => ({ ok, data }));
      })
      .then((response) => {
        const { ok } = response

        if (!ok) {
          const { data }: { data: GithubResponseDTO } = response
          return ({ error: data.message })
        }

        const { data }: { data: GitHubUserProfileDTO } = response
        const userModel: UserProfileModel = this.mapper(data)
        return ({ success: userModel })
      })
  }

  mapper(gitHubUserProfileDTO: GitHubUserProfileDTO): UserProfileModel {
    return ({
      id: gitHubUserProfileDTO.id,
      name: gitHubUserProfileDTO.name,
      type: gitHubUserProfileDTO.type,
      login: gitHubUserProfileDTO.login,
      avatar_url: gitHubUserProfileDTO.avatar_url,
      followers: gitHubUserProfileDTO.followers,
      following: gitHubUserProfileDTO.following,
    })
  }
}
