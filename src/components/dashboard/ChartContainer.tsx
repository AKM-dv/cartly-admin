import { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { cn } from '../../utils/cn';

type ChartPeriod = 'day' | 'week' | 'month' | 'year';
type ChartMetric = 'revenue' | 'orders' | 'customers';

interface ChartContainerProps {
  className?: string;
}

// Sample data
const generateData = (period: ChartPeriod) => {
  if (period === 'day') {
    return Array.from({ length: 24 }, (_, i) => ({
      name: `${i}:00`,
      revenue: Math.floor(Math.random() * 5000) + 1000,
      orders: Math.floor(Math.random() * 20) + 5,
      customers: Math.floor(Math.random() * 15) + 3,
    }));
  } else if (period === 'week') {
    return [
      { name: 'Mon', revenue: 12500, orders: 43, customers: 25 },
      { name: 'Tue', revenue: 14250, orders: 52, customers: 30 },
      { name: 'Wed', revenue: 15800, orders: 58, customers: 35 },
      { name: 'Thu', revenue: 16200, orders: 60, customers: 32 },
      { name: 'Fri', revenue: 18500, orders: 70, customers: 42 },
      { name: 'Sat', revenue: 21000, orders: 82, customers: 48 },
      { name: 'Sun', revenue: 19500, orders: 75, customers: 44 },
    ];
  } else if (period === 'month') {
    return Array.from({ length: 30 }, (_, i) => ({
      name: `${i + 1}`,
      revenue: Math.floor(Math.random() * 25000) + 10000,
      orders: Math.floor(Math.random() * 100) + 40,
      customers: Math.floor(Math.random() * 60) + 20,
    }));
  } else {
    return [
      { name: 'Jan', revenue: 150000, orders: 420, customers: 180 },
      { name: 'Feb', revenue: 170000, orders: 460, customers: 210 },
      { name: 'Mar', revenue: 180000, orders: 480, customers: 220 },
      { name: 'Apr', revenue: 190000, orders: 510, customers: 240 },
      { name: 'May', revenue: 210000, orders: 550, customers: 260 },
      { name: 'Jun', revenue: 230000, orders: 590, customers: 280 },
      { name: 'Jul', revenue: 250000, orders: 630, customers: 300 },
      { name: 'Aug', revenue: 240000, orders: 610, customers: 290 },
      { name: 'Sep', revenue: 220000, orders: 570, customers: 270 },
      { name: 'Oct', revenue: 230000, orders: 590, customers: 280 },
      { name: 'Nov', revenue: 210000, orders: 550, customers: 260 },
      { name: 'Dec', revenue: 260000, orders: 650, customers: 310 },
    ];
  }
};

export default function ChartContainer({ className }: ChartContainerProps) {
  const [period, setPeriod] = useState<ChartPeriod>('month');
  const [metric, setMetric] = useState<ChartMetric>('revenue');
  
  const data = generateData(period);
  
  const metricConfig = {
    revenue: { 
      color: '#004CBF', 
      label: 'Revenue',
      formatter: (value: number) => `$${value.toLocaleString()}`
    },
    orders: { 
      color: '#3583F3', 
      label: 'Orders',
      formatter: (value: number) => value.toLocaleString()
    },
    customers: { 
      color: '#99c2ff', 
      label: 'Customers',
      formatter: (value: number) => value.toLocaleString()
    }
  };

  const currentMetricConfig = metricConfig[metric];

  const formatYAxis = (value: number) => {
    if (metric === 'revenue') {
      return value >= 1000 ? `$${(value / 1000).toFixed(0)}K` : `$${value}`;
    }
    return value;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-primary-100 rounded-md shadow-md">
          <p className="font-medium text-sm text-primary-600">{label}</p>
          <p className="text-sm text-primary-400">
            {currentMetricConfig.label}: {currentMetricConfig.formatter(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={cn("bg-white rounded-lg border border-primary-100 shadow-sm p-6", className)}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h3 className="text-lg font-semibold text-primary-600 mb-2 sm:mb-0">Performance Analytics</h3>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
          <select 
            className="px-3 py-2 border border-primary-100 rounded-md text-sm bg-white text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-400"
            value={metric}
            onChange={(e) => setMetric(e.target.value as ChartMetric)}
          >
            <option value="revenue">Revenue</option>
            <option value="orders">Orders</option>
            <option value="customers">Customers</option>
          </select>
          <select 
            className="px-3 py-2 border border-primary-100 rounded-md text-sm bg-white text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-400"
            value={period}
            onChange={(e) => setPeriod(e.target.value as ChartPeriod)}
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>
      
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E6F0FF" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12, fill: '#3583F3' }}
              tickMargin={10}
            />
            <YAxis 
              tickFormatter={formatYAxis}
              tick={{ fontSize: 12, fill: '#3583F3' }}
              tickMargin={10}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey={metric}
              stroke={currentMetricConfig.color}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              name={currentMetricConfig.label}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}