import { createSlice } from "@reduxjs/toolkit";
import { updateUserCart } from "../apiCalls";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalValue: 0,
    quantity: 0,
  },
  reducers: {
    addCartItem: (state, action) => {
      let alreadyIncluded = state.items.find(
        (el) =>
          el.productId === action.payload.productId &&
          el.variantId === action.payload.variantId
      );
      if (alreadyIncluded) {
        if (
          action.payload.quantity <=
          alreadyIncluded.variantStock - alreadyIncluded.quantity
        ) {
          alreadyIncluded.quantity += action.payload.quantity;
          state.totalValue +=
            action.payload.variantPrice * action.payload.quantity;
          state.quantity += action.payload.quantity;
        } else {
          return;
        }
      } else {
        state.items.push(action.payload);
        state.totalValue +=
          action.payload.variantPrice * action.payload.quantity;
        state.quantity += action.payload.quantity;
      }
    },
    removeCartItem: (state, action) => {
      if (action.payload.index == null) return;
      let deleted = state.items.splice(action.payload.index, 1)[0];
      state.totalValue -= deleted.variantPrice * deleted.quantity;
      state.quantity -= deleted.quantity;
    },
    incraseOne: (state, action) => {
      if (action.payload.index == null) return;
      let item = state.items[action.payload.index];
      if (item.quantity < item.variantStock) {
        item.quantity += 1;
        state.totalValue += item.variantPrice;
        state.quantity += 1;
      }
    },
    decraseOne: (state, action) => {
      if (action.payload.index == null) return;
      let item = state.items[action.payload.index];
      if (item.quantity > 1) {
        item.quantity -= 1;
        state.totalValue -= item.variantPrice;
        state.quantity -= 1;
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalValue = 0;
      state.quantity = 0;
    },
    updateCart: (state, action) => {
      if (action.payload.cart == null) return;
      if (state.quantity !== 0) return;
      state.items = action.payload.cart.items || [];
      state.totalValue = action.payload.cart.totalValue || 0;
      state.quantity = action.payload.cart.quantity || 0;
    },
  },
});

export const saveCartThunk = (payload) => async (dispatch, getState) => {
  try {
    const currentState = getState();
    updateUserCart("", currentState.cart);
  } catch {}
};

export const {
  addCartItem,
  removeCartItem,
  incraseOne,
  decraseOne,
  clearCart,
  updateCart,
} = cartSlice.actions;
export default cartSlice.reducer;
