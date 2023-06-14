import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../redux/store';
import { addBook } from '../redux/wishlistSlice';
import Pagination from '@mui/material/Pagination'; // imported MUI for pagination

const SearchPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [query, setQuery] = useState("");
  const [addedBookId, setAddedBookId] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage, setBooksPerPage] = useState(10);
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);
  const [totalResults, setTotalResults] = useState(0);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    console.log(event);
    setCurrentPage(value);
    fetchData();
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchData();
  };

  const fetchData = async () => {
    if (!query) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const startIndex = (currentPage - 1) * booksPerPage;
      const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${process.env.REACT_APP_GOOGLE_BOOKS_API_KEY}&startIndex=${startIndex}&maxResults=${booksPerPage}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('HTTP error ' + response.status);
      const data = await response.json();
      setBooks(data.items);
      setTotalResults(data.totalItems);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(String(error));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToWishlist = (book: any) => {
    dispatch(addBook(book));
    setSuccessMessage(`${book.volumeInfo.title} added to wishlist!`);
    setAddedBookId(book.id);

    // clear the success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage("");
      setAddedBookId(book.id);
    }, 3000);
  };

  if (isLoading) {
    return <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '2rem',
                color: 'black'}
              }>
                Loading...
            </div>
  }

  if (error) return <div>{error}</div>;

  return (
    <div style={{display: 'flex', flexDirection: 'column', }}>
      <h2 style={{textAlign: 'center'}}>Search Page</h2>
      <form style={{textAlign: 'center'}}
            onSubmit={handleSearch}>
        <input 
            type='text' 
            value={query} 
            onChange={handleQueryChange} />
        <button 
            style={{marginLeft: "10px", borderRadius: '5px'}}
            type='submit'>
              Search
        </button>
      </form>
      {books.map((book: any, index: number) => (
        <div key={index} style={{border: "1px solid black", borderRadius: '5px' ,padding: "10px", margin: "10px"}}>
          {addedBookId === book.id && <p style={{color: "green"}}>{successMessage}</p>}
          <h3>
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
      {/*true && console.log(totalResults, booksPerPage)*/}
      <Pagination count={Math.ceil(totalResults / booksPerPage)} page={currentPage} onChange={handlePageChange} />
    </div>
  );
};

export default SearchPage;