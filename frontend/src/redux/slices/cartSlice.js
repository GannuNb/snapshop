import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import cartService from "../../services/cartService";

export const fetchCart = createAsyncThunk(
  "cart/fetch",
  async (token) => {
    return await cartService.getCart(token);
  }
);

export const addItemToCart = createAsyncThunk(
  "cart/add",
  async ({ productId, token }) => {
    return await cartService.addToCart(productId, token);
  }
);

export const removeItemFromCart = createAsyncThunk(
  "cart/remove",
  async ({ productId, token }) => {
    return await cartService.removeFromCart(productId, token);
  }
);

export const updateCartQuantity = createAsyncThunk(
  "cart/updateQty",
  async ({ productId, quantity, token }) => {
    return await cartService.updateQuantity(
      productId,
      quantity,
      token
    );
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    isLoading: false,
    successMessage: "",
  },
  reducers: {
    clearCartMessage: (state) => {
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.successMessage = "Product added to cart";
      })
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.items = action.payload.items;
      });
  },
});

export const { clearCartMessage } = cartSlice.actions;
export default cartSlice.reducer;
