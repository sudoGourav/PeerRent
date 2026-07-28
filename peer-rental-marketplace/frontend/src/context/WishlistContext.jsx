import { createContext, useContext, useEffect, useState } from "react";

import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../services/wishlist.service";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlistIds, setWishlistIds] = useState([]);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const res = await getWishlist();

      setWishlistIds(res.data.map((item) => item.itemId));
    } catch (err) {
      console.log("Wishlist not loaded");
    }
  };

  const toggleWishlist = async (itemId) => {
    if (wishlistIds.includes(itemId)) {
      await removeFromWishlist(itemId);

      setWishlistIds((prev) =>
        prev.filter((id) => id !== itemId)
      );
    } else {
      await addToWishlist(itemId);

      setWishlistIds((prev) => [...prev, itemId]);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        toggleWishlist,
        loadWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}