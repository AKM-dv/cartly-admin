import React from 'react';
import { Card } from '../ui/Card';
import { Table } from '../ui/Table';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Product } from '../../types';
import { MoreHorizontal, ExternalLink, Edit } from 'lucide-react';

interface ProductsTableProps {
  products: Product[];
}

export function ProductsTable({ products }: ProductsTableProps) {
  return (
    <Card className="h-full">
      <Card.Header className="flex justify-between items-center">
        <Card.Title>Recent Products</Card.Title>
        <Button variant="link" size="sm">
          View All <ExternalLink className="ml-1" size={14} />
        </Button>
      </Card.Header>
      <Card.Content className="p-0">
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Header>Product</Table.Header>
              <Table.Header>SKU</Table.Header>
              <Table.Header>Category</Table.Header>
              <Table.Header>Price</Table.Header>
              <Table.Header>Stock</Table.Header>
              <Table.Header className="w-12"></Table.Header>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {products.map((product) => (
              <Table.Row key={product.id}>
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
                      <p className="text-xs text-gray-500 truncate">
                        {product.variants.length} {product.variants.length === 1 ? 'variant' : 'variants'}
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
                    variant={product.stock > 50 ? 'success' : product.stock > 10 ? 'warning' : 'error'}
                  >
                    {product.stock} in stock
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" className="p-1 h-auto">
                      <Edit size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-1 h-auto">
                      <MoreHorizontal size={16} />
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Card.Content>
    </Card>
  );
}

export default ProductsTable;