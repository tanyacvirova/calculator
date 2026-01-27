import { useState, useEffect, useRef } from 'react';
import { useDimensions } from '../hooks/useDimensions.js';

const HIGHLIGHT_DURATION = 400;

const Cover = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const chartRef = useRef(null);
  const chartSize = useDimensions(chartRef);

  const circleCount = (() => {
    const w = chartSize.width || 0;
    if (w < 450) return 10;
    if (w < 800) return 15;
    return 19;
  })();

  useEffect(() => {
    // Sequence the highlights
    const interval = setInterval(() => {
      setActiveIndex(prevIndex => (prevIndex + 1) % (circleCount + 1));
    }, HIGHLIGHT_DURATION);

    return () => clearInterval(interval);
  }, [circleCount]);

  // Function to calculate the position of each circle
  const getCirclePosition = (index) => {
    const angleStart = 220;
    const angleEnd = 320;
    const radius = Math.min(chartSize.width || 0, 1200) * 0.6;
    const centerX = (chartSize.width || 0) * 0.5;
    const centerY = chartSize.width < 600 ? (chartSize.width || 0) * 0.7 : (chartSize.width || 0) * 0.65;

    const angle = angleStart + (index / circleCount) * (angleEnd - angleStart);
    const angleInRadians = angle * (Math.PI / 180); 

    const left = centerX + radius * Math.cos(angleInRadians);
    const top = centerY + radius * Math.sin(angleInRadians);

    // Dynamic size capped to avoid overlaps based on arc spacing
    const angleSpanRad = (angleEnd - angleStart) * (Math.PI / 180);
    const arcLength = radius * angleSpanRad;
    const spacing = arcLength / circleCount;
    const baseSize = chartSize.width > 1100 ? 66 : chartSize.width < 700 ? 42 : 58;
    const size = Math.min(baseSize, spacing * 0.7);

    return { 
      top,
      left,
      width: size, 
      height: size 
    };
  };

  const getCircleClass = (index) => {
    let className = 'circle';
    if (activeIndex === index) {
      className += ' highlighted';
    } else if (index <= activeIndex) {
      className += ' passed';
    }
    return className;
  };

  return (
    <div 
      ref={chartRef}
      className="circle-container" 
      style={{ width: "100%", height: chartSize.width < 700 ? 300 : 500 }}
    >
      <div className='cover-headline'>
        <h1 className='cover-title'>Сколько вы зарабатываете</h1>
        <p className='cover-subtitle'>По сравнению с остальными жителями России</p>
      </div>
      {[...Array(circleCount + 1)].map((_, index) => (
        <div
          key={index}
          className={getCircleClass(index)}
          style={getCirclePosition(index)}
        />
      ))}
    </div>
  );
};

export default Cover;
