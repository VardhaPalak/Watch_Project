import { Link } from "react-router-dom";
import Icon from "../components/ui/Icon";
import Button from "../components/ui/Button";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

export default function Account() {
  const { count } = useWishlist();
  const { count: cartCount } = useCart();

  return (
    <section className="bg-jet-black pb-20 pt-16">
      <div className="container-luxe max-w-3xl">
        <span className="eyebrow">My Account</span>
        <h1 className="mt-4 font-display text-3xl text-white sm:text-4xl">Client Account</h1>
        <div className="gold-rule mt-5 w-24" />

        <div className="mt-8 border border-white/10 bg-charcoal/50 p-7">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-gold/40 text-gold">
              <Icon name="user" size={18} />
            </span>
            <div>
              <h2 className="font-display text-xl text-white">Sign-in is not enabled in this deployment</h2>
              <p className="mt-3 text-sm leading-relaxed text-ash">
                Customer accounts are planned for a later release. Until then, your wishlist and cart are stored
                securely in this browser, and every order-related question is handled by our team through the
                enquiry desk.
              </p>
            </div>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            <Link
              to="/wishlist"
              className="flex items-center justify-between border border-white/10 px-4 py-3 text-sm text-ash transition hover:border-gold/50 hover:text-gold"
            >
              Wishlist ({count})
              <Icon name="heart" size={15} />
            </Link>
            <Link
              to="/cart"
              className="flex items-center justify-between border border-white/10 px-4 py-3 text-sm text-ash transition hover:border-gold/50 hover:text-gold"
            >
              Cart ({cartCount})
              <Icon name="cart" size={15} />
            </Link>
            <Link
              to="/enquiry"
              className="flex items-center justify-between border border-white/10 px-4 py-3 text-sm text-ash transition hover:border-gold/50 hover:text-gold"
            >
              Enquiry desk
              <Icon name="mail" size={15} />
            </Link>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button to="/shop">Continue Shopping</Button>
          <Button to="/admin/login" variant="outline">
            Staff Dashboard
          </Button>
        </div>
      </div>
    </section>
  );
}
