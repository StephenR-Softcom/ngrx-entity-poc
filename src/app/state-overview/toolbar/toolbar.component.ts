import { Component, inject } from '@angular/core';
import { ExampleDataService } from '../../example-data.service';
import { resetToInitialState } from '../../state/actions';
import { Store } from '@ngrx/store';
import { AppState } from '../../state/app.state';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class ToolbarComponent {

  protected readonly exampleDataDescription = ExampleDataService.dataDescription;

  private readonly exampleDataService = inject(ExampleDataService);
  private readonly store: Store<AppState> = inject(Store<AppState>);

  /**
   * Fill store with example data.
   */
  createExampleData(): void {
    this.exampleDataService.createExampleData();
  }

  // Reset whole store
  resetData(): void {
    this.store.dispatch(resetToInitialState());
  }

}
