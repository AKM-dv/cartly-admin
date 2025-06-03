import { useState } from 'react';
import { cn } from '../../utils/cn';
import { ChevronDown, ChevronUp, ArrowUpDown } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  lastPurchase: string;
}

interface TopCustomersTableProps {
  className?: string;
}

// Sample data
const customers: Customer[] = [
  { id: '1', name: 'Emma Wilson', email: 'emma@example.com', totalOrders: 24, totalSpent: 4320, lastPurchase: '2023-04-12' },
  { id: '2', name: 'Liam Johnson', email: 'liam@example.com', totalOrders: 18, totalSpent: 3150, lastPurchase: '2023-04-15' },
  { id: '3', name: 'Olivia Smith', email: 'olivia@example.com', totalOrders: 16, totalSpent: 2840, lastPurchase: '2023-04-10' },
  { id: '4', name: 'Noah Williams', email: 'noah@example.com', totalOrders: 15, totalSpent: 2650, lastPurchase: '2023-04-08' },
  { id: '5', name: 'Ava Brown', email: 'ava@example.com', totalOrders: 14, totalSpent: 2450, lastPurchase: '2023-04-14' },
];

type SortField = 'name' | 'totalOrders' | 'totalSpent' | 'lastPurchase';
type SortDirection = 'asc' | 'desc';

export default function TopCustomersTable({ className }: TopCustomersTableProps) {
  const [sortField, setSortField] = useState<SortField>('totalSpent');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedCustomers = [...customers].sort((a, b) => {
    if (sortField === 'name') {
      return sortDirection === 'asc' 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    } else if (sortField === 'lastPurchase') {
      return sortDirection === 'asc' 
        ? new Date(a.lastPurchase).getTime() - new Date(b.lastPurchase).getTime()
        : new Date(b.lastPurchase).getTime() - new Date(a.lastPurchase).getTime();
    } else {
      // @ts-ignore
      return sortDirection === 'asc' ? a[sortField] - b[sortField] : b[sortField] - a[sortField];
    }
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (field !== sortField) return <ArrowUpDown size={14} />;
    return sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  return (
    <div className={cn("card", className)}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-neutral-900">Top Customers</h3>
        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
          View All
        </button>
      </div>
      
      <div className="overflow-x-auto -mx-6 px-6">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                <button 
                  className="flex items-center space-x-1"
                  onClick={() => handleSort('name')}
                >
                  <span>Customer</span>
                  <SortIcon field="name" />
                </button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                <button 
                  className="flex items-center space-x-1"
                  onClick={() => handleSort('totalOrders')}
                >
                  <span>Orders</span>
                  <SortIcon field="totalOrders" />
                </button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                <button 
                  className="flex items-center space-x-1"
                  onClick={() => handleSort('totalSpent')}
                >
                  <span>Total Spent</span>
                  <SortIcon field="totalSpent" />
                </button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                <button 
                  className="flex items-center space-x-1"
                  onClick={() => handleSort('lastPurchase')}
                >
                  <span>Last Purchase</span>
                  <SortIcon field="lastPurchase" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-100">
            {sortedCustomers.map((customer) => (
              <tr 
                key={customer.id}
                className="hover:bg-neutral-50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-xs font-medium mr-3">
                      {customer.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-neutral-900">{customer.name}</div>
                      <div className="text-xs text-neutral-500">{customer.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-900">
                  {customer.totalOrders}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-900">
                  ${customer.totalSpent.toLocaleString()}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-500">
                  {new Date(customer.lastPurchase).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}