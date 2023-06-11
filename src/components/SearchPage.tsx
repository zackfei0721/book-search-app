// SearchPage.tsx
import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../redux/store';
import { addBook } from '../redux/wishlistSlice';

const SearchPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [query, setQuery] = useState("");

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchData();
  };

  const fetchData = async () => {
    if(!query) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${process.env.REACT_APP_GOOGLE_BOOKS_API_KEY}`;
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

  const handleAddToWishlist = (book: any) => {
    dispatch(addBook(book));
    setSuccessMessage(`${book.volumeInfo.title} added to wishlist!`);

    // clear the success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) return <div>{error}</div>;

  return (
    <div style={{display: 'flex', flexDirection: 'column', }}>
      <h2 style={{textAlign: 'center'}}>Search Page</h2>
      <form style={{textAlign: 'center'}}
            onSubmit={handleSearch}>
        <input type='text' value={query} onChange={handleQueryChange} />
        <button 
            style={{marginLeft: "10px", borderRadius: '5px'}}
            type='submit'>Search</button>
      </form>
      {successMessage && <p style={{color: "green"}}>{successMessage}</p>}
      {books.map((book: any, index: number) => (
        <div key={index} style={{border: "1px solid black", borderRadius: '5px' ,padding: "10px", margin: "10px"}}>
          <h3 onClick={() => handleAddToWishlist(book.volumeInfo.title)}>
            {book.volumeInfo.title}
          </h3>
          <img src={book.volumeInfo.imageLinks?.thumbnail} alt={book.volumeInfo.title} />
          <p> 
            {book.volumeInfo.description}
          </p>
          <button 
              style={{border: "1px solid black", borderRadius: '5px'}} 
              onClick={() => handleAddToWishlist(book)}>
                Add to wishlist
          </button>
        </div>
      ))}
    </div>
  );
};

export default SearchPage;