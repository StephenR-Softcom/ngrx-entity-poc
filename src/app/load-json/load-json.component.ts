import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../state/app.state';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { loadEntitiesFromDto } from '../state/actions';
import { EntityDto, EntityL2Dto } from '../model/dto';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-load-json',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    JsonPipe
  ],
  templateUrl: './load-json.component.html',
  styleUrl: './load-json.component.css'
})
export class LoadJsonComponent {

  private readonly store: Store<AppState> = inject(Store);
  private readonly fb: FormBuilder = inject(FormBuilder);

  protected readonly formGroup = this.fb.group({
    entityDtoJson: this.fb.control(''),
  });

  protected entitiesLoadedSuccess = false;

  readonly exampleEntityChildDto: EntityL2Dto = {
    id: 'id2',
    dtype: 'entityL2',
    name: 'L2 child entity',
    childNodes: [],
    rank: 12,
  };

  readonly exampleEntityDto: EntityDto = {
    id: 'id1',
    dtype: 'entityL1',
    name: 'L1 entity (root)',
    childNodes: [this.exampleEntityChildDto],
  };

  loadJsonIntoStore(): void {
    this.entitiesLoadedSuccess = false;
    const jsonText = this.formGroup.value.entityDtoJson;
    if (jsonText) {
      const jsonObject = JSON.parse(jsonText);
      try {
        this.assertIsEntityDto(jsonObject);
        this.store.dispatch(loadEntitiesFromDto({entityDto: jsonObject}));
        this.entitiesLoadedSuccess = true;
        setTimeout(() => this.entitiesLoadedSuccess = false, 5000);
      } catch (error) {
        console.error('Failed to load JSON into store:', error);
        this.formGroup.controls.entityDtoJson.setErrors({invalidJson: true});
      }
    }
  }

  assertIsEntityDto(json: any): asserts json is EntityDto {
    if (typeof json !== 'object' || json === null) {
      throw new Error('Invalid EntityDto: not an object');
    }
    if (!('id' in json) || !('dtype' in json) || !('name' in json) || !('childNodes' in json)) {
      throw new Error('Invalid EntityDto: missing required fields');
    }
  }

}
