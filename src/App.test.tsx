import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { store } from './redux/store';
import App from './App';
import React = require('react');

test('navigating', () => {
  const history = createMemoryHistory();
  history.push('/wishlist');

  render(
    <Provider store={store}>
      <Router history={history}>
        <App />
      </Router>
    </Provider>
  );

  expect(screen.getByText('My Wishlist')).toBeInTheDocument();

  history.push('/search');

});