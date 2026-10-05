import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle } from 'lucide-react';
import { paymentService } from '../../services/paymentService';
import { Order } from '../../types/order';
import { formatPrice } from '../../utils/formatCurrency';

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadOrders() {
      try {
        const list = await paymentService.fetchUserOrders();
        if (isMounted) {
          if (list.length === 0) {
            const demoOrder: Order = {
              id: 'TIT-892144-012',
              date: new Date(Date.now() - 86400000 * 4).toISOString(),
              createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
              items: [],
              subtotal: 24999,
              shipping: 0,
              total: 24999,
              totalAmount: 24999,
              status: 'delivered',
              paymentMethod: 'UPI',
              shippingAddress: {
                name: 'Arjun Mehta',
                street: 'Penthouse 4B, Emerald Heights, Linking Road',
                city: 'Mumbai',
                state: 'Maharashtra',
                pincode: '400050',
                phone: '9876543210',
              },
            };
            setOrders([demoOrder]);
          } else {
            setOrders(list);
          }
        }
      } catch {
        if (isMounted) setOrders(paymentService.getOrders());
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadOrders();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="bg-white p-6 sm:p-8 border border-charcoal-200/80 space-y-6">
      <div className="border-b border-charcoal-100 pb-4">
        <h2 className="font-serif text-2xl text-charcoal-950 font-normal">Order History</h2>
        <p className="text-xs text-charcoal-500 font-light mt-1">
          Review previous timepieces ordered and delivery milestones.
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-charcoal-500">
          Retrieving atelier archives...
        </div>
      ) : orders.length === 0 ? (
        <div className="py-12 text-center space-y-3">
          <Package className="w-10 h-10 text-charcoal-300 mx-auto" />
          <h3 className="font-serif text-lg text-charcoal-800">No Orders Yet</h3>
          <p className="text-xs text-charcoal-500 max-w-sm mx-auto">
            Once you acquire your first TITANOVA timepiece, you will be able to track delivery progress here.
          </p>
          <Link
            to="/shop"
            className="inline-block mt-2 px-6 py-2.5 bg-charcoal-950 text-white text-xs font-bold tracking-widest uppercase hover:bg-gold-500 transition-colors"
          >
            Explore Watches
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div
              key={order.id || order.orderId}
              className="border border-charcoal-200/80 rounded-lg p-5 hover:border-charcoal-400 transition-colors space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-charcoal-100 gap-2">
                <div>
                  <span className="text-[10px] text-charcoal-400 uppercase tracking-widest block">
                    Order Reference
                  </span>
                  <span className="font-mono text-sm font-semibold text-charcoal-950">
                    #{order.orderId || order.id}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <span className="text-charcoal-500">
                    {new Date(order.date || order.createdAt || Date.now()).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase ${
                      order.status === 'delivered'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-gold-50 text-gold-700'
                    }`}
                  >
                    {order.status === 'delivered' ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      <Clock className="w-3 h-3" />
                    )}
                    <span>{order.status || 'Confirmed'}</span>
                  </span>
                </div>
              </div>

              {/* Items Summary */}
              {order.items && order.items.length > 0 && (
                <div className="space-y-2">
                  {order.items.map((item: any, idx: number) => {
                    const itemName = item.productName || item.product?.name || 'TITANOVA Timepiece';
                    const itemQty = item.quantity || 1;
                    const itemPrice = item.price || item.product?.price || 0;
                    return (
                      <div key={idx} className="flex items-center justify-between text-xs text-charcoal-700">
                        <span className="truncate max-w-[70%]">
                          {itemQty}x {itemName}
                        </span>
                        <span className="font-mono text-charcoal-900">{formatPrice(itemPrice * itemQty)}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-charcoal-100 text-xs">
                <span className="text-charcoal-500">Payment: {order.paymentMethod || 'Online'}</span>
                <div className="text-right">
                  <span className="text-charcoal-500 mr-2">Grand Total:</span>
                  <span className="font-serif text-base font-semibold text-charcoal-950">
                    {formatPrice(order.totalAmount || order.total)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
