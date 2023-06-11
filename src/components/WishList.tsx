import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { removeBook } from '../redux/wishlistSlice';
import { Book } from '../types';

const Wishlist: React.FC = () => {
  const dispatch = useDispatch();
  const wishlist = useSelector((state: RootState) => state.wishlist.wishlist);

  const handleRemoveFromWishlist = (id: string) => {
    dispatch(removeBook(id));
  };

  return (
    <div>
      <h1>My Wishlist</h1>
      {wishlist.length > 0 ? (
        wishlist.map((book: Book) => (
          <div key={book.id} style={{border: "1px solid black", padding: "10px", margin: "10px"}}>
            <p>{book.volumeInfo.title}</p>
            <button onClick={() => handleRemoveFromWishlist(book.id)}>Remove from wishlist</button>
          </div>
        ))
      ) : (
        <p>Your wishlist is empty.</p>
      )}
    </div>
  );
};

export default Wishlist;