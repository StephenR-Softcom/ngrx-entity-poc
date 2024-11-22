import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityViewComponent } from './entity-view.component';

describe('NodeViewComponent', () => {
  let component: EntityViewComponent;
  let fixture: ComponentFixture<EntityViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntityViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntityViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
