import { ProductImages, ProductMedia } from '../types/product';

type AssetKey = 'front' | 'back' | 'side' | 'top' | 'assemblyVideo' | 'model3d';
type PublishedAssets = Partial<Record<AssetKey, true>>;

/**
 * This is the canonical client-side source of product media URLs. A URL is emitted
 * only when its asset has been verified as authentic and unique for this exact product.
 * Unreleased or duplicate slots remain null, cleanly rendering "Coming soon" on the UI.
 */
const PUBLISHED_PRODUCT_MEDIA: Record<string, PublishedAssets> = {
  p001: { front: true, back: true, side: true, top: true, assemblyVideo: true },
  p002: { front: true, back: true, side: true, top: true, assemblyVideo: true },
  p003: { front: true, back: true, side: true, top: true, assemblyVideo: true },
  p004: { front: true, back: true, side: true, top: true, assemblyVideo: true },
  p005: { front: true, back: true, side: true, top: true, assemblyVideo: true },
  p006: { front: true, back: true, side: true, top: true, model3d: true },
  p007: { front: true, back: true, side: true, top: true, assemblyVideo: true },
  p008: { front: true, back: true, side: true, top: true, assemblyVideo: true },
  p009: { front: true, back: true, side: true, top: true, assemblyVideo: true },
  p010: { front: true, back: true, top: true, assemblyVideo: true },
  p011: { front: true, back: true, top: true, assemblyVideo: true },
  p012: { front: true, back: true, top: true, assemblyVideo: true },
  p013: { back: true, top: true, assemblyVideo: true },
  p014: { back: true, top: true, assemblyVideo: true },
  p015: { back: true, top: true, assemblyVideo: true },
  p016: { back: true, top: true, assemblyVideo: true },
  p017: { back: true, top: true, assemblyVideo: true },
  p018: { back: true, top: true, assemblyVideo: true },
  p019: { back: true, top: true, assemblyVideo: true },
  p020: { back: true, assemblyVideo: true },
  p021: { back: true, side: true, top: true, assemblyVideo: true },
  p022: { back: true, assemblyVideo: true },
};

export const mediaPathFor = (productId: string, asset: AssetKey): string => {
  const base = `/products/${productId}`;
  const files: Record<AssetKey, string> = {
    front: 'front.jpg',
    back: 'back.jpg',
    side: 'side.jpg',
    top: 'top.jpg',
    assemblyVideo: 'assembly.mp4',
    model3d: 'model.glb',
  };
  return `${base}/${files[asset]}`;
};

export function createProductMedia(productId: string) {
  const published = PUBLISHED_PRODUCT_MEDIA[productId] || {};
  const media: ProductMedia = {
    productId,
    front: published.front ? mediaPathFor(productId, 'front') : null,
    back: published.back ? mediaPathFor(productId, 'back') : null,
    side: published.side ? mediaPathFor(productId, 'side') : null,
    top: published.top ? mediaPathFor(productId, 'top') : null,
    assemblyVideo: published.assemblyVideo ? mediaPathFor(productId, 'assemblyVideo') : null,
    model3d: published.model3d ? mediaPathFor(productId, 'model3d') : null,
  };

  const images = [media.front, media.back, media.side, media.top].filter(Boolean) as string[];
  Object.assign(images, { front: media.front, back: media.back, side: media.side, top: media.top });

  return {
    media,
    images: images as ProductImages & string[],
    assemblyVideo: media.assemblyVideo,
    model3d: media.model3d,
  };
}

/** Runtime defence for components receiving data from an API or future CMS. */
export function isOwnedProductAsset(productId: string, src: string | null | undefined): src is string {
  if (!src) return false;
  if (src.includes('..') || /[?#]/.test(src)) return false;
  const expectedPrefix = `/products/${encodeURIComponent(productId)}/`;
  if (src.startsWith(expectedPrefix)) return true;
  if (productId === 'p006' && (src === '/models/watches/p006_titanova_assembly.glb' || src === '/products/p006/model.glb')) return true;
  return false;
}
