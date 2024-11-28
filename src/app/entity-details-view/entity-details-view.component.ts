import { Component, inject, input, OnInit } from '@angular/core';
import { AppState } from '../state/app.state';
import { Observable, of } from 'rxjs';
import { Entity, EntityType } from '../state/entity.types';
import { Store } from '@ngrx/store';
import { createSelectorForEntityByIdAndType } from '../state/selectors';
import { AsyncPipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-entity-details-view',
  standalone: true,
  imports: [
    AsyncPipe,
    JsonPipe
  ],
  templateUrl: './entity-details-view.component.html',
  styleUrl: './entity-details-view.component.css'
})
export class EntityDetailsViewComponent implements OnInit {

  entity$: Observable<Entity | undefined> = of(undefined);

  readonly entityId = input.required<string>();
  readonly entityType = input.required<EntityType>();
  readonly collapsed = input<boolean>(true);
  readonly level = input.required<number>();

  private readonly store: Store<AppState> = inject(Store<AppState>);

  ngOnInit() {
    const entitySelector = createSelectorForEntityByIdAndType(
      this.entityType(), this.entityId());
    this.entity$ = this.store.select(entitySelector);
  }

}
