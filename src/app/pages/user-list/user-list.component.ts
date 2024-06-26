import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { UserListService } from 'src/app/services/user-list/user-list.service';
import { finalize } from 'rxjs';
import { IResult } from 'src/app/interfaces';
import { UserModel } from 'src/app/models';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {
  searchForm!: FormGroup;
  users: UserModel[] = [];
  perPage: number = 10;
  errorMessage: string = '';
  loading: boolean = false;
  skeletonItems: number[] = new Array(10).fill(0).map((_, index) => index + 1);

  constructor(private fb: FormBuilder, private githubService: UserListService) {
    this.searchForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4), this.forbiddenNameValidator(/doublevpartners/i)]]
    });
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

    // Using Observables
    this.githubService.searchUsers(username, this.perPage)
      .pipe(
        finalize(() => this.loading = false) // finalize to set loading to false regardless of success or error
      )
      .subscribe(
        (data: IResult<UserModel[]>) => {
          this.users = data.success!;
          this.errorMessage = '';
        },
        (error) => {
          this.errorMessage = 'Error fetching user data';
        }
      );

    // Using Promises - Don't forget make async onSubmit()
    // try {
    //   const { success } = await this.githubService.asyncSearchUsers(username, this.perPage)
    //   this.users = success!;
    // } catch (error) {
    //   this.errorMessage = 'Error fetching user data';
    // } finally {
    //   this.loading = false
    // }
  }
}
