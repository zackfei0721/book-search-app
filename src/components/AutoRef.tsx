import React from 'react';

const AutoCompleteDropdown: React.FC<{
  autoCompleteBooks: any[],
  setQuery: (query: string) => void,
  setDisplayAutoComplete: (display: boolean) => void
}> = React.memo(({autoCompleteBooks, setQuery, setDisplayAutoComplete}) => {
  return (
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
            padding: "10px",
            cursor: "pointer",
          }}
        >
          {book.volumeInfo.title}
        </div>
      ))}
    </div>
  );
});

export default AutoCompleteDropdown;