import { Link } from "react-router-dom";
import Icon from "../components/ui/Icon";
import Button from "../components/ui/Button";
import WatchArtwork from "../components/ui/WatchArtwork";
import { useCart } from "../context/CartContext";
import { useCurrency } from "../context/CurrencyContext";

const SHIPPING_FEE = 499;
const FREE_SHIPPING_THRESHOLD = 25000;

export default function Cart() {
  const { items, subtotal, updateQuantity, removeItem, clear } = useCart();
  const { format } = useCurrency();

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  return (
    <section className="bg-jet-black pb-20 pt-12">
      <div className="container-luxe">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/35">
          <Link to="/" className="transition hover:text-gold">
            Home
          </Link>
          <Icon name="chevronRight" size={11} />
          <span className="text-gold">Cart</span>
        </nav>

        <h1 className="mt-6 font-display text-3xl text-white sm:text-4xl">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="mt-12 flex flex-col items-center gap-6 border border-white/10 bg-charcoal/40 px-6 py-20 text-center">
            <Icon name="cart" size={40} className="text-gold/50" />
            <div>
              <h2 className="font-display text-2xl text-white">Your cart is empty</h2>
              <p className="mt-2 text-sm text-ash">Explore the collection and add a timepiece you love.</p>
            </div>
            <Button to="/shop">Browse Watches</Button>
          </div>
        ) : (
          <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
            <ul className="flex flex-col divide-y divide-white/5 border border-white/10 bg-charcoal/30">
              {items.map((item) => (
                <li key={item.id} className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
                  <Link
                    to={`/shop/${item.slug}`}
                    className="h-32 w-28 shrink-0 overflow-hidden bg-[#0d0d0d]"
                  >
                    <WatchArtwork art={item.art} label={item.name} className="h-full w-full" />
                  </Link>

                  <div className="flex flex-1 flex-col gap-2">
                    <Link
                      to={`/shop/${item.slug}`}
                      className="font-display text-xl text-white transition hover:text-gold"
                    >
                      {item.name}
                    </Link>
                    <span className="text-sm text-gold">{format(item.price)}</span>

                    <div className="mt-2 flex flex-wrap items-center gap-4">
                      <div className="flex items-center border border-white/15">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label={`Decrease quantity of ${item.name}`}
                          className="px-3 py-2 text-warm-white/80 transition hover:text-gold"
                        >
                          <Icon name="minus" size={12} />
                        </button>
                        <span className="min-w-9 text-center text-sm text-white">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label={`Increase quantity of ${item.name}`}
                          className="px-3 py-2 text-warm-white/80 transition hover:text-gold"
                        >
                          <Icon name="plus" size={12} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-white/40 transition hover:text-gold"
                      >
                        <Icon name="trash" size={13} />
                        Remove
                      </button>
                    </div>
                  </div>

                  <span className="text-lg text-warm-white sm:text-right">
                    {format(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <aside className="h-fit border border-white/10 bg-charcoal/40 p-6 lg:sticky lg:top-28">
              <h2 className="font-display text-xl text-white">Order Summary</h2>
              <div className="gold-rule mt-4 mb-5 w-16" />

              <dl className="flex flex-col gap-3 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-ash">Subtotal</dt>
                  <dd className="text-warm-white">{format(subtotal)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-ash">Shipping</dt>
                  <dd className={shipping === 0 ? "text-emerald-400/90" : "text-warm-white"}>
                    {shipping === 0 ? "Free" : format(shipping)}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-ash">Duties &amp; taxes</dt>
                  <dd className="text-white/40">Calculated at checkout</dd>
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-4">
                  <dt className="text-[11px] uppercase tracking-[0.2em] text-ash">Total</dt>
                  <dd className="font-display text-2xl text-gold">{format(total)}</dd>
                </div>
              </dl>

              {subtotal < FREE_SHIPPING_THRESHOLD ? (
                <p className="mt-4 text-[11px] leading-relaxed text-white/40">
                  Add {format(FREE_SHIPPING_THRESHOLD - subtotal)} more for complimentary worldwide shipping.
                </p>
              ) : null}

              <div className="mt-6 flex flex-col gap-3">
                <Button to="/checkout" className="w-full">
                  Proceed to Checkout
                </Button>
                <Button to="/enquiry" variant="outline" className="w-full">
                  Request an Invoice
                </Button>
                <button
                  type="button"
                  onClick={clear}
                  className="text-[11px] uppercase tracking-[0.16em] text-white/35 transition hover:text-red-300"
                >
                  Clear cart
                </button>
              </div>

              <ul className="mt-6 flex flex-col gap-2 border-t border-white/10 pt-5 text-[11px] text-white/40">
                <li className="flex items-center gap-2">
                  <Icon name="shield" size={13} className="text-gold" />
                  Secure, encrypted checkout
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="refresh" size={13} className="text-gold" />
                  30 day return policy
                </li>
              </ul>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
