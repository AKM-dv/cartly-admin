import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Trash2, AlertCircle, Plus } from 'lucide-react';

interface Category {
  value: string;
  label: string;
}

interface Variant {
  id: string;
  attributes: {
    [key: string]: string;
  };
  price: number;
  stock: number;
}

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (product: any) => void;
  categories: Category[];
  onAddCategory: (category: Category) => void;
}

const MAX_IMAGES = 6;
const MAX_FILE_SIZE = 400 * 1024; // 400KB in bytes

export function AddProductModal({ isOpen, onClose, onAdd, categories, onAddCategory }: AddProductModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sku: '',
    category: categories[0]?.value || '',
    price: '',
    discountedPrice: '',
    stock: '',
    images: [] as string[],
  });
  const [error, setError] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [variantAttributes] = useState<string[]>(['color', 'size']);

  // Handle modal visibility
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    const newCategory = {
      value: newCategoryName.trim(),
      label: newCategoryName.trim()
    };

    onAddCategory(newCategory);
    setFormData(prev => ({ ...prev, category: newCategory.value }));
    setNewCategoryName('');
    setIsAddingCategory(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setError('');

    // Check if adding new files would exceed the limit
    if (formData.images.length + files.length > MAX_IMAGES) {
      setError(`You can only upload up to ${MAX_IMAGES} images`);
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        setError(`File ${file.name} is too large. Maximum size is 400KB`);
        continue;
      }

      try {
        // Convert to base64 for preview
        const base64 = await convertFileToBase64(file);
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, base64]
        }));
      } catch (err) {
        setError('Error processing image');
      }
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addVariant = () => {
    const newVariant: Variant = {
      id: String(Date.now()),
      attributes: variantAttributes.reduce((acc, attr) => ({
        ...acc,
        [attr]: ''
      }), {}),
      price: Number(formData.price) || 0,
      stock: 0
    };
    setVariants(prev => [...prev, newVariant]);
  };

  const removeVariant = (variantId: string) => {
    setVariants(prev => prev.filter(v => v.id !== variantId));
  };

  const updateVariant = (variantId: string, field: string, value: string | number) => {
    setVariants(prev => prev.map(variant => {
      if (variant.id === variantId) {
        if (field.startsWith('attr_')) {
          const attrName = field.replace('attr_', '');
          return {
            ...variant,
            attributes: {
              ...variant.attributes,
              [attrName]: value as string
            }
          };
        }
        return {
          ...variant,
          [field]: field === 'price' || field === 'stock' ? Number(value) : value
        };
      }
      return variant;
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.images.length === 0) {
      setError('Please add at least one image');
      return;
    }

    const newProduct = {
      id: String(Date.now()),
      ...formData,
      price: Number(formData.price),
      discountedPrice: formData.discountedPrice ? Number(formData.discountedPrice) : null,
      stock: Number(formData.stock),
      variants,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onAdd(newProduct);
    onClose();
  };

  if (!isVisible && !isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className={`bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-auto transition-all duration-300 ${
          isOpen 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="p-6 border-b border-[#004cbf]/10">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-[#35383f]">Add New Product</h2>
            <button 
              onClick={onClose}
              className="text-[#35383f]/70 hover:text-[#35383f] transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Images Upload Section */}
            <div className="col-span-2 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#35383f] mb-2">
                  Product Images
                </label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-lg border border-[#004cbf]/10 hover:border-[#004cbf]/30 text-[#35383f] transition-colors flex items-center gap-2"
                    disabled={formData.images.length >= MAX_IMAGES}
                  >
                    <Upload size={16} />
                    Upload Images
                  </button>
                  <span className="text-sm text-[#35383f]/70">
                    {formData.images.length}/{MAX_IMAGES} images uploaded (max 400KB each)
                  </span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              {/* Image Previews */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="w-full aspect-square object-cover rounded-lg border border-[#004cbf]/10"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-white/90 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Name */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-[#35383f] mb-2">
                Product Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-[#004cbf]/10 focus:border-[#004cbf]/30 focus:outline-none"
                placeholder="Enter product name"
              />
            </div>

            {/* SKU */}
            <div>
              <label className="block text-sm font-medium text-[#35383f] mb-2">
                SKU
              </label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-[#004cbf]/10 focus:border-[#004cbf]/30 focus:outline-none"
                placeholder="Enter SKU"
              />
            </div>

            {/* Category with Add New Option */}
            <div>
              <label className="block text-sm font-medium text-[#35383f] mb-2">
                Category
              </label>
              <div className="relative">
                {!isAddingCategory ? (
                  <>
                    <select
                      value={formData.category}
                      onChange={(e) => {
                        if (e.target.value === 'add_new') {
                          setIsAddingCategory(true);
                        } else {
                          setFormData({ ...formData, category: e.target.value });
                        }
                      }}
                      className="w-full px-4 py-2 rounded-lg border border-[#004cbf]/10 focus:border-[#004cbf]/30 focus:outline-none appearance-none"
                    >
                      {categories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                      <option value="add_new">+ Add New Category</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-[#35383f]/70">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Enter category name"
                      className="flex-1 px-4 py-2 rounded-lg border border-[#004cbf]/10 focus:border-[#004cbf]/30 focus:outline-none"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleAddCategory}
                      className="px-3 py-2 bg-[#004cbf] text-white rounded-lg hover:bg-[#004cbf]/90 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingCategory(false);
                        setNewCategoryName('');
                      }}
                      className="px-3 py-2 border border-[#004cbf]/10 hover:border-[#004cbf]/30 rounded-lg transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Price Fields */}
            <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Original Price */}
              <div>
                <label className="block text-sm font-medium text-[#35383f] mb-2">
                  Original Price
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-[#004cbf]/10 focus:border-[#004cbf]/30 focus:outline-none"
                  placeholder="Enter original price"
                />
              </div>

              {/* Discounted Price */}
              <div>
                <label className="block text-sm font-medium text-[#35383f] mb-2">
                  Discounted Price (Optional)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.discountedPrice || ''}
                  onChange={(e) => {
                    const newDiscountedPrice = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      discountedPrice: newDiscountedPrice
                    }));
                  }}
                  className="w-full px-4 py-2 rounded-lg border border-[#004cbf]/10 focus:border-[#004cbf]/30 focus:outline-none"
                  placeholder="Enter discounted price"
                />
                {formData.discountedPrice && Number(formData.discountedPrice) >= Number(formData.price) && (
                  <p className="text-red-500 text-xs mt-1">
                    Discounted price must be less than original price
                  </p>
                )}
              </div>
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-[#35383f] mb-2">
                Stock
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-[#004cbf]/10 focus:border-[#004cbf]/30 focus:outline-none"
                placeholder="Enter stock quantity"
              />
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-[#35383f] mb-2">
                Description
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-[#004cbf]/10 focus:border-[#004cbf]/30 focus:outline-none"
                placeholder="Enter product description"
                rows={3}
              />
            </div>
          </div>

          {/* Variants Section */}
          <div className="space-y-4 border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-[#35383f]">Product Variants</h3>
              <button
                type="button"
                onClick={addVariant}
                className="px-3 py-1.5 rounded-lg bg-[#004cbf] text-white text-sm hover:bg-[#003a9f] transition-colors flex items-center gap-2"
              >
                <Plus size={14} />
                Add Variant
              </button>
            </div>

            {/* Variants List */}
            <div className="space-y-4">
              {variants.map((variant, index) => (
                <div 
                  key={variant.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <h4 className="font-medium">Variant {index + 1}</h4>
                      <div className="flex gap-2 text-sm text-gray-500">
                        <span>Price: ${variant.price}</span>
                        <span>•</span>
                        <span>Stock: {variant.stock}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeVariant(variant.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Attributes */}
                    {variantAttributes.map(attr => (
                      <div key={attr}>
                        <label className="block text-sm font-medium text-[#35383f] mb-2">
                          {attr.charAt(0).toUpperCase() + attr.slice(1)}
                        </label>
                        <input
                          type="text"
                          value={variant.attributes[attr] || ''}
                          onChange={(e) => updateVariant(variant.id, `attr_${attr}`, e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-[#004cbf]/10 focus:border-[#004cbf]/30 focus:outline-none"
                          placeholder={`Enter ${attr}`}
                        />
                      </div>
                    ))}

                    {/* Price */}
                    <div>
                      <label className="block text-sm font-medium text-[#35383f] mb-2">
                        Price
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={variant.price}
                        onChange={(e) => updateVariant(variant.id, 'price', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-[#004cbf]/10 focus:border-[#004cbf]/30 focus:outline-none"
                        placeholder="Enter price"
                      />
                    </div>

                    {/* Stock */}
                    <div>
                      <label className="block text-sm font-medium text-[#35383f] mb-2">
                        Stock
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={variant.stock}
                        onChange={(e) => updateVariant(variant.id, 'stock', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-[#004cbf]/10 focus:border-[#004cbf]/30 focus:outline-none"
                        placeholder="Enter stock"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#004cbf]/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[#004cbf]/10 hover:border-[#004cbf]/30 text-[#35383f] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#004cbf] text-white hover:bg-[#004cbf]/90 transition-colors"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProductModal; 