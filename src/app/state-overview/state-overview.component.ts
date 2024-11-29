import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../state/app.state';
import { Observable } from 'rxjs';
import { Entity, EntityL1, EntityL2, EntityL3, EntityL3Other, EntityType } from '../state/entity.types';
import {
  selectAllEntityL1Items,
  selectAllEntityL2Items,
  selectAllEntityL3Items,
  selectAllEntityL3OtherItems
} from '../state/selectors';
import { AddEntityComponent } from '../add-node/add-entity.component';
import { EntityRowComponent } from '../entity-row/entity-row.component';
import { AsyncPipe } from '@angular/common';

/**
 * Just a summary of how to display each entity in the view.
 */
type EntityViewDefinition = {
  name: string,
  type: EntityType,
  data$: Observable<Entity[]>,
  allowedChildTypes: EntityType[] | null,
};

@Component({
  selector: 'app-state-overview',
  standalone: true,
  imports: [
    AddEntityComponent,
    EntityRowComponent,
    AsyncPipe
  ],
  templateUrl: './state-overview.component.html',
  styleUrl: './state-overview.component.css'
})
export class StateOverviewComponent {

  private readonly store: Store<AppState> = inject(Store<AppState>);

  readonly entityL1Items$: Observable<EntityL1[]> = this.store.select(selectAllEntityL1Items);
  readonly entityL2Items$: Observable<EntityL2[]>  = this.store.select(selectAllEntityL2Items);
  readonly entityL3Items$: Observable<EntityL3[]>  = this.store.select(selectAllEntityL3Items);
  readonly entityL3OtherItems$: Observable<EntityL3Other[]>  = this.store.select(selectAllEntityL3OtherItems);

  /**
   * This configures the entities to display in the UI
   */
  readonly entityViewDefinitions: readonly EntityViewDefinition[] = [
    {
      name: 'entityL1 (First Name)',
      type: 'entityL1',
      data$: this.entityL1Items$,
      allowedChildTypes: ['entityL2']
    },
    {
      name: 'entityL2 (Last Name)',
      type: 'entityL2',
      data$: this.entityL2Items$,
      allowedChildTypes: ['entityL3', 'entityL3Other']
    },
    {
      name: 'entityL3 (Role)',
      type: 'entityL3',
      data$: this.entityL3Items$,
      allowedChildTypes: null
    },
    {
      name: 'entityL3Other (Style)',
      type: 'entityL3Other',
      data$: this.entityL3OtherItems$,
      allowedChildTypes: null
    },
  ];

}
