import { createEvent } from '../../lib/Event';
import { ItemLayout } from './ItemLayout';
import { Layout, LayoutManager } from './LayoutManager';

const ITEM_HEIGHT = 50;

export class ListViewLayoutManager implements LayoutManager {
    readonly onChange = createEvent();
    private readonly itemKeys: string[];
    private readonly itemTops: number[];
    private scrollLeft = 0;
    private scrollTop = 0;
    private viewportWidth = 0;
    private viewportHeight = 0;
    private itemLayouts: ItemLayout[] = [];
    private numViews = 0;

    constructor(itemKeys: string[]) {
        this.itemKeys = itemKeys;
        this.itemTops = [];

        let top = 0;
        for (let i = 0; i < itemKeys.length; i++) {
            this.itemTops[i] = top;
            top += ITEM_HEIGHT;
        }

        this.recomputeVisibleItems();
    }

    getLayout(): Layout {
        return {
            scrollHeight: (this.itemTops.at(-1) ?? 0) + ITEM_HEIGHT,
            scrollWidth: this.viewportWidth,
            items: this.itemLayouts,
        };
    }

    setItemSize(itemKey: string, width: number, height: number): void {
        // TODO
    }

    setScrollPosition(left: number, top: number): void {
        if (this.scrollLeft === left && this.scrollTop === top) return;
        this.scrollLeft = left;
        this.scrollTop = top;
        this.recomputeVisibleItems();
    }

    setViewportSize(width: number, height: number): void {
        if (this.viewportWidth === width && this.viewportHeight === height) return;
        this.viewportWidth = width;
        this.viewportHeight = height;
        this.recomputeVisibleItems();
    }

    private recomputeVisibleItems() {
        const visibleAreaTop = this.scrollTop;
        const visibleAreaBottom = visibleAreaTop + this.viewportHeight;

        const indexFrom = binarySearch(this.itemTops, visibleAreaTop);
        const indexTo = binarySearch(this.itemTops, visibleAreaBottom);

        this.itemLayouts = [];
        this.numViews = Math.max(this.numViews, indexTo - indexFrom + 1);

        for (let i = indexFrom; i < indexFrom + this.numViews; i++) {
            if (i <= indexTo) {
                this.itemLayouts.push({
                    viewKey: `${i % this.numViews}`,
                    itemKey: this.itemKeys[i],
                    top: this.itemTops[i] - this.scrollTop,
                    height: ITEM_HEIGHT,
                    left: 0,
                    width: this.viewportWidth,
                });
            } else {
                this.itemLayouts.push({
                    viewKey: `${i % this.numViews}`,
                    itemKey: '',
                    top: -1,
                    height: -1,
                    left: 0,
                    width: 0,
                });
            }
        }

        this.onChange.fire();
    }
}

function binarySearch(sortedArray: number[], value: number): number {
    let from = 0;
    let to = sortedArray.length;

    while (to > from + 1) {
        const mid = Math.floor((from + to) / 2);

        if (sortedArray[mid] === value) {
            return mid;
        } else if (sortedArray[mid] > value) {
            to = mid;
        } else {
            from = mid;
        }
    }

    return from;
}
