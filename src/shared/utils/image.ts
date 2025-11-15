// src/shared/utils/image.ts
export function optimizeUrl(imageId: string, variant: 'public' | 'thumbnail' | 'original' = 'public'): string {
  if (!imageId) return ''
  
  // Se já for uma URL completa (http/https), retorna como está
  if (imageId.startsWith('http://') || imageId.startsWith('https://')) {
    return imageId
  }
  
  // Se for blob ou data URL, retorna como está
  if (imageId.startsWith('blob:') || imageId.startsWith('data:')) {
    return imageId
  }
  
  // Cloudflare Images URL
  return `https://imagedelivery.net/iem94FVEkj3Qjv3DsJXpbQ/${imageId}/${variant}`
}

export function preloadImage(imageId: string, priority: 'high' | 'low' = 'high') {
  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'image'
  link.href = optimizeUrl(imageId, 'public')
  link.fetchPriority = priority
  document.head.appendChild(link)
}

export function preloadCriticalImages(imageIds: string[]) {
  imageIds.slice(0, 3).forEach((id, i) => {
    if (id) preloadImage(id, i === 0 ? 'high' : 'low')
  })
}

export function getImageDimensions(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })
    img.onerror = reject
    img.src = url
  })
}