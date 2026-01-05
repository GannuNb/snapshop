import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productService from "../../services/productService";

/* ================= FETCH PRODUCTS (PAGINATION) ================= */
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

/* ================= ADD PRODUCT (SELLER) ================= */
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

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    page: 1,
    totalPages: 1,
    isLoading: false,
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
      /* FETCH PRODUCTS */
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      /* ADD PRODUCT */
      .addCase(addProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addProduct.fulfilled, (state) => {
        state.isLoading = false;
        state.success = true;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetProductState } = productSlice.actions;
export default productSlice.reducer;
