export function Footer() {
  return (
    <footer className="mt-16 bg-charcoal text-parchment-100/70">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-parchment-100">
              SKY SILHOUETTE Online Shop
            </h4>
            <p className="mt-2 text-sm">
              Cnr 12th Ave / Park Road, Suburbs, Bulawayo. Serving students and staff
              since day one — quotation on order, payment on collection.
            </p>
          </div>
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-parchment-100">
              How it works
            </h4>
            <ol className="mt-2 space-y-1 text-sm">
              <li>1. Browse the catalogue and add items to your cart</li>
              <li>2. Place your order to get a quotation</li>
              <li>3. Collect and pay at the shop counter</li>
            </ol>
          </div>
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-parchment-100">
              Hours
            </h4>
            <p className="mt-2 text-sm">Mon – Fri: 07:00 – 17:00</p>
            <p className="text-sm">Sat: 08:00 – 13:00</p>
          </div>
        </div>
        <p className="mt-8 border-t border-parchment-100/10 pt-6 text-xs">
          &copy; {new Date().getFullYear()} SKY SILHOUETTE Online Shop. Built by Bulawayo Poly Innovations Dept.
        </p>
      </div>
    </footer>
  );
}
