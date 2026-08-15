import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EngineerNavbar } from './engineer-navbar';

describe('EngineerNavbar', () => {
  let component: EngineerNavbar;
  let fixture: ComponentFixture<EngineerNavbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EngineerNavbar],
    }).compileComponents();

    fixture = TestBed.createComponent(EngineerNavbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
