import { inject, Injectable } from '@angular/core';
import { Entity, EntityL1, EntityL2, EntityL3 } from './state/entity.types';
import { addEntity } from './state/actions';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class ExampleDataService {

  private readonly store = inject(Store);

  public static dataDescription: string = `
    The example data contains examples for each entity type.
    It is person data, with relations between them.
  `;

  /**
   * Fill the store with several example entities of people.<br>
   * Note: Some share the same first name, to illustrate the entity relations.
   */
  public createExampleData(): void {
    const entityL1_1: EntityL1 = {
      id: '1',
      type: 'entityL1',
      parentId: null,
      name: 'John',
      childNodeIds: new Set(['1-1', '1-2']),
    };
    const entityL2_1_1: EntityL2 = {
      id: '1-1',
      type: 'entityL2',
      parentId: '1',
      name: 'Wayne',
      childNodeIds: new Set(['1-1-1']),
      rank: 1,
    };
    const entityL2_1_2: EntityL2 = {
      id: '1-2',
      type: 'entityL2',
      parentId: '1',
      name: 'Lennon',
      childNodeIds: new Set(['1-2-1']),
      rank: 2,
    };
    const entityL3_1_1_1: EntityL3 = {
      id: '1-1-1',
      type: 'entityL3',
      parentId: '1-1',
      name: 'Actor',
      childNodeIds: new Set(),
      date: '1907-01-01',
    }
    const entityL3_1_2_1: EntityL3 = {
      id: '1-2-1',
      type: 'entityL3',
      parentId: '1-2',
      name: 'Musician',
      childNodeIds: new Set(),
      date: '1940-01-01',
    }

    const entityL1_2: EntityL1 = {
      id: '2',
      type: 'entityL1',
      parentId: null,
      name: 'Stephen',
      childNodeIds: new Set(['2-1']),
    };
    const entityL2_2_1: EntityL2 = {
      id: '2-1',
      type: 'entityL2',
      parentId: '2',
      name: 'King',
      childNodeIds: new Set(['2-1-1']),
      rank: 1,
    };
    const entityL3_2_1_1: EntityL3 = {
      id: '2-1-1',
      type: 'entityL3',
      parentId: '2-1',
      name: 'Author',
      childNodeIds: new Set(),
      date: '1947-01-01',
    }

    const entityL1_3: EntityL1 = {
      id: '3',
      type: 'entityL1',
      parentId: null,
      name: 'Donald',
      childNodeIds: new Set(['3-1']),
    }
    const entityL2_3_1: EntityL2 = {
      id: '3-1',
      type: 'entityL2',
      parentId: '3',
      name: 'Duck',
      childNodeIds: new Set(['3-1-1']),
      rank: 1,
    };
    const entityL3_3_1_1: EntityL3 = {
      id: '3-1-1',
      type: 'entityL3',
      parentId: '3-1',
      name: 'Cartoon Character',
      childNodeIds: new Set(),
      date: '1934-01-01',
    }

    const entities: Entity[] = [
      entityL1_1,
      entityL2_1_1,
      entityL2_1_2,
      entityL3_1_1_1,
      entityL3_1_2_1,
      entityL1_2,
      entityL2_2_1,
      entityL3_2_1_1,
      entityL1_3,
      entityL2_3_1,
      entityL3_3_1_1,
    ];
    entities.forEach(e => this.store.dispatch(addEntity({entity: e})));
  }

}
