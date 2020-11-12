import React from 'react';
import { Route } from 'react-router-dom';
import AddBookmark from './AddBookmark/AddBookmark';
import BookmarkList from './BookmarkList/BookmarkList';
import EditBookmark from './EditBookmark/EditBookmark';
import BookmarksContext from './BookmarksContext';
import Nav from './Nav/Nav';
import config from './config';
import './App.css';

class App extends React.Component {
  state = {
    bookmarks: [],
    error: null,
  };

  setBookmarks = bookmarks => {
    this.setState({
      bookmarks,
      error: null,
    })
  }

  addBookmark = (bookmark) => {
    this.setState({
      bookmarks: [ ...this.state.bookmarks, bookmark ],
    })
  }

  deleteBookmark = (bookmarkId) => {
    const newBookmarks = this.state.bookmarks.filter((bm) => bm.id !== bookmarkId);
    this.setState({
      bookmarks: newBookmarks,
    })
  }

  //"for each bookmark in state.bookmarks, if its id DOES NOT match the updated bookmark, then just stick it into the new array, if it DOES match, then replace with the updatedBookmark."
  //then at the end, 'map' will return a new array, that now contains the updated bookmark.

  //it will just be a bookmark object, and that code will replace the previous version in state.bookmarks with the updated version

  updateBookmark = (updatedBookmark) => {
    this.setState({
      bookmarks: this.state.bookmarks.map(bm => bm.id !== updatedBookmark.id ? bm : updatedBookmark)
    })
  }
  
  componentDidMount() {
    fetch(config.API_ENDPOINT, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(res.status)
        }
        return res.json()
      })
      .then(this.setBookmarks)
      .catch(error => {
        console.log(error)
        this.setState({ error })
      })
  }

  render() {
    const contextValue = {
      bookmarks: this.state.bookmarks,
      addBookmark: this.addBookmark,
      deleteBookmark: this.deleteBookmark,
      updateBookmark: this.updateBookmark,
    }
    return (
      <main className='App'>
        <h1>Bookmarks!</h1>
        <BookmarksContext.Provider value={contextValue}>
          <Nav />
          <div className='content' aria-live='polite'>
            <Route
              exact path="/"
              component={BookmarkList}
            />
            <Route 
              path="/add-bookmark"
              component={AddBookmark}
            />
            <Route 
              path="/edit/:bookmarkId"
              component={EditBookmark}
            />
          </div>
        </BookmarksContext.Provider>
      </main>
    );
  }
}

export default App;
