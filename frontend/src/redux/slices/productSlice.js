import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productService from "../../services/productService";

/* ================= BUYER FETCH PRODUCTS ================= */
export const fetchProducts = createAsyncThunk(
  "product/fetch",
  async ({ page }, thunkAPI) => {
    try {
      return await productService.getProducts(page);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load products"
      );
    }
  }
);

/* ================= SELLER ADD PRODUCT ================= */
export const addProduct = createAsyncThunk(
  "product/add",
  async ({ data, token }, thunkAPI) => {
    try {
      return await productService.createProduct(data, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Product add failed"
      );
    }
  }
);

/* ================= SELLER FETCH PRODUCTS ================= */
export const fetchSellerProducts = createAsyncThunk(
  "product/fetchSellerProducts",
  async (token, thunkAPI) => {
    try {
      return await productService.getSellerProducts(token);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Failed to load seller products"
      );
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    /* BUYER */
    products: [],
    page: 1,
    totalPages: 1,

    /* SELLER */
    approvedProducts: [],
    pendingProducts: [],

    /* LOADERS */
    buyerLoading: false,
    sellerLoading: false,

    isError: false,
    success: false,
    message: "",
  },

  reducers: {
    resetProductState: (state) => {
      state.isError = false;
      state.success = false;
      state.message = "";
    },
  },

  extraReducers: (builder) => {
    builder

      /* ===== BUYER ===== */
      .addCase(fetchProducts.pending, (state) => {
        state.buyerLoading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.buyerLoading = false;
        state.products = action.payload.products;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.buyerLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      /* ===== ADD PRODUCT ===== */
      .addCase(addProduct.pending, (state) => {
        state.sellerLoading = true;
      })
      .addCase(addProduct.fulfilled, (state) => {
        state.sellerLoading = false;
        state.success = true;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.sellerLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      /* ===== SELLER FETCH ===== */
      .addCase(fetchSellerProducts.pending, (state) => {
        state.sellerLoading = true;
      })
      .addCase(fetchSellerProducts.fulfilled, (state, action) => {
        state.sellerLoading = false;
        state.approvedProducts = action.payload.approved;
        state.pendingProducts = action.payload.pending;
      })
      .addCase(fetchSellerProducts.rejected, (state, action) => {
        state.sellerLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetProductState } = productSlice.actions;
export default productSlice.reducer;
