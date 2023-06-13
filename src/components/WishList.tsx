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
        wishlist.map((book: any, index: number) => (
          <div 
            key={index} 
            style={{border: "1px solid black", borderRadius: '5px', padding: "10px", margin: "10px"}}>
            {book?.volumeInfo && (
              <>
                <h3>
                  {book.volumeInfo.title}
                </h3>
                <img 
                  src={book.volumeInfo.imageLinks?.thumbnail}
                  alt={book.volumeInfo.title} />
                <p> 
                  {book.volumeInfo.description}
                </p>
                <button onClick={() => handleRemoveFromWishlist(book.id)}>Remove from wishlist</button>
              </>
            )}
          </div>
        ))
      ) : (
        <p>Your wishlist is empty.</p>
      )}
    </div>
  );
};

export default Wishlist;