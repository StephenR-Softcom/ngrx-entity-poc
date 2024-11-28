import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EntityDetailsViewComponent } from '../entity-details-view/entity-details-view.component';
import { EntityType, entityTypeByString } from '../state/entity.types';

/**
 * Page component for displaying details of a single entity.
 * For the actual, recursive view, see {@link EntityDetailsViewComponent}.
 */
@Component({
  selector: 'app-entity-details',
  standalone: true,
  imports: [
    EntityDetailsViewComponent,
    RouterLink
  ],
  templateUrl: './entity-details.component.html',
  styleUrl: './entity-details.component.css'
})
export class EntityDetailsComponent {

  entityId: string | undefined;
  entityType: EntityType | undefined;

  constructor(
    route: ActivatedRoute,
  ) {
    const id = route.snapshot.paramMap.get('id');
    const entityTypeStr = route.snapshot.paramMap.get('type');

    if (id && entityTypeStr) {
      const entityType = entityTypeByString.get(entityTypeStr);
      if (entityType) {
        this.entityId = id;
        this.entityType = entityType;
      }
    }
  }

}
