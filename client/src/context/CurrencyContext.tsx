import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api } from "../lib/api";
import { DEFAULT_CURRENCY, formatPrice } from "../lib/format";
import type { CurrencyConfig, StoreSettings } from "../types";

interface CurrencyContextValue {
  currency: CurrencyConfig;
  settings: StoreSettings | null;
  loading: boolean;
  format: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

const FALLBACK_SETTINGS: StoreSettings = {
  currency: DEFAULT_CURRENCY,
  business: {
    name: "TIMECRAFT",
    whatsapp: "",
    phone: "",
    email: "care@timecraft.com",
    address: "",
    hours: "Mon - Sat, 10:00 - 20:00 IST",
  },
  socials: [],
  paymentMethods: ["Visa", "Mastercard", "Rupay", "UPI", "PayPal"],
  policies: {
    privacy: "/legal/privacy",
    terms: "/legal/terms",
    shipping: "/legal/shipping",
    returns: "/legal/returns",
  },
};

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings>(FALLBACK_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api
      .get<StoreSettings>("/settings")
      .then((data) => {
        if (active && data) setSettings({ ...FALLBACK_SETTINGS, ...data });
      })
      .catch(() => {
        /* keep fallback currency */
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const currency = settings?.currency?.code ? settings.currency : DEFAULT_CURRENCY;

  const format = useCallback(
    (amount: number) => formatPrice(amount, currency),
    [currency],
  );

  const value = useMemo<CurrencyContextValue>(
    () => ({ currency, settings, loading, format }),
    [currency, settings, loading, format],
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("useCurrency must be used inside CurrencyProvider");
  return context;
}
