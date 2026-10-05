import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatCurrency';
import { Truck, ShieldCheck } from 'lucide-react';

export default function OrderSummary() {
  const { items, getSubtotal, getDiscount, getShipping, getTotal } = useCart();

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const shipping = getShipping();
  const total = getTotal();

  return (
    <div className="bg-[#faf9f7] border border-charcoal-200/80 p-6 sm:p-7 space-y-6">
      <h3 className="font-serif text-xl text-charcoal-950 font-normal border-b border-charcoal-200/80 pb-4">
        Your Order ({items.length} items)
      </h3>

      {/* Item Previews */}
      <div className="max-h-72 overflow-y-auto divide-y divide-charcoal-100 pr-1">
        {items.map(item => (
          <div key={`${item.product.id}-${item.selectedColor}`} className="py-3 flex gap-3 items-center">
            <div className="w-14 h-16 bg-gradient-to-b from-[#18191f] to-[#0c0d10] border border-charcoal-200/50 p-1 shrink-0 flex items-center justify-center rounded">
              <img
                src={item.product.images[0] || '/images/watches/fallback-watch.svg'}
                alt={item.product.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/images/watches/fallback-watch.svg';
                }}
              />
            </div>
            <div className="flex-1 min-w-0 text-xs">
              <h4 className="font-serif text-charcoal-900 font-medium truncate">{item.product.name}</h4>
              <p className="text-charcoal-500">Qty: {item.quantity}</p>
            </div>
            <div className="text-right text-xs font-semibold text-charcoal-900">
              {formatPrice(item.product.price * item.quantity)}
            </div>
          </div>
        ))}
      </div>

      {/* Calculations */}
      <div className="border-t border-charcoal-200/80 pt-4 space-y-2.5 text-xs sm:text-sm">
        <div className="flex justify-between text-charcoal-600">
          <span>Subtotal</span>
          <span className="font-medium text-charcoal-900">{formatPrice(subtotal)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-gold-700">
            <span>Special Promotional Discount</span>
            <span className="font-medium">-{formatPrice(discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-charcoal-600">
          <div className="flex items-center gap-1.5">
            <span>Insured Shipping</span>
            <Truck className="w-3.5 h-3.5 text-charcoal-400" />
          </div>
          <span className="font-medium text-charcoal-900">
            {shipping === 0 ? (
              <span className="text-emerald-700 font-semibold uppercase text-xs">Complimentary</span>
            ) : (
              formatPrice(shipping)
            )}
          </span>
        </div>

        <div className="border-t border-charcoal-200/80 pt-3 flex justify-between items-baseline">
          <span className="font-serif text-base font-medium text-charcoal-950">Grand Total</span>
          <span className="font-serif text-2xl font-bold text-charcoal-950">
            {formatPrice(total)}
          </span>
        </div>
      </div>

      <div className="pt-2 text-[11px] text-charcoal-500 space-y-2 border-t border-charcoal-200/60">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-gold-600 shrink-0" />
          <span>Includes Official Warranty Certificate</span>
        </div>
        <p className="italic">
          Demo Store notice: Orders placed here simulate real checkout without billing real money.
        </p>
      </div>
    </div>
  );
}
