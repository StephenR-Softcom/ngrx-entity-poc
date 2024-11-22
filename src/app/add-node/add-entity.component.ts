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

  readonly parentType = input.required<EntityType | null>();
  readonly parentId = input.required<string | null>();

  readonly placeholder = input.required<string>();

  readonly formGroup = new FormGroup({
    name: new FormControl('', Validators.required)
  });

  private readonly store = inject(Store);

  submit() {
    this.formGroup.updateValueAndValidity();
    if (this.formGroup.invalid) {
      return;
    }

    const value = this.formGroup.value;
    if (value.name) {
      this.addEntity(value.name);
      this.formGroup.reset();
    }
  }

  addEntity(name: string) {
    const parentId = this.parentId();
    const parentType = this.parentType();
    const parentRef = parentId && parentType ? { id: parentId, type: parentType } : null;

    const entity: Entity = {
      id: generateId(),
      type: this.entityType(),
      name: name,
      parent: parentRef,
      children: []
    };

    this.store.dispatch(addEntity({ entity }));
  }

}
