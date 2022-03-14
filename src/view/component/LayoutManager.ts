import { IEvent } from '../../lib/Event';
import { ItemLayout } from './ItemLayout';

export interface Layout {
    scrollWidth: number;
    scrollHeight: number;
    items: ItemLayout[];
}

export interface LayoutManager {
    onChange: IEvent<void>;

    getLayout(): Layout;

    setViewportSize(width: number, height: number): void;

    setScrollPosition(left: number, top: number): void;

    setItemSize(itemKey: string, width: number, height: number): void;
}
