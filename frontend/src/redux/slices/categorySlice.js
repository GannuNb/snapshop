import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import categoryService from "../../services/categoryService";

export const fetchCategories = createAsyncThunk(
  "category/fetch",
  async () => {
    return await categoryService.getCategories();
  }
);

export const addCategory = createAsyncThunk(
  "category/add",
  async ({ data, token }) => {
    return await categoryService.createCategory(data, token);
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    isLoading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      });
  },
});

export default categorySlice.reducer;
