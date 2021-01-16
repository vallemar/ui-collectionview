import { registerCollectionView } from '@nativescript-community/ui-collectionview/react';

import { GridDemo } from './GridDemo';
import { Development } from './Development';

export function install() {
    registerCollectionView();
}

export const demos = [
    { name: 'Grid Demo', path: 'GridDemo', component: GridDemo },
    { name: 'Development', path: 'development', component: Development }
];
