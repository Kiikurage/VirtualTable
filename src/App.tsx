import * as React from 'react';
import { useMemo } from 'react';
import { ListViewLayoutManager } from './view/component/ListViewLayoutManager';
import { VirtualTableView } from './view/component/VirtualTableView';

export function App() {
    const itemKeys = useMemo(() => {
        const itemKeys: string[] = [];
        for (let i = 0; i < 100000; i++) {
            itemKeys.push(i.toString());
        }
        return itemKeys;
    }, []);

    const layoutManager = useMemo(() => new ListViewLayoutManager(itemKeys), [itemKeys]);

    return <VirtualTableView layoutManager={layoutManager} />;
}
