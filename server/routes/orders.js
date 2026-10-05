import express from 'express';
import { getOrdersCollection } from '../config/db.js';
import { optionalAuth, requireAuth } from '../middleware/auth.js';
import products from '../data/products.js';
import { sendOrderNotificationEmail } from '../services/emailService.js';

const router = express.Router();

/**
 * Generate secure unique Order ID (e.g., TIT-928374-123)
 */
function generateOrderId() {
  const prefix = 'TIT';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${timestamp}-${random}`;
}

// POST /api/orders - Create & persist order, validate pricing, send Gmail notification
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, discount = 0 } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one timepiece.' });
    }

    if (!shippingAddress || !shippingAddress.name || !shippingAddress.street) {
      return res.status(400).json({ error: 'Valid delivery address details are required.' });
    }

    // SERVER-SIDE SECURITY & PRICING VERIFICATION
    // Never trust client prices: look up every product from the master atelier catalog
    const validatedItems = [];
    let calculatedSubtotal = 0;

    for (const item of items) {
      const prodId = item.productId || item.product?.id || item.id;
      const catalogProduct = products.find(p => p.id === prodId);

      if (!catalogProduct) {
        return res.status(400).json({ error: `Timepiece identifier '${prodId}' does not exist in our atelier.` });
      }

      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
      const unitPrice = catalogProduct.price; // Authentic server price
      const itemSubtotal = unitPrice * qty;

      calculatedSubtotal += itemSubtotal;

      validatedItems.push({
        productId: catalogProduct.id,
        productName: catalogProduct.name,
        quantity: qty,
        price: unitPrice,
        subtotal: itemSubtotal,
        image: catalogProduct.images?.[0] || '/images/watches/fallback-watch.svg',
        color: item.selectedColor || item.color || catalogProduct.colors?.[0] || '',
      });
    }

    // Server-calculated shipping: Free above ₹10,000, else ₹299
    const calculatedShipping = calculatedSubtotal > 10000 ? 0 : 299;
    const validatedDiscount = Math.max(0, Number(discount) || 0);
    const calculatedTotal = calculatedSubtotal + calculatedShipping - validatedDiscount;

    const orderId = generateOrderId();
    const customerName = shippingAddress.name.trim();
    const customerEmail = (shippingAddress.email || req.user?.email || '').trim();
    const phone = shippingAddress.phone || '';

    const newOrder = {
      orderId,
      userId: req.user?.id || 'guest',
      customerName,
      customerEmail,
      phone,
      shippingAddress: {
        name: customerName,
        street: shippingAddress.street,
        city: shippingAddress.city || '',
        state: shippingAddress.state || '',
        pincode: shippingAddress.pincode || '',
        phone: shippingAddress.phone || '',
        country: shippingAddress.country || 'India',
      },
      items: validatedItems,
      subtotal: calculatedSubtotal,
      shipping: calculatedShipping,
      discount: validatedDiscount,
      totalAmount: calculatedTotal,
      orderStatus: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: paymentMethod || 'Card / UPI',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // 1. Persist Order in MongoDB
    const ordersCollection = getOrdersCollection();
    const result = await ordersCollection.insertOne(newOrder);
    newOrder._id = result.insertedId;

    console.log(`[Order API] Order #${orderId} created successfully in database for ${customerName}`);

    // 2. Dispatch Gmail Notification to ADMIN_EMAIL in background
    let emailResult = { sent: false };
    try {
      emailResult = await sendOrderNotificationEmail(newOrder);
    } catch (mailErr) {
      console.warn('[Order API] Non-fatal notification failure:', mailErr.message);
    }

    // 3. Return success response to customer
    return res.status(201).json({
      success: true,
      message: 'Order confirmed successfully.',
      order: newOrder,
      emailStatus: emailResult,
    });
  } catch (err) {
    console.error('[Create Order Error]:', err);
    return res.status(500).json({ error: 'Failed to process order. Please try again.' });
  }
});

// GET /api/orders - Retrieve user's order history
router.get('/', requireAuth, async (req, res) => {
  try {
    const ordersCollection = getOrdersCollection();
    const orders = await ordersCollection
      .find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .toArray();

    return res.json({ orders });
  } catch (err) {
    console.error('[Get Orders Error]:', err);
    return res.status(500).json({ error: 'Failed to retrieve orders.' });
  }
});

// GET /api/orders/admin-notifications - Retrieve host/admin notification logs
router.get('/admin-notifications', async (_req, res) => {
  try {
    const fs = await import('fs');
    const path = await import('path');
    const { fileURLToPath } = await import('url');
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const filePath = path.join(__dirname, '../data/admin_notifications.json');

    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      return res.json({ notifications: data });
    }
    return res.json({ notifications: [] });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to read notification archives.' });
  }
});

// GET /api/orders/:id - Retrieve order by Order ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const ordersCollection = getOrdersCollection();
    const order = await ordersCollection.findOne({ orderId: id });

    if (!order) {
      return res.status(404).json({ error: `Order #${id} not found.` });
    }

    return res.json({ order });
  } catch (err) {
    console.error('[Get Single Order Error]:', err);
    return res.status(500).json({ error: 'Failed to fetch order details.' });
  }
});

export default router;
