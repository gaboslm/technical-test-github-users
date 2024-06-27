import { Component, OnInit } from '@angular/core';
import { GlobalErrorService } from 'src/app/services/errors/global-error.service';

@Component({
  selector: 'app-global-error-message',
  templateUrl: './global-error-message.component.html',
  styleUrls: ['./global-error-message.component.scss']
})
export class GlobalErrorMessageComponent implements OnInit {
  errorMessage: string | null = null;

  constructor(private globalErrorService: GlobalErrorService) { }

  ngOnInit() {
    this.globalErrorService.error$.subscribe(message => {
      this.errorMessage = message;
      setTimeout(() => {
        this.errorMessage = null;
      }, 5000); // Hide error message after 5 seconds
    });
  }
}