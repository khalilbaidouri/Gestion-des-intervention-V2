import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNavbar } from './admin-navbar';

describe('AdminNavbar', () => {
  let component: AdminNavbar;
  let fixture: ComponentFixture<AdminNavbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminNavbar],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminNavbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
