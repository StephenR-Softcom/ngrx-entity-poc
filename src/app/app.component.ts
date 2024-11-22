import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectAllEntityL1Items, selectAllEntityL2Items, selectAllEntityL3Items } from './state/selectors';
import { Observable } from 'rxjs';
import { EntityViewComponent } from './node-view/entity-view.component';
import { AddEntityComponent } from './add-node/add-entity.component';
import { EntityType } from './state/app.state';
import { Entity, EntityL1, EntityL2, EntityL3 } from './state/entity.types';
import { resetToInitialState } from './state/actions';
import { ExampleDataService } from './example-data.service';

type EntityViewDefinition = {
  name: string,
  type: EntityType,
  data$: Observable<Entity[]>,
  childType: EntityType | null,
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    AsyncPipe,
    EntityViewComponent,
    AddEntityComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ngrx-entity-poc';

  protected readonly exampleDataDescription = ExampleDataService.dataDescription;

  private readonly exampleDataService = inject(ExampleDataService);
  private readonly store = inject(Store);

  readonly entityL1Items$: Observable<EntityL1[]> = this.store.select(selectAllEntityL1Items);
  readonly entityL2Items$: Observable<EntityL2[]>  = this.store.select(selectAllEntityL2Items);
  readonly entityL3Items$: Observable<EntityL3[]>  = this.store.select(selectAllEntityL3Items);

  /**
   * This configures the entities to display in the UI
   */
  readonly entityViewDefinitions: readonly EntityViewDefinition[] = [
    {
      name: 'entityL1 (First Name)',
      type: 'entityL1',
      data$: this.entityL1Items$,
      childType: 'entityL2'
    },
    {
      name: 'entityL2 (Last Name)',
      type: 'entityL2',
      data$: this.entityL2Items$,
      childType: 'entityL3'
    },
    {
      name: 'entityL3 (Role)',
      type: 'entityL3',
      data$: this.entityL3Items$,
      childType: null
    }
  ];
  createExampleData(): void {
    this.exampleDataService.createExampleData();
  }

  // Reset whole store
  resetData(): void {
    this.store.dispatch(resetToInitialState());
  }

}
