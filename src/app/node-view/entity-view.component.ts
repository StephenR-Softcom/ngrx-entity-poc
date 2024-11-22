import { Component, inject, input } from '@angular/core';
import { EntityType } from '../state/app.state';
import { AddEntityComponent } from '../add-node/add-entity.component';
import { Store } from '@ngrx/store';
import { deleteEntity } from '../state/actions';
import { Entity } from '../state/entity.types';

@Component({
  selector: 'app-entity-view',
  standalone: true,
  imports: [
    AddEntityComponent,
  ],
  templateUrl: './entity-view.component.html',
  styleUrl: './entity-view.component.css'
})
export class EntityViewComponent {

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
