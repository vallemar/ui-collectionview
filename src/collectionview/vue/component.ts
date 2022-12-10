import {ItemEventData, ObservableArray} from '@nativescript/core';
import {CollectionView as NCCollectionView} from '..';
import {defineComponent, getCurrentInstance, h, ref, registerElement, watch} from 'nativescript-vue';

const ELEMENT_REF = Symbol(__DEV__ ? `elementRef` : ``);

registerElement("NSCollectionView", () => NCCollectionView, {
    viewFlags: 8
});

const VUE_VIEW = '__vueVNodeRef__';

export interface ListItem<T = any> {
    item: T;
    index: number;
    even: boolean;
    odd: boolean;
}

function getListItem(item: any, index: number): ListItem {
    return {
        item,
        index,
        even: index % 2 === 0,
        odd: index % 2 !== 0,
    };
}

const LIST_CELL_ID = Symbol("list_cell_id");

export const CollectionView = /*#__PURE__*/ defineComponent({
    props: {
        items: {
            validator(value) {
                return Array.isArray(value) || value instanceof ObservableArray;
            },
        },
        itemTemplateSelector: Function,
    },
    setup(props, ctx) {
        console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
        const itemTemplates = Object.keys(ctx.slots).map((slotName) => {
            return {
                key: slotName,
                createView() {
                    // no need to return anything here
                },
            };
        });

        const getSlotName = (itemCtx: ListItem) =>
            props.itemTemplateSelector?.(itemCtx) ?? "default";

        const listView = ref(null);

        const vm = getCurrentInstance();

        watch(props, () => {
            try {
                if (props.items instanceof ObservableArray) {
                    return;
                }

                const lv: NCCollectionView = listView.value?.nativeView;
                lv?.refresh();
            } catch (err) {
                console.error("Error while refreshing ListView", err);
            }
        });

        let cellId = 0;

        interface ItemCellData {
            itemCtx: ListItem;
            slotName: string;
        }

        const cells = ref<Record<string, ItemCellData>>({});

        function onitemLoading(event: ItemEventData) {
            const el = event.view?.[ELEMENT_REF];
            const id = el?.nativeView[LIST_CELL_ID] ?? `LIST_CELL_${cellId++}`;

            const itemCtx: ListItem = getListItem(
                props.items instanceof ObservableArray
                    ? props.items.getItem(event.index)
                    : props.items[event.index],
                event.index
            );

            // update the cell data with the current row
            cells.value[id] = {
                itemCtx,
                slotName: getSlotName(itemCtx),
            };

            // trigger an update!
            vm.update();

            // find the vnode rendering this cell
            const vnode = (vm.subTree.children as { key: any, el: any }[]).find((vnode) => {
                return vnode.key === id;
            });

            // store the cell id on the Element itself so we can retrieve it when recycling kicks in
            const cellEl = vnode.el.nativeView;
            cellEl[LIST_CELL_ID] = id;

            // finally, set the event.view to the rendered cellEl
            event.view = cellEl;
        }

        function itemTemplateSelector(item, index) {
            // pass on the template selector call with the ListItem context
            return getSlotName(getListItem(item, index));
        }

        // render all realized templates as children
        const cellVNODES = () =>
            Object.entries(cells.value).map(([id, entry]) => {
                const vnodes: any[] = ctx.slots[entry.slotName]?.(entry.itemCtx) ?? [
                    // default template is just a label
                    h("Label", {
                        text: entry.itemCtx.item,
                    }),
                ];

                if (vnodes.length > 1) {
                    console.log(
                        `ListView template must contain a single root element. Found: ${vnodes.length}. Only the first one will be used.`
                    );
                }

                const vnode = vnodes[0];
                // set the key to the list cell id, so we can find this cell later...
                vnode.key = id;

                return vnode;
            });

        return () => {
            return h(
                "NSCollectionView",
                {
                    ref: listView,
                    items: props.items,
                    itemTemplates,
                    itemTemplateSelector,
                    onitemLoading,
                },
                cellVNODES()
            );
        };
    },
});