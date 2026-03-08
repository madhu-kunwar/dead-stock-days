import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

export interface Product {
  id: string
  name: string
  price: number
  era?: string
  archiveType: string
  productCategory?: string
  shoppingCategory?: string
  size?: string
  color?: string
  brand?: string
  material?: string
  style?: string
  description: string
  function: string
  quantity: number
  featured?: boolean
  soldOut: boolean
  image: string
  dropDate: string
  dropName: string
  createdAt: string
  updatedAt: string
}

export type CreateProductPayload = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>

export const productApi = {
  getAll: () => api.get<Product[]>('/products').then(r => r.data),
  getOne: (id: string) => api.get<Product>(`/products/${id}`).then(r => r.data),
  create: (data: CreateProductPayload) => api.post<Product>('/products', data).then(r => r.data),
  update: (id: string, data: Partial<CreateProductPayload>) =>
    api.patch<Product>(`/products/${id}`, data).then(r => r.data),
  delete: (id: string) => api.delete(`/products/${id}`).then(r => r.data),
}

// ─── Cloudinary ─────────────────────────────────────────────────────────────

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || ''
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || ''

export interface CloudinaryUploadResult {
  secure_url: string
  public_id: string
  asset_id: string
}

/**
 * Upload a raw file to Cloudinary unsigned upload preset.
 * Returns the secure_url and public_id.
 */
export async function uploadToCloudinary(file: File): Promise<CloudinaryUploadResult> {
  const form = new FormData()
  form.append('file', file)
  form.append('upload_preset', UPLOAD_PRESET)
  form.append('folder', 'deadstock/products')

  const res = await axios.post<CloudinaryUploadResult>(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    form,
  )
  return res.data
}

/**
 * Remove background using Cloudinary AI transformation URL.
 * Applies e_background_removal transformation on the fly.
 */
export function getRemoveBgUrl(publicId: string): string {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/e_background_removal/${publicId}`
}
