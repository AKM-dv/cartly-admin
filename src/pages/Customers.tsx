import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { customersData } from '../data/mockData';
import { format } from 'date-fns';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Eye, 
  Mail,
  MoreHorizontal,
  UserX,
  Plus
} from 'lucide-react';

// Sort options
const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'spending-high', label: 'Highest Spending' },
  { value: 'spending-low', label: 'Lowest Spending' },
  { value: 'orders-high', label: 'Most Orders' },
  { value: 'orders-low', label: 'Least Orders' },
];

export function Customers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Filter and sort customers
  const filteredCustomers = customersData
    .filter((customer) => {
      return customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
             customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'newest':
          return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
        case 'oldest':
          return new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime();
        case 'spending-high':
          return b.totalSpent - a.totalSpent;
        case 'spending-low':
          return a.totalSpent - b.totalSpent;
        case 'orders-high':
          return b.totalOrders - a.totalOrders;
        case 'orders-low':
          return a.totalOrders - b.totalOrders;
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <Button 
          variant="primary"
          size="md"
          icon={<Plus size={16} />}
        >
          Add Customer
        </Button>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline"
            size="md"
            icon={<Mail size={16} />}
          >
            Email Selected
          </Button>
          <Button 
            variant="outline"
            size="md"
            icon={<Filter size={16} />}
          >
            Advanced Filters
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <Card.Content className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search size={18} className="text-gray-400" />}
            />
            
            <Select
              options={sortOptions}
              value={sortBy}
              onChange={setSortBy}
              label=""
            />
          </div>
        </Card.Content>
      </Card>

      {/* Customers List */}
      <Card>
        <Card.Header>
          <div className="flex justify-between items-center">
            <Card.Title>Customer Database</Card.Title>
            <span className="text-sm text-gray-500">
              Showing {filteredCustomers.length} of {customersData.length} customers
            </span>
          </div>
        </Card.Header>
        <Card.Content className="p-0">
          <Table>
            <Table.Head>
              <Table.Row>
                <Table.Header>
                  <div className="flex items-center">
                    Customer
                    <ArrowUpDown size={14} className="ml-1" />
                  </div>
                </Table.Header>
                <Table.Header>
                  <div className="flex items-center">
                    Join Date
                    <ArrowUpDown size={14} className="ml-1" />
                  </div>
                </Table.Header>
                <Table.Header>
                  <div className="flex items-center">
                    Orders
                    <ArrowUpDown size={14} className="ml-1" />
                  </div>
                </Table.Header>
                <Table.Header>
                  <div className="flex items-center">
                    Total Spent
                    <ArrowUpDown size={14} className="ml-1" />
                  </div>
                </Table.Header>
                <Table.Header>Last Active</Table.Header>
                <Table.Header className="text-right">Actions</Table.Header>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <Table.Row key={customer.id}>
                    <Table.Cell>
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={customer.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.name)}&background=random`}
                            alt={customer.name}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {customer.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {customer.email}
                          </p>
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="text-sm text-gray-500">
                        {format(new Date(customer.joinDate), 'MMM d, yyyy')}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="font-medium text-gray-900">
                        {customer.totalOrders}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="font-medium text-gray-900">
                        ${customer.totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="text-sm text-gray-500">
                        {format(new Date(customer.lastActive), 'MMM d, yyyy')}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" icon={<Eye size={14} />}>
                          View
                        </Button>
                        <Button variant="ghost" size="sm" icon={<MoreHorizontal size={14} />} />
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <Table.Row>
                  <Table.Cell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <UserX size={32} className="mb-2" />
                      <p className="text-lg font-medium">No customers found</p>
                      <p className="text-sm">Try adjusting your search filters</p>
                    </div>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </Card.Content>
        <Card.Footer>
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Showing {filteredCustomers.length} of {customersData.length} customers
            </div>
            <div className="flex space-x-1">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" className="px-3 bg-[#004CBF] text-white border-[#004CBF] hover:bg-[#003a9f] hover:border-[#003a9f]">
                1
              </Button>
              <Button variant="outline" size="sm" className="px-3">
                2
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </Card.Footer>
      </Card>
    </div>
  );
}

export default Customers;