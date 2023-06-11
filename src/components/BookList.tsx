import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../redux/store';
import { addBook } from '../redux/wishlistSlice';

const BookList: React.FC = () => {
  const dispatch = useAppDispatch();
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `https://www.googleapis.com/books/v1/volumes?q=flowers+inauthor:keyes&key=${process.env.REACT_APP_GOOGLE_BOOKS_API_KEY}`;
        console.log('url: ',url);
        const response = await fetch(url);
        if (!response.ok) throw new Error('HTTP error ' + response.status);
        const data = await response.json();
        setBooks(data.items);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(String(error)); // convert the error to string if it's not an Error instance
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddToWishlist = (book: any) => {
    dispatch(addBook(book));
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>BookList</h2>
      {books.map((book: any, index: number) => (
        <div key={index} style={{border: "1px solid black", padding: "10px", margin: "10px"}}>
          <h3 onClick={() => handleAddToWishlist(book.volumeInfo.title)}>{book.volumeInfo.title}</h3>
          <img src={book.volumeInfo.imageLinks?.thumbnail} alt={book.volumeInfo.title} />
          <p>{book.volumeInfo.description}</p>
          <button onClick={() => handleAddToWishlist(book)}>Add to wishlist</button>
        </div>
      ))}
    </div>
  );
};

export default BookList;