import React from 'react';
import { cn } from '../../utils/cn';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { metricsData } from '../../data/mockData';

interface MetricCardProps {
  data: {
    title: string;
    value: string | number;
    change: number;
    icon: React.ReactNode;
  };
  onClick?: () => void;
  className?: string;
}

export default function MetricCard({
  data,
  onClick,
  className,
}: MetricCardProps) {
  const { title, value, change, icon } = data;
  const isPositive = change >= 0;

  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-lg border border-primary-100 p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg',
        className
      )}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-primary-400 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-2xl font-semibold text-primary-600">{value}</h3>
          
          <div className="flex items-center mt-2">
            <span 
              className={cn(
                "flex items-center text-xs font-medium",
                isPositive ? "text-success-600" : "text-error-600"
              )}
            >
              {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              <span className="ml-1">{Math.abs(change)}%</span>
            </span>
            <span className="text-xs text-primary-400 ml-1.5">vs last month</span>
          </div>
        </div>
        
        <div className="p-2.5 rounded-md bg-primary-50 text-primary-600">
          {icon}
        </div>
      </div>
    </div>
  );
}