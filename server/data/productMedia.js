const publishedProductMedia = {
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

export function mediaPathFor(productId, asset) {
  const files = {
    front: 'front.jpg',
    back: 'back.jpg',
    side: 'side.jpg',
    top: 'top.jpg',
    assemblyVideo: 'assembly.mp4',
    model3d: 'model.glb',
  };
  return `/products/${productId}/${files[asset]}`;
}

export function createProductMedia(productId) {
  const published = publishedProductMedia[productId] || {};
  const media = {
    productId,
    front: published.front ? mediaPathFor(productId, 'front') : null,
    back: published.back ? mediaPathFor(productId, 'back') : null,
    side: published.side ? mediaPathFor(productId, 'side') : null,
    top: published.top ? mediaPathFor(productId, 'top') : null,
    assemblyVideo: published.assemblyVideo ? mediaPathFor(productId, 'assemblyVideo') : null,
    model3d: published.model3d ? mediaPathFor(productId, 'model3d') : null,
  };
  const images = [media.front, media.back, media.side, media.top].filter(Boolean);
  Object.assign(images, { front: media.front, back: media.back, side: media.side, top: media.top });
  return { media, images, assemblyVideo: media.assemblyVideo, model3d: media.model3d };
}
