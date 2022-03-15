import * as React from 'react';
import { FC, useCallback, useLayoutEffect, useRef, useState } from 'react';
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
    useLayoutEffect(() => {
        const viewport = viewportRef.current;
        if (viewport === null) return;
        layoutManager.setViewportSize(viewport.clientWidth, viewport.clientHeight);
    }, [layoutManager]);

    const scrollerRef = useRef<HTMLDivElement | null>(null);
    const onScroll = useCallback(() => {
        const scroller = scrollerRef.current;
        if (scroller === null) return;
        layoutManager.setScrollPosition(scroller.scrollLeft, scroller.scrollTop);
    }, [layoutManager]);

    return (
        <div
            ref={viewportRef}
            style={{
                position: 'fixed',
                inset: 0,
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    overflow: 'hidden',
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
            <div
                ref={scrollerRef}
                style={{
                    position: 'absolute',
                    inset: 0,
                    overflow: 'auto',
                }}
                onScroll={onScroll}
            >
                <div
                    style={{
                        position: 'relative',
                        width: layout.scrollWidth,
                        height: layout.scrollHeight,
                    }}
                >
                    &nbsp;
                </div>
            </div>
        </div>
    );
};
