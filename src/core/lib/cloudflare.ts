// src/core/lib/cloudflare.ts
const CLOUDFLARE_ACCOUNT_HASH = 'iem94FVEkj3Qjv3DsJXpbQ'

export async function uploadToCloudflare(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("https://imagens.bjeslee19.workers.dev/", {
    method: "POST",
    body: formData,
  });

  const text = await res.text();
  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  if (!res.ok) {
    console.error("Upload error RAW:", data);
    throw new Error(
      typeof data === "string" ? data : JSON.stringify(data)
    );
  }

  if (!data || !data.imageId) {
    console.error("Upload OK mas sem imageId:", data);
    throw new Error("ID da imagem não retornado pelo servidor");
  }

  return data.imageId as string;
}


export function optimizeUrl(imageId: string, variant: 'public' | 'thumbnail' | 'original' = 'public'): string {
  return `https://imagedelivery.net/${CLOUDFLARE_ACCOUNT_HASH}/${imageId}/${variant}`
}

export async function deleteCloudflareImage(imageId: string): Promise<void> {
  // Implementar se necessário
}