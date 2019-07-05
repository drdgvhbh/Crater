import React, { useLayoutEffect, useRef, useState } from 'react';
import { Pie, PieChart, Sector } from 'recharts';

export interface Asset {
  name: string;
  value: number;
  color: string;
  quantity: number;
}

export interface AssetPieChartProps {
  assets: Asset[];
  totalAccountValueInUSD: number;
}

interface RenderActiveShapeProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  fill: string;
  percent: number;
  payload: Asset;
}

const AssetPieChart = ({
  assets,
  totalAccountValueInUSD,
}: AssetPieChartProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dimensions, setDimensions] = useState<ClientRect | DOMRect>();
  const [isMouseOn, setIsMouseOn] = useState<boolean>();

  useLayoutEffect(() => {
    setDimensions(ref.current!!.getBoundingClientRect());
  }, [ref.current]);

  const onPieEnter = (data: any, index: number) => {
    setIsMouseOn(true);
    setActiveIndex(index);
  };

  const onPieExit = () => {
    setIsMouseOn(false);
  };

  const renderActiveShape = (props: RenderActiveShapeProps) => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      percent,
      payload: { name, quantity, value, color: assetColor },
    } = props;
    const sin = Math.sin(-RADIAN * midAngle + 1);
    const cos = Math.cos(-RADIAN * midAngle + 1);
    const sx = cx + (outerRadius + 5) * cos;
    const sy = cy + (outerRadius + 5) * sin;
    const mx = cx + (outerRadius + 15) * cos;
    const my = cy + (outerRadius + 15) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 11;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {isMouseOn ? name.toUpperCase() : 'assets'.toUpperCase()}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={assetColor}
        />
        {isMouseOn && (
          <React.Fragment>
            <Sector
              cx={cx}
              cy={cy}
              startAngle={startAngle}
              endAngle={endAngle}
              innerRadius={outerRadius + 6}
              outerRadius={outerRadius + 10}
              fill={assetColor}
            />
            <path
              d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
              stroke={assetColor}
              fill="none"
            />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
            <text
              x={ex + (cos >= 0 ? 1 : -1) * 12}
              y={ey}
              textAnchor={textAnchor}
              fill="#333"
            >
              {new Intl.NumberFormat('en-CA', {
                maximumFractionDigits: 5,
              }).format(quantity)}
            </text>
            <text
              x={ex + (cos >= 0 ? 1 : -1) * 12}
              y={ey}
              dy={18}
              textAnchor={textAnchor}
              fill="#999"
            >
              {`(${(percent * 100).toFixed(2)}%)`}
            </text>
          </React.Fragment>
        )}
        <text x={cx} y={1.95 * cy} dy={8} textAnchor="middle" fill={fill}>
          {isMouseOn
            ? new Intl.NumberFormat('en-CA', {
                style: 'currency',
                currency: 'USD',
              }).format(value)
            : new Intl.NumberFormat('en-CA', {
                style: 'currency',
                currency: 'USD',
              }).format(totalAccountValueInUSD)}
        </text>
      </g>
    );
  };

  const width = dimensions ? dimensions.width : 0;
  const height = 191.25;
  return (
    <div ref={ref}>
      <PieChart width={width} height={height}>
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          data={assets}
          cx={width * 0.49}
          cy={height * 0.44117}
          innerRadius={0.13235 * width}
          outerRadius={0.17647 * width}
          fill="#5B6A8C"
          dataKey="value"
          onMouseEnter={onPieEnter}
          onMouseLeave={onPieExit}
        />
      </PieChart>
    </div>
  );
};

export default AssetPieChart;

/* const fakeData = [
  {
    name: 'native',
    value: 1209.8249998726499,
    quantity: 9499.999999,
    color: '#313A4F',
  },
  {
    name: 'btc',
    value: 5000,
    quantity: 0.12366666,
    color: '#587396',
  },
  {
    name: 'eth',
    value: 4235,
    quantity: 3.12366666,
    color: '#7DB2E3',
  },
] */
