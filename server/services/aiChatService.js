import products from '../data/products.js';

// Reusable knowledge base
const STORE_POLICIES = {
  shipping: 'TITANOVA provides complimentary fully-insured express shipping on all orders above ₹10,000 across India. Standard domestic delivery takes 2–4 business days with signature confirmation.',
  warranty: 'Every TITANOVA timepiece is covered by our comprehensive 2-Year International Warranty against manufacturing defects (with an extended 5-Year Warranty on our Prestige Automatic Moon and Atlas Titanium Pro, and 1-Year on Connected timepieces).',
  returns: 'We honor a 30-day hassle-free return and exchange policy for unworn timepieces in their pristine original presentation box with all documentation intact.',
  authenticity: 'Every TITANOVA watch features a unique laser-engraved serial number registered in our master atelier archives, accompanied by a physical and digital Certificate of Authenticity.',
};

/**
 * Built-in Horological Rule & Search Engine
 * Provides instant, zero-latency, high-fidelity luxury responses with exact product matching
 */
function generateLocalConciergeResponse(query, history = [], user = null) {
  const q = query.toLowerCase().trim();
  const userName = user?.name ? user.name.split(' ')[0] : null;
  const greeting = userName ? `Greetings, ${userName}. ` : 'Greetings. ';

  let matchingProducts = [];
  let responseText = '';

  // 1. Specific product name lookup
  const exactMatch = products.find(p => q.includes(p.name.toLowerCase()));
  if (exactMatch) {
    matchingProducts = [exactMatch];
    return {
      message: `${greeting}The ${exactMatch.name} is one of our most distinguished creations in the ${exactMatch.collection || exactMatch.category} collection. Priced at ₹${exactMatch.price.toLocaleString('en-IN')}, it is crafted with ${exactMatch.material} and powered by a ${exactMatch.movement}. Key features include ${exactMatch.features.slice(0, 3).join(', ')}.`,
      productIds: [exactMatch.id],
    };
  }

  // 2. Gold watches query
  if (q.includes('gold')) {
    matchingProducts = products.filter(
      p =>
        p.name.toLowerCase().includes('gold') ||
        p.material.toLowerCase().includes('gold') ||
        p.colors?.some(c => c.toLowerCase().includes('d4a017') || c.toLowerCase().includes('gold'))
    );
    responseText = `${greeting}Our gold timepieces celebrate warmth, heritage, and prestigious horology. We feature 18K Gold PVD finishes, champagne sunburst dials, and precision calibres. Here are our premier gold selections:`;
  }
  // 3. Under ₹10,000 / Budget query
  else if (q.includes('under 10000') || q.includes('under 10,000') || q.includes('under ₹10,000') || q.includes('below 10000')) {
    matchingProducts = products.filter(p => p.price <= 10000);
    if (matchingProducts.length === 0) {
      // Find closest accessible timepieces
      matchingProducts = products.filter(p => p.price <= 15000).sort((a, b) => a.price - b.price);
      responseText = `${greeting}Our pure entry-level luxury starts with the Purity Minimal Steel (₹9,999). For selections just around this range, here are our accessible timepieces crafted to uncompromising standards:`;
    } else {
      responseText = `${greeting}Here are our distinguished timepieces accessible under ₹10,000, including the minimalist Purity Minimal Steel:`;
    }
  }
  // 4. Under ₹30,000 / Under ₹25,000
  else if (q.includes('under 30000') || q.includes('under 30,000') || q.includes('under 25000') || q.includes('under 25,000')) {
    const limit = q.includes('25000') || q.includes('25,000') ? 25000 : 30000;
    matchingProducts = products
      .filter(p => p.price <= limit)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4);
    responseText = `${greeting}Here are curated TITANOVA timepieces under ₹${limit.toLocaleString('en-IN')}, offering exceptional value with sapphire crystal glass and Swiss-inspired movements:`;
  }
  // 5. Automatic vs Quartz comparison
  else if (q.includes('compare') || (q.includes('automatic') && q.includes('quartz'))) {
    matchingProducts = [
      products.find(p => p.id === 'p004' || p.name === 'Nova Slate Urban') || products[0],
      products.find(p => p.id === 'p008' || p.name.includes('Automatic')) || products[1],
    ].filter(Boolean);
    return {
      message: `${greeting}The essential distinction between Automatic and Quartz movements is the heart of timekeeping:\n\n• **Automatic Calibres**: Mechanical works of art powered perpetually by the natural kinetic motion of your wrist through an oscillating rotor. They require no battery, feature a sweeping seconds hand, and represent the romance of traditional horology (e.g., our Celestia Rose Automatic & Prestige Moon).\n\n• **Quartz Calibres**: Governed by an electric pulse through a synthetic quartz crystal, delivering unmatched day-to-day precision (accurate to seconds per month) and low maintenance (e.g., our Meridian Classic Gold & Nova Slate Urban).\n\nExplore these two archetypes below:`,
      productIds: matchingProducts.map(p => p.id),
    };
  }
  // 6. Men's watches query
  else if (q.includes("men's") || q.includes('men') || q.includes('gentleman') || q.includes('gentlemen')) {
    if (q.includes('best') || q.includes('recommend') || q.includes('which')) {
      matchingProducts = products
        .filter(p => p.gender === 'men')
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 4);
      responseText = `${greeting}For gentlemen, our most celebrated timepieces balance bold architecture with mechanical excellence. Our flagship Meridian Classic Gold and high-precision Titanova Chronograph Black are universally revered:`;
    } else {
      matchingProducts = products.filter(p => p.gender === 'men').slice(0, 4);
      responseText = `${greeting}Here are standout pieces from our Men's Horology collection, engineered with 40mm–44mm surgical-grade stainless steel:`;
    }
  }
  // 7. Women's watches query
  else if (q.includes("women's") || q.includes('women') || q.includes('ladies') || q.includes('lady')) {
    matchingProducts = products
      .filter(p => p.gender === 'women')
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4);
    responseText = `${greeting}Our Women's Collection showcases delicate 28mm–36mm silhouettes, genuine mother-of-pearl dials, and refined jewellery bracelets. Here are our top recommendations:`;
  }
  // 8. Smart watches query
  else if (q.includes('smart') || q.includes('connected') || q.includes('digital') || q.includes('fitness')) {
    matchingProducts = products.filter(p => p.category === 'Smart Watches' || p.collection === 'Smart');
    responseText = `${greeting}The TITANOVA Connected Collection marries aerospace aluminum and titanium cases with vibrant AMOLED touchscreen displays and comprehensive biometric tracking:`;
  }
  // 9. Daily use / Office / Professional
  else if (q.includes('daily') || q.includes('office') || q.includes('work') || q.includes('formal') || q.includes('everyday')) {
    matchingProducts = [
      products.find(p => p.id === 'p003') || products[2], // Titanova Heritage Steel
      products.find(p => p.id === 'p001') || products[0], // Meridian Classic Gold
      products.find(p => p.id === 'p006') || products[5], // Lumiere Blanc
      products.find(p => p.id === 'p004') || products[3], // Nova Slate Urban
    ].filter(Boolean);
    responseText = `${greeting}For daily office and professional wear, we recommend versatile designs with clean dials, scratch-resistant sapphire crystals, and comfortable leather or steel bracelets:`;
  }
  // 10. Shipping, Warranty, Returns
  else if (q.includes('shipping') || q.includes('delivery')) {
    return {
      message: `${greeting}${STORE_POLICIES.shipping}`,
      productIds: [],
    };
  } else if (q.includes('warranty') || q.includes('guarantee')) {
    return {
      message: `${greeting}${STORE_POLICIES.warranty}`,
      productIds: [],
    };
  } else if (q.includes('return') || q.includes('refund') || q.includes('exchange')) {
    return {
      message: `${greeting}${STORE_POLICIES.returns}`,
      productIds: [],
    };
  }
  // 11. New Arrivals / Best Sellers
  else if (q.includes('new') || q.includes('arrival')) {
    matchingProducts = products.filter(p => p.isNew).slice(0, 4);
    responseText = `${greeting}Here are the newest releases from the TITANOVA Atelier, fresh from our master horologists:`;
  } else if (q.includes('best') || q.includes('popular') || q.includes('top')) {
    matchingProducts = products.filter(p => p.isBestSeller).slice(0, 4);
    responseText = `${greeting}These are our most coveted best-selling timepieces, celebrated by discerning collectors worldwide:`;
  }
  // 12. Fallback / General assistance
  else {
    // Check if query is unrelated (weather, cooking, code, etc.)
    const unrelatedKeywords = ['weather', 'cook', 'recipe', 'politics', 'movie', 'song', 'joke', 'python', 'javascript'];
    if (unrelatedKeywords.some(kw => q.includes(kw))) {
      return {
        message: `${greeting}As your personal TITANOVA concierge, I specialize exclusively in our horological timepieces, collections, and purchasing guidance. May I assist you in finding a watch suited to your style or a special occasion?`,
        productIds: [],
      };
    }

    // Default curated showcase
    matchingProducts = [
      products.find(p => p.id === 'p001') || products[0],
      products.find(p => p.id === 'p002') || products[1],
      products.find(p => p.id === 'p005') || products[4],
    ].filter(Boolean);
    responseText = `${greeting}At TITANOVA, every timepiece represents precision engineering and refined luxury. How may I best assist your horological search today? You can inquire about specific collections (Men's, Women's, Smart), materials (Gold, Steel, Ceramic), or price ranges. Here are a few iconic pieces to begin:`;
  }

  return {
    message: responseText,
    productIds: matchingProducts.map(p => p.id),
  };
}

/**
 * Call Gemini AI Model if API key is provided
 */
async function callGeminiAI(userMessage, history = [], user = null) {
  const apiKey = process.env.AI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const userName = user?.name || 'Valued Guest';
    const catalogSummary = products
      .map(
        p =>
          `ID: ${p.id} | Name: ${p.name} | Gender: ${p.gender} | Category: ${p.category} | Price: ₹${p.price} | Material: ${p.material} | Movement: ${p.movement} | Collection: ${p.collection || 'N/A'}`
      )
      .join('\n');

    const systemPrompt = `You are TITANOVA AI, the personal horological concierge for TITANOVA, an exclusive luxury watch maison.
The current client is: ${userName}.
You must be polite, sophisticated, authoritative, and concise.

Store policies:
- Free insured shipping on orders above ₹10,000 across India.
- 2-Year International Warranty on standard watches (5-Year on Prestige and Atlas, 1-Year on Smart).
- 30-Day returns for unworn pieces in original box.

TITANOVA Product Catalog:
${catalogSummary}

Rules:
1. ONLY recommend watches from the catalog provided above. DO NOT invent watch models or specifications.
2. If a specific technical question cannot be answered from the catalog, politely say the exact detail is currently unavailable from the atelier.
3. For unrelated questions (e.g. general programming, news, cooking), politely decline and state your focus is TITANOVA luxury watches.
4. Output MUST BE strictly valid JSON in this exact structure:
{
  "message": "Articulate concise answer to the client...",
  "productIds": ["p001", "p002"]
}
Limit "productIds" to 1-4 matching IDs only when recommending or discussing specific products.`;

    const contents = [];
    // Convert previous history
    for (const h of history.slice(-4)) {
      if (h.sender === 'user') {
        contents.push({ role: 'user', parts: [{ text: h.text }] });
      } else if (h.sender === 'ai') {
        contents.push({ role: 'model', parts: [{ text: h.text }] });
      }
    }
    contents.push({ role: 'user', parts: [{ text: userMessage }] });

    const model = process.env.GEMINI_MODEL || 'gemini-flash-latest';
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 800,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!response.ok) {
      console.warn(`[AI Gemini API] Response status ${response.status} for model ${model}`);
      return null;
    }

    const data = await response.json();
    let rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return null;

    rawText = rawText.trim();
    if (rawText.startsWith('```json')) {
      rawText = rawText.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
    } else if (rawText.startsWith('```')) {
      rawText = rawText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    const parsed = JSON.parse(rawText);
    return {
      message: parsed.message || '',
      productIds: Array.isArray(parsed.productIds) ? parsed.productIds : [],
    };
  } catch (err) {
    console.warn('[AI Gemini API Error]:', err.message);
    return null;
  }
}

/**
 * Main AI Chat Handler
 */
export async function getChatResponse(userMessage, history = [], user = null) {
  // Try remote Gemini AI first if configured
  let aiResult = await callGeminiAI(userMessage, history, user);

  // If Gemini was not configured, failed, or timed out, gracefully use the local Horological Engine
  if (!aiResult || !aiResult.message) {
    aiResult = generateLocalConciergeResponse(userMessage, history, user);
  }

  // Hydrate product IDs with full catalog data
  const matchedProducts = (aiResult.productIds || [])
    .map(id => products.find(p => p.id === id))
    .filter(Boolean)
    .map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      originalPrice: p.originalPrice,
      category: p.category,
      gender: p.gender,
      collection: p.collection,
      description: p.description,
      image: p.images[0] || '/images/watches/fallback-watch.svg',
      movement: p.movement,
      material: p.material,
      features: p.features,
      rating: p.rating,
    }));

  return {
    message: aiResult.message,
    products: matchedProducts,
  };
}
