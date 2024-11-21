# NgrxEntityPoc

## Description
This project is a proof of concept for the use of ngrx and ngrx-entity in an Angular application.
Specifically, entities can have relations between different types.
Deleting one entity should also delete the related entities.

## Usage
The Angular application provides a very simple UI where entities can be created and deleted.
In the row of an entity, a related entity can be created directly.
Use the Angular UI to create and view the behaviour of the entity store.

The ngx-devtools browser plugin can be used to inspect the state of the application.

## Solution
The following entities are defined for the proof of concept:
...

The state contains a different slice for each entity type.
Each entity state is updated using its own reducer.
Deletions however are propagated from an entity to its child entities using a specific reducer, _deleteReducer_.
Some functionality is handled generically thanks to ngrx-entity.
Each entity type has its own config, defining the relations between entity types.

## Sidenotes
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.12.
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.
Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).
