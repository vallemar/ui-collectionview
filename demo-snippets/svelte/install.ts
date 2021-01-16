import CollectionViewElement from '@nativescript-community/ui-collectionview/svelte';

import GridDemo from './GridDemo.svelte';
import Development from './Development.svelte';

export function install() {
    CollectionViewElement.register();
}

export const demos = [
    { name: 'Grid Demo', component: GridDemo },
    { name: 'Development', component: Development }
];
