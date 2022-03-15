import * as React from 'react';
import { FC, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { LayoutManager } from './LayoutManager';

export const VirtualTableView: FC<{
    layoutManager: LayoutManager;
}> = ({ layoutManager }) => {
    const [layout, setLayout] = useState(layoutManager.getLayout());
    useLayoutEffect(() => {
        const handler = () => setLayout(layoutManager.getLayout());
        layoutManager.onChange.addListener(handler);
        return () => {
            layoutManager.onChange.removeListener(handler);
        };
    }, [layoutManager]);

    const viewportRef = useRef<HTMLDivElement | null>(null);
    const notifyViewPortSize = useCallback(() => {
        const viewport = viewportRef.current;
        if (viewport === null) return;
        layoutManager.setViewportSize(viewport.clientWidth, viewport.clientHeight);
    }, [layoutManager]);
    useLayoutEffect(notifyViewPortSize, [notifyViewPortSize]);
    useEffect(() => {
        window.addEventListener('resize', notifyViewPortSize);
        return () => window.removeEventListener('resize', notifyViewPortSize);
    }, [notifyViewPortSize]);
    const onScroll = useCallback(() => {
        const viewport = viewportRef.current;
        if (viewport === null) return;
        layoutManager.setScrollPosition(viewport.scrollLeft, viewport.scrollTop);
    }, [layoutManager]);

    return (
        <div
            ref={viewportRef}
            style={{
                position: 'relative',
                border: '1px solid #000',
                margin: '10vh 10vw',
                height: '80vh',
                width: '80vw',
                overflow: 'auto',
                boxSizing: 'border-box',
            }}
            onScroll={onScroll}
        >
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: layout.scrollWidth,
                    height: layout.scrollHeight,
                }}
            />
            <div
                style={{
                    position: 'sticky',
                    inset: 0,
                    overflow: 'hidden',
                    width: '100%',
                    height: '100%',
                }}
            >
                {layout.items.map(({ top, left, width, height, itemKey, viewKey }) => {
                    if (itemKey === '') {
                        return (
                            <div
                                key={viewKey}
                                style={{
                                    position: 'absolute',
                                    visibility: 'hidden',
                                    top,
                                    left,
                                    width,
                                    height,
                                    background: parseInt(itemKey) % 2 === 1 ? '#f0f0f0' : '#ffffff',
                                }}
                            />
                        );
                    } else {
                        return (
                            <div
                                key={viewKey}
                                style={{
                                    position: 'absolute',
                                    top,
                                    left,
                                    width,
                                    height,
                                    background: parseInt(itemKey) % 2 === 1 ? '#f0f0f0' : '#ffffff',
                                }}
                            >
                                Item={itemKey} DOM={viewKey}
                            </div>
                        );
                    }
                })}
            </div>
        </div>
    );
};
