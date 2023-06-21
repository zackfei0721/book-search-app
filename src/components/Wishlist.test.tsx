import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import wishlistReducer from '../redux/wishlistSlice';
import Wishlist from './WishList';
import React = require('react');

test('renders Wishlist with empty initial state', () => {
  const store = configureStore({
    reducer: {
      wishlist: wishlistReducer
    }
  });

  render(
    <Provider store={store}>
      <Wishlist />
    </Provider>
  );

  expect(screen.getByText('Your wishlist is empty.')).toBeInTheDocument();
});