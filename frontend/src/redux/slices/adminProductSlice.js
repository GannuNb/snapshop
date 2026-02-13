import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminProductService from "../../services/adminProductService";

export const fetchPendingProducts = createAsyncThunk(
  "adminProduct/fetchPending",
  async (token, thunkAPI) => {
    try {
      return await adminProductService.getPendingProducts(token);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

export const approveProduct = createAsyncThunk(
  "adminProduct/approve",
  async ({ id, token }, thunkAPI) => {
    try {
      return await adminProductService.approveProduct(id, token);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

export const rejectProduct = createAsyncThunk(
  "adminProduct/reject",
  async ({ id, token }, thunkAPI) => {
    try {
      return await adminProductService.rejectProduct(id, token);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

const adminProductSlice = createSlice({
  name: "adminProduct",
  initialState: {
    pendingProducts: [],
    isLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPendingProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pendingProducts = action.payload;
      })
      .addCase(fetchPendingProducts.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default adminProductSlice.reducer;
