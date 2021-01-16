import Vue from 'nativescript-vue';
import CollectionView from '@nativescript-community/ui-collectionview/vue';

import GridDemo from './GridDemo.vue';
import Development from './Development.vue';

export function install() {
    Vue.use(CollectionView);
}

export const demos = [
    { name: 'Grid Demo', component: GridDemo },
    { name: 'Development', component: Development }
];
