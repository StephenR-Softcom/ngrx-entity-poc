import { Component, effect, inject, input } from '@angular/core';
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

  readonly entityTypes = input.required<EntityType[]>();

  readonly parentType = input.required<EntityType | null>();
  readonly parentId = input.required<string | null>();

  readonly placeholder = input.required<string>();

  readonly formGroup = new FormGroup({
    name: new FormControl<string>('', Validators.required),
    childType: new FormControl<EntityType | null>(null, Validators.required),
  });

  private readonly store = inject(Store);

  constructor() {
    effect(() => {
      const entityTypes = this.entityTypes();
      const defaultEntityType = entityTypes.length === 1 ? entityTypes[0] : null;
      this.formGroup.controls.childType.setValue(defaultEntityType);
    });
  }

  submit() {
    this.formGroup.updateValueAndValidity();
    if (this.formGroup.invalid) {
      return;
    }

    const value = this.formGroup.value;
    if (value.name && value.childType) {
      this.addEntity(value.name, value.childType);
      this.formGroup.controls.name.reset();
    }
  }

  addEntity(name: string, childType: EntityType) {
    const parentId = this.parentId();
    const parentType = this.parentType();
    const parentRef = parentId && parentType ? { id: parentId, type: parentType } : null;

    const entity: Entity = {
      id: generateId(),
      type: childType,
      name: name,
      parent: parentRef,
      children: []
    };

    this.store.dispatch(addEntity({ entity }));
  }

}
