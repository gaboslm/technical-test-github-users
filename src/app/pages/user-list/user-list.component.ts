import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { UserListService } from 'src/app/services/user-list/user-list.service';
import { IResult } from 'src/app/interfaces';
import { UserListModel } from 'src/app/models';
import { GlobalErrorService } from 'src/app/services/errors/global-error.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {
  searchForm!: FormGroup;
  users: UserListModel[] = [];
  perPage: number = 10;
  errorMessage: string = '';
  loading: boolean = false;
  skeletonItems: number[] = new Array(10).fill(0).map((_, index) => index + 1);

  constructor(
    private fb: FormBuilder,
    private userListService: UserListService,
    private globalErrorService: GlobalErrorService
  ) {
    this.searchForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4), this.forbiddenNameValidator(/doublevpartners/i)]]
    });
  }

  private handleError(message: string) {
    this.globalErrorService.showError(message ?? 'An error occurred while fetching data.');
  }

  forbiddenNameValidator(nameRe: RegExp) {
    return (control: AbstractControl): ValidationErrors | null => {
      const forbidden = nameRe.test(control.value);
      return forbidden ? { forbiddenName: { value: control.value } } : null;
    };
  }

  getUsernameErrors(): string[] {
    const errors = this.searchForm.get('username')?.errors;
    if (!errors) {
      return [];
    }

    const errorMessages: string[] = [];
    if (errors['required']) {
      errorMessages.push('Username is required.');
    }
    if (errors['minlength']) {
      errorMessages.push('Username must be at least 4 characters long.');
    }
    if (errors['forbiddenName']) {
      errorMessages.push('Search term "doublevpartners" is not allowed.');
    }

    return errorMessages;
  }

  onSubmit() {
    if (this.searchForm.invalid || this.loading) {
      return;
    }

    const username = this.searchForm.get('username')?.value;

    this.loading = true;

    this.getUserList(username)
    //this.asyncGetUserList(username)
  }

  // Using Observables
  getUserList(username: string) {
    this.loading = true;

    this.userListService.searchUsers(username, this.perPage)
      .subscribe(
        (data: IResult<UserListModel[]>) => {
          const { success, error } = data

          this.users = success!;

          if (error) {
            this.handleError(error);
          }

          if (success) {
            this.users = success!;
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
  async asyncGetUserList(username: string) {
    try {
      this.loading = true;

      const { success, error } = await this.userListService.asyncSearchUsers(username, this.perPage)

      if (error) {
        this.handleError(error);
      }

      if (success) {
        this.users = success!;
      }
    } catch (error) {
      console.error(error);
    } finally {
      this.loading = false
    }
  }
}
