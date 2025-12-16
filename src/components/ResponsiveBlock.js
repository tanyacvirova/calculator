import { useRef } from 'react';
import { useDimensions } from '../hooks/useDimensions.js';

function ResponsiveBlock({ component: Component, extraPropData, maxHeight, mini }) {
    const chartRef = useRef(null);
    const chartSize = useDimensions(chartRef);
    const side = extraPropData.side ? extraPropData.side : false;
    const width = (mini && side) ? '235px' : (mini ? '205px' : '100%');

    return (
        <div 
            ref={chartRef}
            style={{ 
                width: width,
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