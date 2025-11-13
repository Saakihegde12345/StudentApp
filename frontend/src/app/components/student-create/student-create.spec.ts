import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentCreate } from './student-create';

describe('StudentCreate', () => {
  let component: StudentCreate;
  let fixture: ComponentFixture<StudentCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
