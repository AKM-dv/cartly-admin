import React from 'react';
import { useNavigate } from 'react-router-dom';
import MetricCard from '../components/dashboard/MetricCard';
import ChartContainer from '../components/dashboard/ChartContainer';
import TopCustomersTable from '../components/dashboard/TopCustomersTable';
import ProductsTable from '../components/dashboard/ProductsTable';
import { metricsData, productsData, customersData } from '../data/mockData';
import { Package, ShoppingCart, Users, DollarSign } from 'lucide-react';

const icons = {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
};

export function Dashboard() {
  const navigate = useNavigate();

  const handleCustomerClick = (customerId: string) => {
    navigate(`/customers/${customerId}`);
  };

  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  const metricsWithIcons = metricsData.map(metric => ({
    ...metric,
    // @ts-ignore
    icon: React.createElement(icons[metric.icon], { 
      size: 24,
      className: "text-[#004cbf] group-hover:scale-110 transition-transform" 
    }),
  }));

  return (
    <div className="p-4 lg:p-6 max-w-[2000px] mx-auto">
      <div className="grid gap-6">
        {/* Top Section - Metrics and Chart */}
        <div className="grid grid-cols-12 gap-6">
          {/* Metrics Cards */}
          <div className="col-span-12 xl:col-span-5 grid grid-cols-2 lg:grid-cols-2 gap-4">
            {metricsWithIcons.map((metric, index) => (
              <MetricCard 
                key={index} 
                data={metric}
                onClick={() => {
                  switch (metric.title) {
                    case 'Total Products':
                      navigate('/products');
                      break;
                    case 'Total Orders':
                      navigate('/orders');
                      break;
                    case 'Total Customers':
                      navigate('/customers');
                      break;
                  }
                }}
              />
            ))}
          </div>

          {/* Chart Section */}
          <div className="col-span-12 xl:col-span-7 bg-white rounded-xl border border-[#004cbf]/5 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="p-4 border-b border-[#004cbf]/5">
              <h2 className="text-lg font-semibold text-[#35383f]">Revenue Overview</h2>
            </div>
            <div className="p-4">
              <ChartContainer />
            </div>
          </div>
        </div>

        {/* Bottom Section - Tables */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Customers Table */}
          <div className="bg-white rounded-xl border border-[#004cbf]/5 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="p-4 border-b border-[#004cbf]/5">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-[#35383f]">Top Customers</h2>
                <button 
                  onClick={() => navigate('/customers')}
                  className="text-sm text-[#004cbf] hover:underline"
                >
                  View All
                </button>
              </div>
            </div>
            <div className="p-4">
              <TopCustomersTable onCustomerClick={handleCustomerClick} />
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-xl border border-[#004cbf]/5 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="p-4 border-b border-[#004cbf]/5">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-[#35383f]">Top Products</h2>
                <button 
                  onClick={() => navigate('/products')}
                  className="text-sm text-[#004cbf] hover:underline"
                >
                  View All
                </button>
              </div>
            </div>
            <div className="p-4">
              <ProductsTable 
                products={productsData.slice(0, 5)}
                onProductClick={handleProductClick}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;