import { inject, Injectable } from '@angular/core';
import { Entity, EntityL1, EntityL2, EntityL3, EntityL3Other } from './state/entity.types';
import { addEntity } from './state/actions';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class ExampleDataService {

  private readonly store = inject(Store);

  public static dataDescription: string = `
    Add example data to the state.
    There are examples for each entity type.
    It is person data, with relations between the entities.
  `;

  /**
   * Fill the store with several example entities of people.<br>
   * Note: Some share the same first name, to illustrate the entity relations.
   */
  public createExampleData(): void {
    const entityL1_1: EntityL1 = {
      id: '1',
      type: 'entityL1',
      name: 'John',
      parent: null,
      children: [
        { id: '1-1', type: 'entityL2', },
        { id: '1-2', type: 'entityL2', },
      ],
    };
    const entityL2_1_1: EntityL2 = {
      id: '1-1',
      type: 'entityL2',
      name: 'Wayne',
      parent: { id: '1', type: 'entityL1', },
      children: [
        { id: '1-1-1', type: 'entityL3', },
      ],
      rank: 1,
    };
    const entityL2_1_2: EntityL2 = {
      id: '1-2',
      type: 'entityL2',
      name: 'Lennon',
      parent: { id: '1', type: 'entityL1', },
      children: [
        { id: '1-2-1', type: 'entityL3', },
        { id: '1-2-2', type: 'entityL3Other', },
      ],
      rank: 2,
    };
    const entityL3_1_1_1: EntityL3 = {
      id: '1-1-1',
      type: 'entityL3',
      name: 'Actor',
      parent: { id: '1-1', type: 'entityL2', },
      children: [],
      date: '1907-01-01',
    };
    const entityL3_1_2_1: EntityL3 = {
      id: '1-2-1',
      type: 'entityL3',
      name: 'Musician',
      parent: { id: '1-2', type: 'entityL2', },
      children: [],
      date: '1940-01-01',
    };
    const entityL3Other_1_2_2: EntityL3Other = {
      id: '1-2-2',
      type: 'entityL3Other',
      name: 'Pop Rock',
      parent: { id: '1-2', type: 'entityL2', },
      children: [],
      comment: 'Beatles music',
    };


    const entityL1_2: EntityL1 = {
      id: '2',
      type: 'entityL1',
      name: 'Stephen',
      parent: null,
      children: [
        { id: '2-1', type: 'entityL2', },
      ],
    };
    const entityL2_2_1: EntityL2 = {
      id: '2-1',
      type: 'entityL2',
      name: 'King',
      parent: { id: '2', type: 'entityL1', },
      children: [
        { id: '2-1-1', type: 'entityL3', },
        { id: '2-1-2', type: 'entityL3Other', },
      ],
      rank: 1,
    };
    const entityL3_2_1_1: EntityL3 = {
      id: '2-1-1',
      type: 'entityL3',
      name: 'Author',
      parent: { id: '2-1', type: 'entityL2', },
      children: [],
      date: '1947-01-01',
    };
    const entityL3Other_2_1_2: EntityL3Other = {
      id: '2-1-2',
      type: 'entityL3Other',
      name: 'Thriller',
      parent: { id: '2-1', type: 'entityL2', },
      children: [],
      comment: 'Scary',
    };

    const entityL1_3: EntityL1 = {
      id: '3',
      type: 'entityL1',
      parent: null,
      name: 'Donald',
      children: [
        { id: '3-1', type: 'entityL2', },
      ],
    };
    const entityL2_3_1: EntityL2 = {
      id: '3-1',
      type: 'entityL2',
      name: 'Duck',
      parent: { id: '3', type: 'entityL1', },
      children: [
        { id: '3-1-1', type: 'entityL3', },
      ],
      rank: 1,
    };
    const entityL3_3_1_1: EntityL3 = {
      id: '3-1-1',
      type: 'entityL3',
      name: 'Cartoon Character',
      parent: { id: '3-1', type: 'entityL2', },
      children: [],
      date: '1934-01-01',
    };

    const entities: Entity[] = [
      entityL1_1,
      entityL2_1_1,
      entityL2_1_2,
      entityL3_1_1_1,
      entityL3_1_2_1,
      entityL3Other_1_2_2,
      entityL1_2,
      entityL2_2_1,
      entityL3_2_1_1,
      entityL3Other_2_1_2,
      entityL1_3,
      entityL2_3_1,
      entityL3_3_1_1,
    ];
    entities.forEach(e => this.store.dispatch(addEntity({entity: e})));
  }

}
