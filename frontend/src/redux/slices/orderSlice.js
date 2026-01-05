import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import orderService from "../../services/orderService";

/* ================= PLACE ORDER ================= */
export const placeOrder = createAsyncThunk(
  "order/place",
  async (token, thunkAPI) => {
    try {
      return await orderService.placeOrder(token);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Order failed"
      );
    }
  }
);

/* ================= FETCH MY ORDERS (BUYER) ================= */
export const fetchMyOrders = createAsyncThunk(
  "order/my",
  async (token, thunkAPI) => {
    try {
      return await orderService.getMyOrders(token);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load orders"
      );
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
    isLoading: false,
    isError: false,
    message: "",
    success: false,
  },
  reducers: {
    resetOrderState: (state) => {
      state.success = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      /* PLACE ORDER */
      .addCase(placeOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(placeOrder.fulfilled, (state) => {
        state.isLoading = false;
        state.success = true;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      /* FETCH MY ORDERS */
      .addCase(fetchMyOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;
