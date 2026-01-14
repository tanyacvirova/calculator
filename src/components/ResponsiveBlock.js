import { useRef } from 'react';
import { useDimensions } from '../hooks/useDimensions.js';

function ResponsiveBlock({ component: Component, extraPropData, maxHeight, mini }) {
    const chartRef = useRef(null);
    const chartSize = useDimensions(chartRef);

    return (
        <div 
            ref={chartRef}
            style={{ 
                width: '100%',
                height: `${maxHeight}px`}}
        >
            <Component 
                height={chartSize.height}
                width={chartSize.width} 
                mini={mini}
                content={extraPropData} 
            />
        </div>
    );
};

export default ResponsiveBlock;