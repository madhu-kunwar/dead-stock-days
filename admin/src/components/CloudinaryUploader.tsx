import React, { useState, useRef } from 'react'
import { Upload, X, Loader2, ImageIcon, Sparkles } from 'lucide-react'
import { uploadToCloudinary, getRemoveBgUrl, type CloudinaryUploadResult } from '../lib/api'
import { cn } from '../lib/utils'

interface CloudinaryUploaderProps {
  value?: string
  onChange: (url: string, publicId: string) => void
  label?: string
}

export function CloudinaryUploader({ value, onChange, label = 'Product Image' }: CloudinaryUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string>(value || '')
  const [publicId, setPublicId] = useState<string>('')
  const [removingBg, setRemovingBg] = useState(false)
  const [bgRemovedUrl, setBgRemovedUrl] = useState<string>('')
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file.')
      return
    }
    setError('')
    setUploading(true)
    setBgRemovedUrl('')
    try {
      const result: CloudinaryUploadResult = await uploadToCloudinary(file)
      setPreview(result.secure_url)
      setPublicId(result.public_id)
      onChange(result.secure_url, result.public_id)
    } catch {
      setError('Upload failed. Check your Cloudinary credentials in .env')
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveBg = async () => {
    if (!publicId) return
    setRemovingBg(true)
    setBgRemovedUrl('')
    // Cloudinary background removal is applied via transformation URL
    const url = getRemoveBgUrl(publicId)
    // Pre-load the image to ensure it's processed
    await new Promise<void>((resolve) => {
      const img = new Image()
      img.onload = () => resolve()
      img.onerror = () => resolve()
      img.src = url
    })
    setBgRemovedUrl(url)
    onChange(url, publicId)
    setRemovingBg(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleUpload(file)
  }

  const clearImage = () => {
    setPreview('')
    setPublicId('')
    setBgRemovedUrl('')
    onChange('', '')
  }

  const displayUrl = bgRemovedUrl || preview

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">{label}</label>

      {!displayUrl ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-10 cursor-pointer transition-colors',
            dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/30',
          )}
        >
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          ) : (
            <>
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Drag & drop or <span className="text-primary font-medium">browse</span></p>
              <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP up to 10MB</p>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
          />
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative group rounded-lg overflow-hidden border border-border bg-muted/30">
            <img
              src={displayUrl}
              alt="Product preview"
              className="w-full h-52 object-contain"
            />
            <button
              type="button"
              onClick={clearImage}
              className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
            {bgRemovedUrl && (
              <div className="absolute bottom-2 left-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> BG removed
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium h-9 px-3 border border-input bg-background hover:bg-muted transition-colors"
            >
              <ImageIcon className="h-4 w-4" /> Replace
            </button>
            {publicId && !bgRemovedUrl && (
              <button
                type="button"
                onClick={handleRemoveBg}
                disabled={removingBg}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium h-9 px-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {removingBg ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Remove BG
              </button>
            )}
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
          />
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
