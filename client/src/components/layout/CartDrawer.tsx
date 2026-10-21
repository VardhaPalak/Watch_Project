import { Link } from "react-router-dom";
import Icon from "../ui/Icon";
import WatchArtwork from "../ui/WatchArtwork";
import Button from "../ui/Button";
import { useCart } from "../../context/CartContext";
import { useCurrency } from "../../context/CurrencyContext";

export default function CartDrawer() {
  const { items, subtotal, isOpen, closeCart, updateQuantity, removeItem } = useCart();
  const { format } = useCurrency();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[85]">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeCart} />
      <aside className="absolute right-0 top-0 flex h-full w-[90%] max-w-[420px] flex-col border-l border-white/10 bg-charcoal">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 className="font-display text-xl tracking-[0.2em] text-white">Your Cart</h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="flex h-10 w-10 items-center justify-center text-warm-white/70 transition hover:text-gold"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
            <Icon name="cart" size={40} className="text-gold/60" />
            <p className="text-sm text-ash">Your cart is empty. Discover a timepiece to begin.</p>
            <Button to="/shop" onClick={closeCart} variant="outline">
              Browse Watches
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-white/5 overflow-y-auto px-5">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 py-4">
                  <Link
                    to={`/shop/${item.slug}`}
                    onClick={closeCart}
                    className="h-24 w-20 shrink-0 overflow-hidden bg-[#0d0d0d]"
                  >
                    <WatchArtwork art={item.art} label={item.name} className="h-full w-full" />
                  </Link>

                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <Link
                        to={`/shop/${item.slug}`}
                        onClick={closeCart}
                        className="font-display text-base text-white transition hover:text-gold"
                      >
                        {item.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.name}`}
                        className="text-white/35 transition hover:text-gold"
                      >
                        <Icon name="trash" size={15} />
                      </button>
                    </div>
                    <span className="text-sm text-gold">{format(item.price)}</span>

                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center border border-white/15">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                          className="px-2.5 py-1.5 text-white/70 transition hover:text-gold"
                        >
                          <Icon name="minus" size={12} />
                        </button>
                        <span className="min-w-8 text-center text-xs text-white">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                          className="px-2.5 py-1.5 text-white/70 transition hover:text-gold"
                        >
                          <Icon name="plus" size={12} />
                        </button>
                      </div>
                      <span className="text-sm text-warm-white">{format(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-white/10 px-5 py-5">
              <div className="mb-4 flex items-center justify-between text-sm">
                <span className="uppercase tracking-[0.18em] text-ash">Subtotal</span>
                <span className="font-display text-xl text-gold">{format(subtotal)}</span>
              </div>
              <p className="mb-4 text-[11px] leading-relaxed text-white/40">
                Shipping, duties and taxes are calculated at checkout. Enquiries are answered within one
                business day.
              </p>
              <div className="flex flex-col gap-2.5">
                <Button to="/cart" onClick={closeCart} className="w-full">
                  View Cart
                </Button>
                <Button to="/checkout" onClick={closeCart} variant="outline" className="w-full">
                  Checkout
                </Button>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
