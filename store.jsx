import { useState, useMemo } from "react";
 
const PRODUCTS = [
  { id: "mug", name: "Stoneware Mug", desc: "Matte glaze, holds 12oz", price: 18 },
  { id: "candle", name: "Cedar & Fig Candle", desc: "Soy wax, 40hr burn", price: 24 },
  { id: "tote", name: "Canvas Tote", desc: "Heavyweight cotton", price: 22 },
  { id: "towel", name: "Linen Kitchen Towel", desc: "Set of two", price: 16 },
];
 
export default function Store() {
  // cart lives as { [productId]: quantity }, same shape as the vanilla JS version
  const [cart, setCart] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [justConfirmed, setJustConfirmed] = useState(false);
 
  // derived values are computed on each render instead of manually
  // recalculated and written into the DOM — this is the main mindset shift
  // from the vanilla version's renderCart() function.
  const items = useMemo(
    () => Object.entries(cart).filter(([, qty]) => qty > 0),
    [cart]
  );
  const itemCount = items.reduce((sum, [, qty]) => sum + qty, 0);
  const total = items.reduce((sum, [id, qty]) => {
    const product = PRODUCTS.find((p) => p.id === id);
    return sum + product.price * qty;
  }, 0);
 
  function addToCart(id) {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    setDrawerOpen(true);
    setJustConfirmed(false);
  }
 
  function changeQty(id, delta) {
    setCart((prev) => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) + delta) }));
  }
 
  function checkout() {
    setCart({});
    setJustConfirmed(true);
  }
 
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-serif">
      <header className="sticky top-0 bg-stone-50 border-b border-stone-300 z-10">
        <div className="max-w-3xl mx-auto flex items-baseline justify-between px-5 py-4">
          <div className="text-xl">
            Field<span className="text-emerald-800">note</span>
          </div>
          <button
            onClick={() => setDrawerOpen(true)}
            className="text-sm border border-stone-300 rounded px-3 py-2 hover:bg-stone-100"
          >
            Cart ({itemCount})
          </button>
        </div>
      </header>
 
      <main className="max-w-3xl mx-auto px-5 py-10">
        <div className="max-w-md mb-9">
          <h1 className="text-2xl font-normal mb-2">A few good things for the house.</h1>
          <p className="text-stone-500">
            Small batch, made to last. This checkout is a demo — nothing is actually charged.
          </p>
        </div>
 
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-5">
          {PRODUCTS.map((p) => (
            <div key={p.id} className="bg-white border border-stone-300 rounded flex flex-col">
              <div className="h-32 border-b border-stone-300 flex items-center justify-center text-stone-400 text-sm">
                {p.name.split(" ")[0]}
              </div>
              <div className="p-4 flex flex-col gap-1 flex-1">
                <h3 className="font-normal">{p.name}</h3>
                <p className="text-stone-500 text-sm">{p.desc}</p>
                <div className="mt-auto pt-3 flex items-center justify-between">
                  <span>${p.price.toFixed(2)}</span>
                  <button
                    onClick={() => addToCart(p.id)}
                    className="bg-emerald-800 text-stone-50 text-sm rounded px-3 py-2 hover:bg-emerald-900"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
 
      {/* overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/35 z-20"
          onClick={() => setDrawerOpen(false)}
        />
      )}
 
      {/* drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-stone-50 border-l border-stone-300 z-30
        flex flex-col transition-transform duration-200
        ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-300">
          <strong>Your cart</strong>
          <button onClick={() => setDrawerOpen(false)} className="text-xl leading-none">
            &times;
          </button>
        </div>
 
        <div className="flex-1 overflow-y-auto px-5">
          {items.length === 0 ? (
            <p className="text-stone-500 text-sm py-5">Your cart is empty.</p>
          ) : (
            items.map(([id, qty]) => {
              const p = PRODUCTS.find((x) => x.id === id);
              return (
                <div
                  key={id}
                  className="flex items-center justify-between py-3 border-b border-stone-300"
                >
                  <div>
                    <div className="text-sm">{p.name}</div>
                    <div className="text-stone-500 text-xs">${p.price.toFixed(2)} each</div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <button
                      onClick={() => changeQty(id, -1)}
                      className="w-6 h-6 border border-stone-300 rounded"
                    >
                      −
                    </button>
                    <span>{qty}</span>
                    <button
                      onClick={() => changeQty(id, 1)}
                      className="w-6 h-6 border border-stone-300 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
 
        <div className="px-5 py-4 border-t border-stone-300">
          <div className="flex justify-between mb-3">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button
            onClick={checkout}
            disabled={items.length === 0}
            className="w-full bg-emerald-800 text-stone-50 rounded py-3 disabled:opacity-50"
          >
            Checkout
          </button>
          {justConfirmed && (
            <p className="text-center text-stone-500 text-sm pt-3">
              Order placed — thank you! (Demo only, no charge made.)
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
 
