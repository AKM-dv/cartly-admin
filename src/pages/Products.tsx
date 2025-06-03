import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { productsData as initialProductsData } from '../data/mockData';
import { 
  Search, 
  Plus, 
  Filter, 
  ArrowUpDown, 
  Edit, 
  Trash2, 
  ChevronDown,
  ChevronRight,
  Upload,
  Package
} from 'lucide-react';
import AddProductModal from '../components/modals/AddProductModal';
import EditProductModal from '../components/modals/EditProductModal';

// Product Categories
const initialCategories = [
  { value: 'all', label: 'All Categories' },
  { value: 'Bags', label: 'Bags' },
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Footwear', label: 'Footwear' },
  { value: 'Apparel', label: 'Apparel' },
];

// Stock Status
const stockStatus = [
  { value: 'all', label: 'All Stock Status' },
  { value: 'in-stock', label: 'In Stock' },
  { value: 'low-stock', label: 'Low Stock' },
  { value: 'out-of-stock', label: 'Out of Stock' },
];

type SortField = 'price' | 'stock' | null;
type SortOrder = 'asc' | 'desc';

export function Products() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStock, setSelectedStock] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [products, setProducts] = useState(initialProductsData);
  const [categories, setCategories] = useState(initialCategories);
  const [expandedVariants, setExpandedVariants] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Handle adding new category
  const handleAddCategory = (newCategory: { value: string; label: string }) => {
    setCategories(prev => [...prev, newCategory]);
  };

  // Handle editing a product
  const handleEditProduct = (product: any) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  // Handle saving edited product
  const handleSaveEdit = (updatedProduct: any) => {
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
    
    // Update the mock data
    const index = initialProductsData.findIndex(p => p.id === updatedProduct.id);
    if (index !== -1) {
      initialProductsData[index] = updatedProduct;
    }
  };

  // Handle deleting a product
  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      // Update the state
      setProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
      
      // Update the mock data
      const index = initialProductsData.findIndex(p => p.id === productId);
      if (index !== -1) {
        initialProductsData.splice(index, 1);
      }
    }
  };

  // Filter products based on search query and selected filters
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    
    let matchesStock = true;
    if (selectedStock === 'in-stock') {
      matchesStock = product.stock > 50;
    } else if (selectedStock === 'low-stock') {
      matchesStock = product.stock <= 50 && product.stock > 0;
    } else if (selectedStock === 'out-of-stock') {
      matchesStock = product.stock <= 0;
    }
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleAddProduct = (newProduct: any) => {
    // Update the products state
    setProducts(prevProducts => [...prevProducts, newProduct]);
    
    // Update the mock data
    initialProductsData.push(newProduct);
  };

  const toggleVariants = (productId: string) => {
    setExpandedVariants(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // If clicking the same field, toggle order
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // If clicking a new field, set it with ascending order
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!sortField) return 0;

    let aValue = sortField === 'price' 
      ? (a.discountedPrice || a.price)
      : a[sortField];
    let bValue = sortField === 'price'
      ? (b.discountedPrice || b.price)
      : b[sortField];

    if (sortOrder === 'asc') {
      return aValue - bValue;
    } else {
      return bValue - aValue;
    }
  });

  // Get sort icon and style based on current sort state
  const getSortIndicator = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown size={14} className="ml-1 text-gray-400" />;
    }
    return sortOrder === 'asc' 
      ? <ArrowUpDown size={14} className="ml-1 text-[#004cbf]" />
      : <ArrowUpDown size={14} className="ml-1 text-[#004cbf] rotate-180" />;
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <Button 
          variant="primary"
          size="md"
          icon={<Plus size={16} />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add New Product
        </Button>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline"
            size="md"
            icon={<Upload size={16} />}
          >
            Import
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

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddProduct}
        categories={categories.filter(cat => cat.value !== 'all')}
        onAddCategory={handleAddCategory}
      />

      {/* Edit Product Modal */}
      {selectedProduct && (
        <EditProductModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedProduct(null);
          }}
          onSave={handleSaveEdit}
          product={selectedProduct}
          categories={categories.filter(cat => cat.value !== 'all')}
          onAddCategory={handleAddCategory}
        />
      )}

      {/* Filters */}
      <Card>
        <Card.Content className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search size={18} className="text-gray-400" />}
            />
            
            <Select
              options={categories}
              value={selectedCategory}
              onChange={setSelectedCategory}
              label=""
            />
            
            <Select
              options={stockStatus}
              value={selectedStock}
              onChange={setSelectedStock}
              label=""
            />
          </div>
        </Card.Content>
      </Card>

      {/* Products List */}
      <Card>
        <Card.Header>
          <div className="flex justify-between items-center">
            <Card.Title>Product Inventory</Card.Title>
            <span className="text-sm text-gray-500">
              Showing {sortedProducts.length} of {products.length} products
            </span>
          </div>
        </Card.Header>
        <Card.Content className="p-0">
          <Table>
            <Table.Head>
              <Table.Row>
                <Table.Header>
                  <div className="flex items-center">
                    Product
                    <ArrowUpDown size={14} className="ml-1 text-gray-400" />
                  </div>
                </Table.Header>
                <Table.Header>SKU</Table.Header>
                <Table.Header>Category</Table.Header>
                <Table.Header>
                  <button
                    onClick={() => handleSort('price')}
                    className="flex items-center hover:text-[#004cbf] transition-colors"
                  >
                    Price
                    {getSortIndicator('price')}
                  </button>
                </Table.Header>
                <Table.Header>
                  <button
                    onClick={() => handleSort('stock')}
                    className="flex items-center hover:text-[#004cbf] transition-colors"
                  >
                    Stock
                    {getSortIndicator('stock')}
                  </button>
                </Table.Header>
                <Table.Header>Variants</Table.Header>
                <Table.Header className="text-right">Actions</Table.Header>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {sortedProducts.length > 0 ? (
                sortedProducts.map((product) => (
                  <React.Fragment key={product.id}>
                    <Table.Row>
                      <Table.Cell>
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-md object-cover border border-gray-200"
                              src={product.images[0] || 'https://placehold.co/40x40?text=No+Image'}
                              alt={product.name}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate max-w-[200px]">
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </Table.Cell>
                      <Table.Cell className="font-mono text-xs text-gray-500">
                        {product.sku}
                      </Table.Cell>
                      <Table.Cell>
                        <Badge>{product.category}</Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex flex-col">
                          {product.discountedPrice ? (
                            <>
                              <span className="text-sm font-medium text-gray-900">
                                ${product.discountedPrice.toFixed(2)}
                              </span>
                              <span className="text-xs line-through text-gray-500">
                                ${product.price.toFixed(2)}
                              </span>
                              <span className="text-xs text-green-600">
                                {Math.round(((product.price - product.discountedPrice) / product.price) * 100)}% off
                              </span>
                            </>
                          ) : (
                            <span className="text-sm font-medium text-gray-900">
                              ${product.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge
                          variant={product.stock > 100 ? 'success' : product.stock > 20 ? 'warning' : 'error'}
                        >
                          {product.stock === 0 
                            ? 'Out of Stock'
                            : product.stock <= 20
                            ? `Low Stock (${product.stock} left)`
                            : product.stock <= 100
                            ? `Limited (${product.stock} units)`
                            : `In Stock (${product.stock})`}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <button
                          onClick={() => toggleVariants(product.id)}
                          className="flex items-center space-x-2 hover:text-[#004cbf] transition-colors"
                        >
                          {expandedVariants.includes(product.id) ? (
                            <ChevronDown size={16} />
                          ) : (
                            <ChevronRight size={16} />
                          )}
                          <span>{product.variants.length} variants</span>
                        </button>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            icon={<Edit size={14} />}
                            onClick={() => handleEditProduct(product)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            icon={<Trash2 size={14} />}
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </Button>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                    {/* Variants Expansion Panel */}
                    {expandedVariants.includes(product.id) && (
                      <Table.Row>
                        <Table.Cell colSpan={7} className="bg-gray-50">
                          <div className="overflow-hidden">
                            <div className="animate-slideDown">
                              <div className="p-4 space-y-4">
                                <h4 className="font-medium text-sm text-gray-700">
                                  Product Variants ({product.variants.length})
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {product.variants.map((variant) => (
                                    <div
                                      key={variant.id}
                                      className="bg-white p-4 rounded-lg border border-gray-200"
                                    >
                                      <div className="space-y-3">
                                        {/* Attributes */}
                                        <div className="flex flex-wrap gap-2">
                                          {Object.entries(variant.attributes).map(([key, value]) => (
                                            <span 
                                              key={key}
                                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#e6f0ff] text-[#004cbf]"
                                            >
                                              {key}: {value}
                                            </span>
                                          ))}
                                        </div>
                                        
                                        {/* Price and Stock */}
                                        <div className="flex items-center justify-between text-sm">
                                          <div className="font-medium text-gray-900">
                                            ${variant.price.toFixed(2)}
                                          </div>
                                          <div className={`px-2 py-1 rounded-md text-xs font-medium ${
                                            variant.stock > 100 
                                              ? 'bg-green-100 text-green-800'
                                              : variant.stock > 20
                                              ? 'bg-yellow-100 text-yellow-800'
                                              : 'bg-red-100 text-red-800'
                                          }`}>
                                            {variant.stock === 0 
                                              ? 'Out of Stock' 
                                              : variant.stock <= 20
                                              ? `Low Stock (${variant.stock} left)`
                                              : variant.stock <= 100
                                              ? `Limited (${variant.stock} units)`
                                              : `In Stock (${variant.stock})`}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <Table.Row>
                  <Table.Cell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <Package size={32} className="mb-2" />
                      <p className="text-lg font-medium">No products found</p>
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
              Showing {sortedProducts.length} of {products.length} products
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
              <Button variant="outline" size="sm" className="px-3">
                3
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

export default Products;