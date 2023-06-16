import React, { useEffect, useState, useRef } from 'react';
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
  const [initialTotalResults, setInitialTotalResults] = useState(0); // Prevent total page num from changing when changing page


  // Autocomplete
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const [autoCompleteBooks, setAutoCompleteBooks] = useState([]); // New state for autocomplete books
  const [displayAutoComplete, setDisplayAutoComplete] = useState(false); // New state for display of autocomplete
  const searchRef = useRef<HTMLFormElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (query !== "") fetchAutoCompleteData();
    else setAutoCompleteBooks([]);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setDisplayAutoComplete(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (currentPage !== 1) fetchData();
  }, [currentPage]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
      console.log(event);
      setCurrentPage(value);
    };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setDisplayAutoComplete(true); // Show autocomplete dropdown when typing
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDisplayAutoComplete(false); // Hide autocomplete dropdown when submit
    fetchData();
  };

  const fetchAutoCompleteData = async () => {
    setIsLoading(true);
    try {
      const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&startIndex=0&maxResults=5`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('HTTP error ' + response.status);
      const data = await response.json();
      if (data.items) {
        setAutoCompleteBooks(data.items);
      } else {
        setAutoCompleteBooks([]);
      }
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


  const fetchData = async () => {
    if (!query) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const startIndex = (currentPage - 1) * booksPerPage;
      const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&startIndex=${startIndex}&maxResults=${booksPerPage}`;
      const response = await fetch(url);
      console.log("url: ", url);
      console.log("totalResults: ", totalResults);
      if (!response.ok) throw new Error('HTTP error ' + response.status);
      const data = await response.json();
      if (data.items) {
        setBooks(data.items);
      } else {
        setBooks([]); // Set books to an empty array if no results
      }
      
      if(initialTotalResults === 0) {
        setInitialTotalResults(data.totalItems);
        setTotalResults(data.totalItems);  // Set totalResults here
      }
      else {
        setTotalResults(initialTotalResults); // and here
      }
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
    <div style={{ display: 'flex', flexDirection: 'column' }}>
    <h2 style={{ textAlign: 'center' }}>Search Page</h2>
    <div style={{ position: 'relative', textAlign: 'center' }}>
      <form onSubmit={handleSearch} ref={searchRef}>
        <input 
          type='text' 
          value={query} 
          ref={inputRef}
          onChange={handleQueryChange} 
        />
        <button style={{ marginLeft: "10px", borderRadius: '5px' }} type='submit'>Search</button>
        {displayAutoComplete && autoCompleteBooks.length > 0 && (
          <div 
            style={{ position: "relative", 
                     backgroundColor: 'white', 
                     zIndex: 1, 
                     width: '100%',
                     left: '50%',
                     transform: 'translateX(-50%)' }}>
            {autoCompleteBooks.map((book: any, index: number) => (
              <div
                key={index}
                onClick={() => {
                  setQuery(book.volumeInfo.title);
                  setDisplayAutoComplete(false);
                }}
                style={{
                  background: index === selectedSuggestion ? "#ddd" : undefined,
                  padding: "10px",
                  cursor: "pointer",
                }}
              >
                {book.volumeInfo.title}
              </div>
            ))}
          </div>
        )}
      </form>
    </div>
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
      <Pagination 
        style={{display: 'flex', justifyContent: 'center', margin: '10px'}}
        count={Math.min(Math.ceil(totalResults / booksPerPage), 50)} 
        page={currentPage} 
        onChange={handlePageChange}
       />
    </div>
  );
};

export default SearchPage;