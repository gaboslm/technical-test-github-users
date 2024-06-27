import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalErrorMessageComponent } from './global-error-message.component';

describe('GlobalErrorMessageComponent', () => {
  let component: GlobalErrorMessageComponent;
  let fixture: ComponentFixture<GlobalErrorMessageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GlobalErrorMessageComponent]
    });
    fixture = TestBed.createComponent(GlobalErrorMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
