import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IResult } from 'src/app/interfaces';
import { UserProfileModel } from 'src/app/models';
import { GlobalErrorService } from 'src/app/services/errors/global-error.service';
import { UserProfileService } from 'src/app/services/user-profile/user-profile.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {
  user: UserProfileModel = {
    login: '',
    name: '',
    avatar_url: '',
    type: '',
    followers: 0,
    following: 0,
  };
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private userProfileService: UserProfileService,
    private globalErrorService: GlobalErrorService
  ) { }

  private handleError(message: string) {
    this.globalErrorService.showError(message ?? 'An error occurred while fetching data.');
  }

  ngOnInit() {
    const login = this.route.snapshot.paramMap.get('login');

    if (login) {
      this.getUserProfile(login)
      // this.asyncGetUserProfile(login)
    }

  }

  goBack(): void {
    this.location.back();
  }

  // Using Observables
  getUserProfile(login: string) {
    this.loading = true;

    this.userProfileService.getUserProfile(login)
      .subscribe(
        (data: IResult<UserProfileModel>) => {
          const { success, error } = data

          this.user = success!;

          if (error) {
            this.handleError(error);
          }

          if (success) {
            this.user = success!;
          }
        },
        (error) => {
          console.error(error);
        },
        () => {
          this.loading = false;
        }
      );
  }

  // Using Promises
  async asyncGetUserProfile(login: string) {
    try {
      this.loading = true;

      const { success, error } = await this.userProfileService.asyncGetUserProfile(login)

      if (error) {
        this.handleError(error);
      }

      if (success) {
        this.user = success!;
      }
    } catch (error) {
      console.error(error);
    } finally {
      this.loading = false
    }
  }
}
