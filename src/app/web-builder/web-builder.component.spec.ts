import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebBuilderComponent } from './web-builder.component';

describe('WebBuilderComponent', () => {
  let component: WebBuilderComponent;
  let fixture: ComponentFixture<WebBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebBuilderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
