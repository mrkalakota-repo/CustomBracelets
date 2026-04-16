'use client'

import { useRef, useState } from 'react'
import { useAuth } from '@/context/AuthContext'

interface ImageUploadProps {
  label:    string
  value:    string
  onChange: (url: string) => void
}

export function ImageUpload({ label, value, onChange }: ImageUploadProps) {
  const { session }                   = useAuth()
  const inputRef                      = useRef<HTMLInputElement>(null)
  const [uploading, setUploading]     = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !session) return

    setUploading(true)
    setUploadError(null)

    const body = new FormData()
    body.append('file', file)

    const res = await fetch('/api/admin/upload', {
      method:  'POST',
      headers: { Authorization: `Bearer ${session.access_token}` },
      body,
    })

    setUploading(false)

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setUploadError(data.error ?? 'Upload failed')
      return
    }

    const { url } = await res.json()
    onChange(url)
    // Reset so the same file can be re-selected if needed
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>

      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt="Preview"
          className="w-20 h-20 object-cover rounded-lg mb-2 border border-border"
        />
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="btn-secondary text-sm disabled:opacity-50"
        >
          {uploading ? 'Uploading…' : value ? 'Replace image' : 'Upload image'}
        </button>
        {value && !uploading && (
          <span className="text-xs text-text-mid truncate max-w-[220px]">
            {value.split('/').pop()}
          </span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {uploadError && (
        <p className="text-red-600 text-xs mt-1">{uploadError}</p>
      )}
    </div>
  )
}
