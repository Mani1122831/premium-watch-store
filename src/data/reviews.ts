export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
}

export const reviews: Review[] = [
  {
    id: 'r1',
    productId: 'p001',
    author: 'Arjun Mehta',
    rating: 5,
    date: '2024-10-15',
    title: 'Absolutely stunning watch',
    comment: 'The Meridian Classic Gold exceeded all my expectations. The finishing is impeccable and it looks even better in person. The leather strap is buttery soft and the gold indices catch the light beautifully. Highly recommended.',
    verified: true,
  },
  {
    id: 'r2',
    productId: 'p001',
    author: 'Priya Sharma',
    rating: 4,
    date: '2024-09-22',
    title: 'Beautiful gift for my husband',
    comment: 'Bought this as a gift for my husband\'s birthday and he absolutely loves it. The packaging alone was impressive — very premium feel. Only minor issue is the clasp is slightly stiff, but that should loosen over time.',
    verified: true,
  },
  {
    id: 'r3',
    productId: 'p002',
    author: 'Deepika Nair',
    rating: 5,
    date: '2024-11-01',
    title: 'A dream on the wrist',
    comment: 'The Celestia Rose is absolutely divine. I\'ve received so many compliments. The automatic movement is a beautiful detail I love to show through the caseback. Worth every rupee.',
    verified: true,
  },
  {
    id: 'r4',
    productId: 'p003',
    author: 'Rohit Bose',
    rating: 5,
    date: '2024-10-08',
    title: 'Pro-level chronograph at this price',
    comment: 'Apex Chrono is a beast. Incredibly accurate, the tachymeter is genuinely useful, and it looks aggressive in the best possible way. The stainless bracelet feels solid and substantial.',
    verified: true,
  },
  {
    id: 'r5',
    productId: 'p005',
    author: 'Karan Patel',
    rating: 4,
    date: '2024-11-12',
    title: 'Best smartwatch in this price range',
    comment: 'The Horizon Smart Elite has a genuinely premium feel that most smartwatches lack. The AMOLED display is gorgeous and the health tracking is very accurate. Battery easily lasts 5 days.',
    verified: true,
  },
  {
    id: 'r6',
    productId: 'p008',
    author: 'Vikram Chandrasekhar',
    rating: 5,
    date: '2024-10-30',
    title: 'A true heirloom piece',
    comment: 'The Prestige Automatic Moon is simply breathtaking. The moon phase complication is incredibly romantic and the finishing rivals watches costing three times more. TITANOVA has created something very special here.',
    verified: true,
  },
  {
    id: 'r7',
    productId: 'p004',
    author: 'Sahil Gupta',
    rating: 4,
    date: '2024-09-05',
    title: 'Perfect office watch',
    comment: 'The Nova Slate Urban is everything I wanted in a work watch. Clean, understated, and pairs with everything. The DLC coating shows zero signs of wear after 3 months of daily use.',
    verified: true,
  },
  {
    id: 'r8',
    productId: 'p006',
    author: 'Ananya Krishnan',
    rating: 5,
    date: '2024-10-20',
    title: 'Elegant and delicate',
    comment: 'The Lumiere Blanc is exactly what I was looking for. It\'s slim enough to fit under shirt cuffs and elegant enough for evening occasions. The white dial is so crisp and clean.',
    verified: true,
  },
  {
    id: 'r9',
    productId: 'p007',
    author: 'Nikhil Reddy',
    rating: 5,
    date: '2024-11-08',
    title: 'Serious diver tool watch',
    comment: 'The Vanguard Diver 200 is no-nonsense, serious kit. Excellent lume, the bezel action is precise and firm, and the bracelet has zero end-link play. You can actually dive with this.',
    verified: true,
  },
  {
    id: 'r10',
    productId: 'p016',
    author: 'Aditya Singh',
    rating: 5,
    date: '2024-11-15',
    title: 'My grail watch, finally',
    comment: 'Saved up for the Helix Sport and it was absolutely worth the wait. The red accents give it incredible personality and the automatic movement winds reliably with daily wear.',
    verified: true,
  },
];
