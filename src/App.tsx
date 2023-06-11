import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import NavBar from './components/NavBar';
import BookList from './components/BookList';
import Wishlist from './components/WishList';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/" element={<BookList />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
