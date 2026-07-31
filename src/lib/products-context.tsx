"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

import { type Product, seedProducts } from "@/lib/product-data";

type ProductsContextValue = {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updater: (p: Product) => Product) => void;
  removeProduct: (id: string) => void;
};

const ProductsContext = createContext<ProductsContextValue | null>(null);

/**
 * Wraps the (dashboard) route group alongside InstagramPostsProvider and
 * OrdersProvider. Before this existed, Product Management held its own
 * local `useState(seedProducts)` and Website Builder separately imported
 * the static `seedProducts` array directly — so editing a product (or
 * uploading an image) in Product Management never actually reached the
 * builder, despite CLAUDE.md previously claiming it did. This context is
 * the fix: Product Management, Website Builder, Orders' product picker,
 * and Revenue's cost lookups should all read from here now, not from the
 * static `seedProducts` export directly.
 */
export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(seedProducts);

  function addProduct(product: Product) {
    setProducts((prev) => [...prev, product]);
  }
  function updateProduct(id: string, updater: (p: Product) => Product) {
    setProducts((prev) => prev.map((p) => (p.id === id ? updater(p) : p)));
  }
  function removeProduct(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <ProductsContext.Provider value={{ products, addProduct, updateProduct, removeProduct }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts(): ProductsContextValue {
  const ctx = useContext(ProductsContext);
  if (!ctx) {
    throw new Error("useProducts must be used within ProductsProvider");
  }
  return ctx;
}
