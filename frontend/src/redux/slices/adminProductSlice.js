import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminProductService from "../../services/adminProductService";

/* ================= FETCH PENDING ================= */
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

/* ================= APPROVE ================= */
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

/* ================= REJECT ================= */
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

/* ================= SLICE ================= */
const adminProductSlice = createSlice({
  name: "adminProduct",
  initialState: {
    pendingProducts: [],
    isLoading: false,
    isError: false,
    message: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      /* FETCH */
      .addCase(fetchPendingProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPendingProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pendingProducts = action.payload;
      })
      .addCase(fetchPendingProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      /* ⭐ APPROVE → REMOVE FROM UI */
      .addCase(approveProduct.fulfilled, (state, action) => {
        state.pendingProducts = state.pendingProducts.filter(
          (p) => p._id !== action.meta.arg.id
        );
      })

      /* ⭐ REJECT → REMOVE FROM UI */
      .addCase(rejectProduct.fulfilled, (state, action) => {
        state.pendingProducts = state.pendingProducts.filter(
          (p) => p._id !== action.meta.arg.id
        );
      });
  },
});

export default adminProductSlice.reducer;
