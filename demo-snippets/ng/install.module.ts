import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';

import { CollectionViewModule } from '@nativescript-community/ui-collectionview/angular';

import { GridDemoComponent } from './grid-demo/grid-demo.component';
import { DevelopmentComponent } from './development/development.component';

@NgModule({
    imports: [CollectionViewModule],
    exports: [CollectionViewModule],
    schemas: [NO_ERRORS_SCHEMA]
})
export class InstallModule {}

export const demos = [
    { name: 'Grid Demo', path: 'GridDemo', component: GridDemoComponent },
    { name: 'Development', path: 'development', component: DevelopmentComponent }
];

export const COMPONENTS = [GridDemoComponent, DevelopmentComponent];