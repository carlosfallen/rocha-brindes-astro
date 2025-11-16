// src/core/lib/cloudflare.ts
const CLOUDFLARE_ACCOUNT_HASH = 'iem94FVEkj3Qjv3DsJXpbQ'

interface UploadMetadata {
  folder: string
  productId?: string
  variation?: string
  type?: 'main' | 'variation' | 'logo' | 'banner' | 'category' | 'promotion' | 'popup'
}

export async function uploadToCloudflare(
  file: File, 
  metadata: UploadMetadata
): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  
  let customFilename = ''
  if (metadata.type === 'main' && metadata.productId) {
    customFilename = `${metadata.productId}.${ext}`
  } else if (metadata.type === 'variation' && metadata.productId && metadata.variation) {
    const colorSlug = metadata.variation.toLowerCase().replace(/\s+/g, '-')
    customFilename = `${metadata.productId}-${colorSlug}.${ext}`
  } else {
    customFilename = file.name
  }

  const renamedFile = new File([file], customFilename, { type: file.type })
  
  const formData = new FormData()
  formData.append("file", renamedFile)
  
  formData.append("metadata", JSON.stringify({
    folder: metadata.folder,
    productId: metadata.productId,
    variation: metadata.variation,
    type: metadata.type,
    filename: customFilename,
    uploadDate: new Date().toISOString()
  }))

  const res = await fetch("https://imagens.bjeslee19.workers.dev/", {
    method: "POST",
    body: formData,
  })

  const text = await res.text()
  let data: any
  try {
    data = JSON.parse(text)
  } catch {
    data = text
  }

  if (!res.ok) {
    console.error("Upload error RAW:", data)
    throw new Error(typeof data === "string" ? data : JSON.stringify(data))
  }

  if (!data || !data.imageId) {
    console.error("Upload OK mas sem imageId:", data)
    throw new Error("ID da imagem não retornado pelo servidor")
  }

  return data.imageId as string
}

export function optimizeUrl(imageId: string, variant: 'public' | 'thumbnail' | 'original' = 'public'): string {
  if (!imageId) return ''
  if (imageId.startsWith('http://') || imageId.startsWith('https://')) return imageId
  if (imageId.startsWith('blob:') || imageId.startsWith('data:')) return imageId
  
  return `https://imagedelivery.net/${CLOUDFLARE_ACCOUNT_HASH}/${imageId}/${variant}`
}

export async function deleteCloudflareImage(imageId: string): Promise<void> {
  if (!imageId) return
  if (imageId.startsWith('http://') || imageId.startsWith('https://')) return
  if (imageId.startsWith('blob:') || imageId.startsWith('data:')) return

  try {
    const res = await fetch('https://imagens.bjeslee19.workers.dev/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageId }),
    })

    if (!res.ok) {
      const error = await res.text()
      console.error(`Erro ao deletar imagem ${imageId}:`, error)
    }
  } catch (error) {
    console.error(`Erro ao deletar imagem ${imageId}:`, error)
  }
}

export async function deleteMultipleImages(imageIds: string[]): Promise<void> {
  const validIds = imageIds.filter(
    id => id && !id.startsWith('http') && !id.startsWith('blob:') && !id.startsWith('data:')
  )
  
  if (validIds.length === 0) return

  try {
    const res = await fetch('https://imagens.bjeslee19.workers.dev/delete-multiple', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageIds: validIds }),
    })

    if (!res.ok) {
      const error = await res.text()
      console.error('Erro ao deletar múltiplas imagens:', error)
    }
  } catch (error) {
    console.error('Erro ao deletar múltiplas imagens:', error)
  }
}