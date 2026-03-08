import { useState } from 'react'
import { Upload, X, Loader2, GripVertical, ChevronUp, ChevronDown } from 'lucide-react'
import { uploadToCloudinary } from '../lib/api'

interface MultiImageUploaderProps {
  value: string // JSON string of array
  onChange: (value: string) => void
}

export function MultiImageUploader({ value, onChange }: MultiImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const images: string[] = value ? JSON.parse(value) : []

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      const newImages = [...images]
      for (let i = 0; i < files.length; i++) {
        const result = await uploadToCloudinary(files[i])
        newImages.push(result.secure_url)
      }
      onChange(JSON.stringify(newImages))
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Failed to upload one or more images.')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onChange(JSON.stringify(newImages))
  }

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...images]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    
    if (targetIndex < 0 || targetIndex >= images.length) return
    
    const [movedItem] = newImages.splice(index, 1)
    newImages.splice(targetIndex, 0, movedItem)
    onChange(JSON.stringify(newImages))
  }

  const [urlInput, setUrlInput] = useState('')
  const [showUrlInput, setShowUrlInput] = useState(false)

  const addImageUrl = () => {
    if (!urlInput.trim()) return
    const newImages = [...images, urlInput.trim()]
    onChange(JSON.stringify(newImages))
    setUrlInput('')
    setShowUrlInput(false)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((url, index) => (
          <div key={`${url}-${index}`} className="group relative bg-muted border border-border aspect-square overflow-hidden">
            <img src={url} alt="Product" className="w-full h-full object-cover" />
            
            {/* Absolute Overlays */}
            <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => moveImage(index, 'up')}
                disabled={index === 0}
                className="p-1.5 bg-background border border-border hover:bg-muted disabled:opacity-30"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => moveImage(index, 'down')}
                disabled={index === images.length - 1}
                className="p-1.5 bg-background border border-border hover:bg-muted disabled:opacity-30"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="p-1.5 bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Index Badge */}
            <div className="absolute top-2 left-2 bg-background/80 px-2 py-0.5 text-[10px] detail-label">
              {index + 1}
            </div>
          </div>
        ))}
        
        {/* Upload Button */}
        <label className={`
          border-2 border-dashed border-border aspect-square flex flex-col items-center justify-center gap-3 cursor-pointer
          hover:border-accent hover:bg-accent/5 transition-all
          ${uploading ? 'pointer-events-none opacity-50' : ''}
        `}>
          {uploading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin text-accent" />
              <span className="text-[10px] detail-label">Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="w-6 h-6 text-muted-foreground" />
              <span className="text-[10px] detail-label">Add Images</span>
            </>
          )}
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />
        </label>

        {/* URL Input Toggle Button */}
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="border-2 border-dashed border-border aspect-square flex flex-col items-center justify-center gap-3 hover:border-accent hover:bg-accent/5 transition-all"
        >
          <GripVertical className="w-6 h-6 text-muted-foreground rotate-90" />
          <span className="text-[10px] detail-label">Paste URL</span>
        </button>
      </div>

      {showUrlInput && (
        <div className="flex gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Paste direct image URL here..."
            className="input-editorial flex-1 text-xs"
          />
          <button
            type="button"
            onClick={addImageUrl}
            className="btn-request px-6 py-2 text-[10px] uppercase tracking-widest"
          >
            Add Link
          </button>
        </div>
      )}
      
      <p className="text-[10px] text-muted-foreground uppercase tracking-widest leading-relaxed">
        Tip: The first image in the gallery will be used for secondary views. Drag and drop ordering coming soon. 
        Use the arrows to manage the sequence.
      </p>
    </div>
  )
}
