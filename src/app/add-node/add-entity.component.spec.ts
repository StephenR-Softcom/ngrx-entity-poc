import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEntityComponent } from './add-entity.component';

describe('AddNodeComponent', () => {
  let component: AddEntityComponent;
  let fixture: ComponentFixture<AddEntityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEntityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
