import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { ordersData } from '../data/mockData';
import { format } from 'date-fns';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Eye, 
  FileText,
  MoreHorizontal,
  ShoppingCart
} from 'lucide-react';

// Order Status
const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

// Payment Method
const paymentOptions = [
  { value: 'all', label: 'All Payment Methods' },
  { value: 'Credit Card', label: 'Credit Card' },
  { value: 'PayPal', label: 'PayPal' },
];

// Status Badge Styling
const statusVariant: Record<string, string> = {
  pending: 'warning',
  processing: 'info',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'error',
};

export function Orders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState('all');

  // Filter orders based on search query and selected filters
  const filteredOrders = ordersData.filter((order) => {
    // Search filter
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    
    // Payment filter
    const matchesPayment = selectedPayment === 'all' || order.paymentMethod === selectedPayment;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <Card.Content className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search size={18} className="text-gray-400" />}
            />
            
            <Select
              options={statusOptions}
              value={selectedStatus}
              onChange={setSelectedStatus}
              label=""
            />
            
            <Select
              options={paymentOptions}
              value={selectedPayment}
              onChange={setSelectedPayment}
              label=""
            />
          </div>
        </Card.Content>
      </Card>

      {/* Orders List */}
      <Card>
        <Card.Header>
          <div className="flex justify-between items-center">
            <Card.Title>Order Management</Card.Title>
            <Button 
              variant="outline"
              size="sm"
              icon={<Filter size={14} />}
            >
              More Filters
            </Button>
          </div>
        </Card.Header>
        <Card.Content className="p-0">
          <Table>
            <Table.Head>
              <Table.Row>
                <Table.Header>
                  <div className="flex items-center">
                    Order ID
                    <ArrowUpDown size={14} className="ml-1" />
                  </div>
                </Table.Header>
                <Table.Header>Customer</Table.Header>
                <Table.Header>
                  <div className="flex items-center">
                    Date
                    <ArrowUpDown size={14} className="ml-1" />
                  </div>
                </Table.Header>
                <Table.Header>Status</Table.Header>
                <Table.Header>
                  <div className="flex items-center">
                    Total
                    <ArrowUpDown size={14} className="ml-1" />
                  </div>
                </Table.Header>
                <Table.Header>Payment</Table.Header>
                <Table.Header className="text-right">Actions</Table.Header>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <Table.Row key={order.id}>
                    <Table.Cell>
                      <span className="font-medium text-[#004CBF]">#{order.id}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">{order.customerName}</p>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="text-sm text-gray-500">
                        {format(new Date(order.date), 'MMM d, yyyy')}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge
                        variant={statusVariant[order.status] || 'default'}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="font-medium text-gray-900">
                        ${order.total.toFixed(2)}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="text-sm">{order.paymentMethod}</span>
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
                  <Table.Cell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <ShoppingCart size={32} className="mb-2" />
                      <p className="text-lg font-medium">No orders found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
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
              Showing {filteredOrders.length} of {ordersData.length} orders
            </div>
            <div className="flex space-x-1">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" className="px-3 bg-[#004CBF] text-white border-[#004CBF] hover:bg-[#003a9f] hover:border-[#003a9f]">
                1
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

export default Orders;