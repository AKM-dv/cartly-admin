// Product Types
export interface ProductVariant {
  id: string;
  attributes: {
    [key: string]: string;
  };
  price: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  category: string;
  price: number;
  discountedPrice?: number;
  stock: number;
  images: string[];
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

// Customer Types
export interface Customer {
  id: string;
  name: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  lastActive: string;
  joinDate: string;
  avatar?: string;
}

// Order Types
export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  date: string;
  paymentMethod: string;
  shippingAddress: string;
}

// Analytics Types
export interface MetricData {
  title: string;
  value: number | string;
  change: number;
  icon: string;
}

export interface ChartData {
  name: string;
  value: number;
  previous?: number;
}