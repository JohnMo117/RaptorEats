import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';

/**
 * Cart Context — Manages cart state across the app.
 * Provides add/remove/update/clear operations and total computation.
 */

const CartContext = createContext(undefined);

// Action types
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
};

function cartReducer(state, action) {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const existingIndex = state.items.findIndex(
        (item) => item.cartItemId === action.payload.cartItemId
      );
      if (existingIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + 1,
        };
        return { ...state, items: updatedItems };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };
    }

    case CART_ACTIONS.REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter((item) => item.cartItemId !== action.payload),
      };

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { cartItemId, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.cartItemId !== cartItemId),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.cartItemId === cartItemId ? { ...item, quantity } : item
        ),
      };
    }

    case CART_ACTIONS.CLEAR_CART:
      return { ...state, items: [] };

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  const addToCart = useCallback((item) => {
    dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: item });
  }, []);

  const removeFromCart = useCallback((cartItemId) => {
    dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: cartItemId });
  }, []);

  const updateQuantity = useCallback((cartItemId, quantity) => {
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { cartItemId, quantity },
    });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  }, []);

  const getItemQuantity = useCallback(
    (id) => {
      return state.items
        .filter((i) => i.id === id)
        .reduce((sum, i) => sum + i.quantity, 0);
    },
    [state.items]
  );

  const getCartItemQuantity = useCallback(
    (cartItemId) => {
      const item = state.items.find((i) => i.cartItemId === cartItemId);
      return item ? item.quantity : 0;
    },
    [state.items]
  );

  const totalPrice = useMemo(() => {
    return state.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }, [state.items]);

  const totalItems = useMemo(() => {
    return state.items.reduce((sum, item) => sum + item.quantity, 0);
  }, [state.items]);

  const value = useMemo(
    () => ({
      items: state.items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getItemQuantity,
      getCartItemQuantity,
      totalPrice,
      totalItems,
    }),
    [
      state.items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getItemQuantity,
      getCartItemQuantity,
      totalPrice,
      totalItems,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
