import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Book } from '../types';

interface WishlistState {
  wishlist: Book[];
}

const initialState: WishlistState = {
  wishlist: [],
};

export const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addBook: (state, action: PayloadAction<Book>) => {
      console.log('Adding book:', action.payload);
      state.wishlist.push(action.payload);
      console.log('New state:', state.wishlist);
    },
    removeBook: (state, action: PayloadAction<string>) => {
      console.log('Removing book with id:', action.payload);
      state.wishlist = state.wishlist.filter(book => book.id !== action.payload);
      console.log('New state:', state.wishlist);
    },
  },
});

export const { addBook, removeBook } = wishlistSlice.actions;

export default wishlistSlice.reducer;