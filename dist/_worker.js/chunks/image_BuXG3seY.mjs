globalThis.process ??= {}; globalThis.process.env ??= {};
const CLOUDFLARE_ACCOUNT_HASH = "iem94FVEkj3Qjv3DsJXpbQ";
function optimizeUrl(imageId, variant = "public") {
  if (!imageId) {
    console.warn("optimizeUrl: imageId vazio");
    return "";
  }
  if (imageId.startsWith("http://") || imageId.startsWith("https://")) {
    return imageId;
  }
  if (imageId.startsWith("blob:") || imageId.startsWith("data:")) {
    return imageId;
  }
  const url = `https://imagedelivery.net/${CLOUDFLARE_ACCOUNT_HASH}/${imageId}/${variant}`;
  console.log("optimizeUrl:", { imageId, variant, url });
  return url;
}

export { optimizeUrl as o };
