import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Shop } from '@src/models/Shop';
import { Item } from '@src/models/Item';
import { toBase64 } from '@src/utils/files';

export interface ShopsState {
  loading: boolean;
  shops: Shop[];
  items: Item[];
  error?: any;
}

const initialState: ShopsState = {
  loading: true,
  shops: [],
  items: [],
};

export const fetchShops = createAsyncThunk<Shop[]>('shops/fetchShops', async () => {
  return [
    { id: '1', name: 'a' },
    { id: '2', name: 'b' },
    { id: '3', name: 'c' },
    { id: '4', name: 'd' },
  ];
});

export const fetchItems = createAsyncThunk<Item[], string>('shops/fetchItems', async (_) => {
  return [
    { id: 'i1', name: 'x', description: 'test' },
    { id: 'i2', name: 'y', description: 'test' },
    { id: 'i3', name: 'z', description: 'test' },
  ];
});

export type PostItemArgs = {
  item: Partial<Item>;
  file: File;
};

export const createItem = createAsyncThunk<Item, PostItemArgs>('shops/createItem', async (args) => {
  const item = args.item;
  const data = await toBase64(args.file);
  const json = {
    ...item,
    data,
  };
  console.log(json);
  return { id: 'i005', name: item.name || '', description: item.description || '' };
});

export const updateItem = createAsyncThunk<void, Partial<Item>>(
  'shops/updateItem',
  async (item) => {
    console.log(item);
  },
);

export const deleteItem = createAsyncThunk<void, Item>('shops/deleteItem', async (item) => {
  console.log(item);
});

const slice = createSlice({
  name: 'shops',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchShops.pending, (state) => {
      return {
        ...state,
        loading: true,
        shops: [],
        items: [],
        error: null,
      };
    });
    builder.addCase(fetchShops.fulfilled, (state, action) => {
      return {
        ...state,
        loading: false,
        shops: action.payload,
        items: [],
        error: null,
      };
    });
    builder.addCase(fetchShops.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        shops: [],
        items: [],
        error: action.error.message,
      };
    });
    builder.addCase(fetchItems.pending, (state) => {
      return {
        ...state,
        loading: true,
        items: [],
        error: null,
      };
    });
    builder.addCase(fetchItems.fulfilled, (state, action) => {
      return {
        ...state,
        loading: false,
        items: action.payload,
        error: null,
      };
    });
    builder.addCase(fetchItems.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        items: [],
        error: action.error.message,
      };
    });
    builder.addCase(createItem.pending, (state) => {
      return {
        ...state,
        loading: true,
        error: null,
      };
    });
    builder.addCase(createItem.fulfilled, (state, action) => {
      return {
        ...state,
        loading: false,
        items: state.items.concat(action.payload),
        error: null,
      };
    });
    builder.addCase(createItem.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        items: [],
        error: action.error.message,
      };
    });
  },
});

export default slice.reducer;
