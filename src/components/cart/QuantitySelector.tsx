import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
  max?: number;
}

export default function QuantitySelector({
  quantity,
  onIncrease,
  onDecrease,
  min = 1,
  max = 99,
}: QuantitySelectorProps) {
  return (
    <div className="inline-flex items-center border border-charcoal-300 bg-white" role="group" aria-label="Adjust quantity">
      <button
        type="button"
        onClick={onDecrease}
        disabled={quantity <= min}
        className="w-8 h-8 flex items-center justify-center text-charcoal-600 hover:text-charcoal-950 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
        aria-label="Decrease quantity"
      >
        <Minus className="w-3 h-3" />
      </button>

      <span className="w-10 text-center text-xs font-semibold text-charcoal-900 select-none">
        {quantity}
      </span>

      <button
        type="button"
        onClick={onIncrease}
        disabled={quantity >= max}
        className="w-8 h-8 flex items-center justify-center text-charcoal-600 hover:text-charcoal-950 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
        aria-label="Increase quantity"
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  );
}
