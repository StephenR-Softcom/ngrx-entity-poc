import { Component, inject, input } from '@angular/core';
import { AddEntityComponent } from '../add-node/add-entity.component';
import { Store } from '@ngrx/store';
import { deleteEntity } from '../state/actions';
import { Entity, EntityType } from '../state/entity.types';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-entity-row',
  standalone: true,
  imports: [
    AddEntityComponent,
    RouterLink,
  ],
  templateUrl: './entity-row.component.html',
  styleUrl: './entity-row.component.css'
})
export class EntityRowComponent {

  readonly entityType = input.required<EntityType>();
  readonly entities = input.required<Entity[] | null>();

  /**
   * Child type that may be added to this entity.
   */
  readonly allowedChildTypes = input.required<EntityType[] | null>();

  private readonly store = inject(Store);

  deleteEntity(entity: Entity) {
    this.store.dispatch(deleteEntity({ entity }));
  }

}
