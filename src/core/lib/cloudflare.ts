// src/core/lib/cloudflare.ts
const CLOUDFLARE_ACCOUNT_ID = 'f19932f2396bfc72bd1f3d6be3c68c9f'
const CLOUDFLARE_ACCOUNT_HASH = 'iem94FVEkj3Qjv3DsJXpbQ'
const CLOUDFLARE_API_TOKEN = import.meta.env.CLOUDFLARE_IMAGES_TOKEN

export async function uploadToCloudflare(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
      },
      body: formData,
    }
  )

  if (!response.ok) {
    throw new Error('Erro ao fazer upload para Cloudflare')
  }

  const data = await response.json()
  return data.result.id
}

export function getCloudflareImageUrl(imageId: string, variant: 'public' | 'thumbnail' | 'original' = 'public'): string {
  return `https://imagedelivery.net/${CLOUDFLARE_ACCOUNT_HASH}/${imageId}/${variant}`
}

export async function deleteCloudflareImage(imageId: string): Promise<void> {
  await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1/${imageId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
      },
    }
  )
}