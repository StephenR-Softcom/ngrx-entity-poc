import { Component, inject, input } from '@angular/core';
import { EntityType } from '../state/app.state';
import { AddEntityComponent } from '../add-node/add-entity.component';
import { Store } from '@ngrx/store';
import { deleteEntity } from '../state/actions';
import { Entity } from '../state/entity.types';

@Component({
  selector: 'app-node-view',
  standalone: true,
  imports: [
    AddEntityComponent,
  ],
  templateUrl: './node-view.component.html',
  styleUrl: './node-view.component.css'
})
export class NodeViewComponent {

  readonly nodes = input.required<Entity[] | null>();
  readonly childType = input.required<EntityType | null>();

  private readonly store = inject(Store);

  deleteEntity(entity: Entity) {
    this.store.dispatch(deleteEntity({ entity }));
  }
}
