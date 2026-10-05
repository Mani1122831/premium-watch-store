# Product media contract

Each approved asset belongs in its own immutable directory:

```text
/products/p001/front.webp
/products/p001/back.webp
/products/p001/side.webp
/products/p001/top.webp
/products/p001/assembly.mp4
/products/p001/model.glb
```

Do not publish an asset merely because a file exists. Add its product ID and
asset key to the `PUBLISHED_PRODUCT_MEDIA` registries in `src/data/productMedia.ts`
and `server/data/productMedia.js` only after it passes the media audit. Missing
assets must remain `null`; the storefront will render **Coming soon**.
