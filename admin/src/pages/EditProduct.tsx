import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { Loader2, ArrowLeft, CheckCircle2, Trash2 } from 'lucide-react'
import { productApi, type CreateProductPayload } from '../lib/api'
import { CloudinaryUploader } from '../components/CloudinaryUploader'

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
  soldOut: boolean
  image: string
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

export function EditProduct() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [pageLoading, setPageLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [apiError, setApiError] = useState('')

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormFields>()

  useEffect(() => {
    if (!id) return
    productApi.getOne(id).then((product) => {
      reset({
        name: product.name,
        price: String(product.price),
        era: product.era,
        archiveType: product.archiveType,
        productCategory: product.productCategory || 'T-Shirts',
        shoppingCategory: product.shoppingCategory || 'New Arrivals',
        size: product.size || '',
        color: product.color || '',
        brand: product.brand || '',
        material: product.material || '',
        style: product.style || 'Streetwear',
        description: product.description,
        function: product.function,
        quantity: String(product.quantity),
        soldOut: product.soldOut,
        image: product.image,
        dropDate: product.dropDate,
        dropName: product.dropName,
      })
      setPageLoading(false)
    }).catch(() => {
      setApiError('Failed to load product details.')
      setPageLoading(false)
    })
  }, [id, reset])

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    if (!id) return
    setSubmitting(true)
    setApiError('')
    try {
      const payload: Partial<CreateProductPayload> = {
        ...data,
        price: parseFloat(data.price) || 0,
        quantity: parseInt(data.quantity, 10) || 0,
      }
      await productApi.update(id, payload)
      setSuccess(true)
      setTimeout(() => navigate('/products'), 1500)
    } catch (e: any) {
      setApiError(e?.response?.data?.message || 'Failed to save changes.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!id || !window.confirm('WARNING: Are you sure you want to delete this product? This cannot be undone.')) return
    try {
      await productApi.delete(id)
      navigate('/products')
    } catch (e) {
      setApiError('Failed to delete product.')
    }
  }

  if (pageLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      <span className="detail-label">Loading Product Details…</span>
    </div>
  )

  if (success) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <CheckCircle2 className="h-24 w-24 text-accent animate-in fade-in zoom-in duration-500" />
      <h2 className="hero-title text-4xl mt-4">Product Updated!</h2>
      <p className="detail-label">Returning to products list…</p>
    </div>
  )

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
          <h1 className="hero-title text-5xl md:text-6xl lg:text-7xl">Edit Item</h1>
          <p className="text-muted-foreground mt-4 uppercase tracking-widest text-sm">
            Update the information for this product.
          </p>
        </div>
        <button
          type="button"
          onClick={handleDelete}
          className="btn-outline border-destructive text-destructive hover:bg-destructive hover:text-white px-8 h-fit self-start md:self-end"
        >
          <Trash2 className="w-4 h-4 mr-2" /> DELETE PRODUCT
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
        {/* Photo Upload */}
        <div className="bg-card border border-border p-8">
          <span className="detail-label block mb-6">Product Image</span>
          <CloudinaryUploader
            value={watch('image')}
            onChange={(url) => setValue('image', url)}
          />
          {errors.image && <p className="text-destructive text-xs mt-2 uppercase tracking-widest">An image is required.</p>}
        </div>

        {/* Product Info */}
        <div className="bg-card border border-border p-8 space-y-12">
          <h2 className="hero-title text-3xl">Basic Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
            <div className="space-y-2">
              <label className="detail-label">Product Name</label>
              <input
                {...register('name', { required: 'Name is required' })}
                placeholder="Product Name"
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
              {errors.price && <p className="text-destructive text-[10px] uppercase tracking-widest">Price is required.</p>}
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
                placeholder="Tops / Bottoms"
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
                placeholder="S, M, L"
                className="input-editorial"
              />
            </div>
            <div className="space-y-2">
              <label className="detail-label">Color</label>
              <input
                {...register('color')}
                placeholder="e.g. Navy / Blue"
                className="input-editorial"
              />
            </div>
            <div className="space-y-2">
              <label className="detail-label">Brand</label>
              <input
                {...register('brand')}
                placeholder="Brand Name"
                className="input-editorial"
              />
            </div>
            <div className="space-y-2">
              <label className="detail-label">Material</label>
              <input
                {...register('material')}
                placeholder="e.g. 100% Cotton"
                className="input-editorial"
              />
            </div>
            <div className="space-y-2">
              <label className="detail-label">Style</label>
              <select {...register('style')} className="input-editorial cursor-pointer">
                {STYLE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="detail-label">Notes / Tags</label>
              <input
                {...register('function', { required: 'Tags are required' })}
                placeholder="e.g. Oversized"
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
              placeholder="Full description of the product..."
              className="input-editorial min-h-[120px] resize-none"
            />
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-border/50">
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

        {/* Drop Details */}
        <div className="bg-card border border-border p-8 space-y-12">
          <h2 className="hero-title text-3xl">Drop Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-2">
              <label className="detail-label">Collection Name</label>
              <input
                {...register('dropName', { required: true })}
                placeholder="Collection Name"
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
            DISCARD CHANGES
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="btn-request px-12"
          >
            {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'SAVE CHANGES'}
          </button>
        </div>
      </form>
    </div>
  )
}
