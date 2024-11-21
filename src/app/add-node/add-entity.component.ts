import { Component, inject, input } from '@angular/core';
import { Store } from '@ngrx/store';
import { EntityType } from '../state/app.state';
import { addEntity } from '../state/actions';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Entity } from '../state/entity.types';
import { generateId } from '../generate-id.util';

@Component({
  selector: 'app-add-entity',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './add-entity.component.html',
  styleUrl: './add-entity.component.css'
})
export class AddEntityComponent {

  readonly entityType = input.required<EntityType>();
  readonly parentId = input.required<string>();
  readonly placeholder = input.required<string>();

  readonly formGroup = new FormGroup({
    name: new FormControl('', Validators.required)
  });

  private readonly store = inject(Store);

  submit() {
    this.formGroup.updateValueAndValidity();

    const value = this.formGroup.value;
    if (value.name) {
      this.addNode(value.name);
    }
  }

  addNode(name: string) {
    const node: Entity = {
      id: generateId(),
      parentId: this.parentId(),
      type: this.entityType(),
      name: name,
      childNodeIds: new Set(),
    };
    this.store.dispatch(addEntity({ entity: node }));
  }

}
