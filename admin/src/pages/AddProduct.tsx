import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { productApi, type CreateProductPayload } from '../lib/api'
import { CloudinaryUploader } from '../components/CloudinaryUploader'
import { MultiImageUploader } from '../components/MultiImageUploader'

interface FormFields {
  name: string
  price: string
  era: string
  archiveType: string
  productCategory: string
  shoppingCategory: string
  size: string
  color: string
  brand: string
  material: string
  style: string
  description: string
  function: string
  quantity: string
  featured: boolean
  soldOut: boolean
  image: string
  images: string
  dropDate: string
  dropName: string
}

const ERA_OPTIONS = ['None', '80s', '90s', '2000s']
const PRODUCT_CATEGORIES = [
  'T-Shirts', 'Shirts', 'Hoodies & Sweatshirts', 'Jackets & Coats', 
  'Jeans', 'Pants / Trousers', 'Shorts', 'Activewear', 'Tank tops', 'Crop tops', 'Cardigan', 'Formal Wear', 'Accessories'
]
const SHOPPING_CATEGORIES = [
  'New Arrivals', 'Best Sellers', 'Trending', 'Sale / Discount', 
  'Summer', 'Winter', 'Limited Edition'
]
const STYLE_OPTIONS = ['Streetwear', 'Formal', 'Casual', 'Outerwear', 'Sporty', 'Baggy']

export function AddProduct() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [apiError, setApiError] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormFields>({
    defaultValues: {
      featured: false,
      soldOut: false,
      image: '',
      era: 'None',
      archiveType: 'Tops',
      productCategory: 'T-Shirts',
      shoppingCategory: 'New Arrivals',
      style: 'Streetwear',
      images: '[]',
      dropDate: new Date().toISOString().split('T')[0],
      dropName: 'Drop 001'
    },
  })

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    setSubmitting(true)
    setApiError('')
    try {
      const payload: CreateProductPayload = {
        ...data,
        price: parseFloat(data.price) || 0,
        quantity: parseInt(data.quantity, 10) || 0,
      }
      await productApi.create(payload)
      setSuccess(true)
      setTimeout(() => navigate('/products'), 1500)
    } catch (e: any) {
      setApiError(e?.response?.data?.message || 'Failed to add product.')
    } finally {
      setSubmitting(false)
    }
  }


  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <CheckCircle2 className="h-24 w-24 text-accent animate-in fade-in zoom-in duration-500" />
        <h2 className="hero-title text-4xl mt-4">Product Added!</h2>
        <p className="detail-label">Taking you back to the list…</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-border gap-6">
        <div>
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="detail-label flex items-center gap-2 hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-3 w-3" /> BACK TO PRODUCTS
          </button>
          <h1 className="hero-title text-5xl md:text-6xl lg:text-7xl">Add Product</h1>
          <p className="text-muted-foreground mt-4 uppercase tracking-widest text-sm">
            Create a new item in your collection.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
        <div className="bg-card border border-border p-8 space-y-12">
          <div className="flex flex-col gap-6">
            <div>
              <span className="detail-label block mb-6">Main Display Image</span>
              <CloudinaryUploader
                value={watch('image')}
                onChange={(url) => setValue('image', url)}
              />
              {errors.image && <p className="text-destructive text-xs mt-2 uppercase tracking-widest">Please upload a main image.</p>}
            </div>
          </div>

          <div className="space-y-6 pt-12 border-t border-border/50">
            <h2 className="hero-title text-3xl">Gallery Images</h2>
            <p className="text-sm text-muted-foreground uppercase tracking-widest">Add more shots of the piece for the detail page.</p>
            <MultiImageUploader
              value={watch('images')}
              onChange={(json) => setValue('images', json)}
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="bg-card border border-border p-8 space-y-12">
          <h2 className="hero-title text-3xl">Basic Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
            <div className="space-y-2">
              <label className="detail-label">Product Name</label>
              <input
                {...register('name', { required: 'Name is required' })}
                placeholder="e.g. Vintage T-Shirt"
                className="input-editorial"
              />
              {errors.name && <p className="text-destructive text-[10px] uppercase tracking-widest">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="detail-label">Price (Rs.)</label>
              <input
                type="number"
                step="0.01"
                {...register('price', { required: 'Price is required', min: 0 })}
                placeholder="0.00"
                className="input-editorial"
              />
              {errors.price && <p className="text-destructive text-[10px] uppercase tracking-widest">Please enter a valid price.</p>}
            </div>

            <div className="space-y-2">
              <label className="detail-label">Category</label>
              <select {...register('productCategory', { required: true })} className="input-editorial cursor-pointer">
                {PRODUCT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="detail-label">Shop Section</label>
              <select {...register('shoppingCategory', { required: true })} className="input-editorial cursor-pointer">
                {SHOPPING_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="detail-label">Era (Vintage)</label>
              <select {...register('era', { required: true })} className="input-editorial cursor-pointer">
                {ERA_OPTIONS.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="detail-label">Clothing Type</label>
              <input
                {...register('archiveType', { required: true })}
                placeholder="e.g. Tops / Bottoms"
                className="input-editorial"
              />
            </div>
          </div>
        </div>

        {/* Extra Specs */}
        <div className="bg-card border border-border p-8 space-y-12">
          <h2 className="hero-title text-3xl">Product Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
            <div className="space-y-2">
              <label className="detail-label">Sizes Available</label>
              <input
                {...register('size')}
                placeholder="e.g. S, M, L"
                className="input-editorial"
              />
            </div>
            <div className="space-y-2">
              <label className="detail-label mb-2 block">Color</label>
              <input
                {...register('color')}
                placeholder="e.g. Black, White"
                className="input-editorial"
              />
            </div>
            <div className="space-y-2">
              <label className="detail-label mb-2 block">Brand</label>
              <input
                {...register('brand')}
                placeholder="e.g. Levi's"
                className="input-editorial"
              />
            </div>
            <span className="detail-label">Store Management</span>
            <div className="space-y-2">
              <label className="detail-label mb-2 block">Material</label>
              <input
                {...register('material')}
                placeholder="e.g. 100% Cotton"
                className="input-editorial"
              />
            </div>
            <div className="space-y-2">
              <label className="detail-label mb-2 block">Style</label>
              <select {...register('style')} className="input-editorial cursor-pointer">
                {STYLE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="detail-label mb-2 block">Notes / Tags</label>
              <input
                {...register('function', { required: 'Tags are required' })}
                placeholder="e.g. Oversized, Comfort"
                className="input-editorial"
              />
            </div>
            <div className="space-y-2">
              <label className="detail-label">Quantity in Stock</label>
              <input
                type="number"
                {...register('quantity', { required: true, min: 0 })}
                placeholder="1"
                className="input-editorial"
              />
            </div>
          </div>

          <div className="space-y-4 pt-6">
            <label className="detail-label">Full Description</label>
            <textarea
              {...register('description', { required: 'Description is required' })}
              rows={4}
              placeholder="Tell people more about this product..."
              className="input-editorial min-h-[120px] resize-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-12 pt-4 border-t border-border/50">
            <div className="flex items-center gap-4">
              <input
                id="prod-featured"
                type="checkbox"
                {...register('featured')}
                className="h-4 w-4 bg-transparent border-border accent-accent"
              />
              <label htmlFor="prod-featured" className="detail-label cursor-pointer select-none">
                Featured Product
              </label>
            </div>

            <div className="flex items-center gap-4">
              <input
                id="prod-soldOut"
                type="checkbox"
                {...register('soldOut')}
                className="h-4 w-4 bg-transparent border-border accent-accent"
              />
              <label htmlFor="prod-soldOut" className="detail-label cursor-pointer select-none">
                Mark as Sold Out
              </label>
            </div>
          </div>
        </div>

        {/* Drop Details */}
        <div className="bg-card border border-border p-8 space-y-12">
          <h2 className="hero-title text-3xl">Drop Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-2">
              <label className="detail-label">Collection Name</label>
              <input
                {...register('dropName', { required: true })}
                placeholder="e.g. Winter Drop 2024"
                className="input-editorial"
              />
            </div>
            <div className="space-y-2">
              <label className="detail-label">Drop Date</label>
              <input
                type="date"
                {...register('dropDate', { required: true })}
                className="input-editorial"
              />
            </div>
          </div>
        </div>

        {apiError && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive p-8 text-center uppercase tracking-widest text-sm animate-in shake duration-500">
            {apiError}
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-end gap-6 pb-24 border-t border-border pt-12">
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="btn-outline px-12"
          >
            CANCEL
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="btn-request px-12"
          >
            {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'SAVE PRODUCT'}
          </button>
        </div>
      </form>
    </div>
  )
}
