import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react'
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

const ERA_OPTIONS = ['80s', '90s', '2000s']
const PRODUCT_CATEGORIES = [
  'T-Shirts', 'Shirts', 'Hoodies & Sweatshirts', 'Jackets & Coats', 
  'Jeans', 'Pants / Trousers', 'Shorts', 'Activewear', 'Underwear', 'Suits / Formal Wear'
]
const SHOPPING_CATEGORIES = [
  'New Arrivals', 'Best Sellers', 'Trending', 'Sale / Discount', 
  'Summer', 'Winter', 'Limited Edition'
]
const STYLE_OPTIONS = ['Streetwear', 'Formal', 'Casual']

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
      soldOut: false,
      image: '',
      era: '90s',
      archiveType: 'Tops',
      productCategory: 'T-Shirts',
      shoppingCategory: 'New Arrivals',
      style: 'Streetwear',
      dropDate: new Date().toISOString().split('T')[0],
      dropName: 'Archive 001'
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
      setApiError(e?.response?.data?.message || 'Failed to create product.')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <CheckCircle2 className="h-24 w-24 text-accent animate-in fade-in zoom-in duration-500" />
        <h2 className="hero-title text-4xl mt-4">Archive Entry Success</h2>
        <p className="archive-label">Redirecting to archive index…</p>
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
            className="archive-label flex items-center gap-2 hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-3 w-3" /> VOID BACK TO ARCHIVE
          </button>
          <h1 className="hero-title text-5xl md:text-6xl lg:text-7xl">Entry Registry</h1>
          <p className="text-muted-foreground mt-4 uppercase tracking-widest text-sm">
            Cataloging a new artifact into the Deadstock collection.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
        {/* Visual Documentation */}
        <div className="bg-card border border-border p-8">
          <div className="flex flex-col gap-6">
            <div>
              <span className="archive-label block mb-6">Visual Documentation</span>
              <CloudinaryUploader
                value={watch('image')}
                onChange={(url) => setValue('image', url)}
              />
              {errors.image && <p className="text-destructive text-xs mt-2 uppercase tracking-widest">Image is required for archive entry.</p>}
            </div>
            {!watch('image') && (
              <div className="hidden">
                 <input {...register('image', { required: 'Image URL is required' })} />
              </div>
            )}
          </div>
        </div>

        {/* Primary Data */}
        <div className="bg-card border border-border p-8 space-y-12">
          <h2 className="hero-title text-3xl">Registry Metadata</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
            <div className="space-y-2">
              <label className="archive-label">Designation (NAME)</label>
              <input
                {...register('name', { required: 'Name is required' })}
                placeholder="AUTHENTIC UTILITY GARMENT"
                className="input-editorial"
              />
              {errors.name && <p className="text-destructive text-[10px] uppercase tracking-widest">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="archive-label">Financial Valuation (RS.)</label>
              <input
                type="number"
                step="0.01"
                {...register('price', { required: 'Price is required', min: 0 })}
                placeholder="485.00"
                className="input-editorial"
              />
              {errors.price && <p className="text-destructive text-[10px] uppercase tracking-widest">Valid valuation required.</p>}
            </div>

            <div className="space-y-2">
              <label className="archive-label">Men's Product Category</label>
              <select {...register('productCategory', { required: true })} className="input-editorial cursor-pointer">
                {PRODUCT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="archive-label">Shopping Sequence / Category</label>
              <select {...register('shoppingCategory', { required: true })} className="input-editorial cursor-pointer">
                {SHOPPING_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="archive-label">Era Segment</label>
              <select {...register('era', { required: true })} className="input-editorial cursor-pointer">
                {ERA_OPTIONS.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="archive-label">Archive Classification</label>
              <input
                {...register('archiveType', { required: true })}
                placeholder="OUTERWEAR / TOPS"
                className="input-editorial"
              />
            </div>
          </div>
        </div>

        {/* Product Attributes (Filters) */}
        <div className="bg-card border border-border p-8 space-y-12">
          <h2 className="hero-title text-3xl">Artifact Attributes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
            <div className="space-y-2">
              <label className="archive-label">Available Sizes (S, M, L...)</label>
              <input
                {...register('size')}
                placeholder="M, L, XL"
                className="input-editorial"
              />
            </div>
            <div className="space-y-2">
              <label className="archive-label">Color Profile</label>
              <input
                {...register('color')}
                placeholder="NAVY / ASH"
                className="input-editorial"
              />
            </div>
            <div className="space-y-2">
              <label className="archive-label">Brand / Label</label>
              <input
                {...register('brand')}
                placeholder="VINTAGE MILITARY"
                className="input-editorial"
              />
            </div>
            <div className="space-y-2">
              <label className="archive-label">Material Composition</label>
              <input
                {...register('material')}
                placeholder="100% COTTON CANVAS"
                className="input-editorial"
              />
            </div>
            <div className="space-y-2">
              <label className="archive-label">Aesthetic Style</label>
              <select {...register('style')} className="input-editorial cursor-pointer">
                {STYLE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="archive-label">Functional Utility</label>
              <input
                {...register('function', { required: 'Function / Category required' })}
                placeholder="LAYERING / TACTICAL"
                className="input-editorial"
              />
            </div>
            <div className="space-y-2">
              <label className="archive-label">Inventory Quantity</label>
              <input
                type="number"
                {...register('quantity', { required: true, min: 0 })}
                placeholder="1"
                className="input-editorial"
              />
            </div>
          </div>

          <div className="space-y-4 pt-6">
            <label className="archive-label">Artifact Description</label>
            <textarea
              {...register('description', { required: 'Narrative description required' })}
              rows={4}
              placeholder="Vast documentation and details regarding the artifact historical significance..."
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
            <label htmlFor="prod-soldOut" className="archive-label cursor-pointer select-none">
              Mark as Liquidated (Sold Out)
            </label>
          </div>
        </div>

        {/* Temporal Data */}
        <div className="bg-card border border-border p-8 space-y-12">
          <h2 className="hero-title text-3xl">Temporal Context</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-2">
              <label className="archive-label">Archive Release Designation</label>
              <input
                {...register('dropName', { required: true })}
                placeholder="ARCHIVE SEQUENCE 001"
                className="input-editorial"
              />
            </div>
            <div className="space-y-2">
              <label className="archive-label">Registry Date</label>
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
            VOID ENTRY
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="btn-request px-12"
          >
            {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'REGISTER ARTIFACT'}
          </button>
        </div>
      </form>
    </div>
  )
}
