import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Rating from '../Rating/Rating';
import BookmarksContext from '../BookmarksContext';
import config from '../config';
import './BookmarkItem.css';

function deleteBookmarkRequest(bookmarkId, cb) {
  fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer ${config.API_KEY}`
    }
  })
    .then(res => {
      if (!res.ok) {
        return res.json().then(error => Promise.reject(error))
      }
      return res.json()
    })
    .then(data => {
      cb(bookmarkId) //executing the callback delete method from context passing in this.props.id
    })
    .catch(error => {
      console.error(error)
    })
}

class BookmarkItem extends React.Component {
  static contextType = BookmarksContext;

  render(){
    return (
      <li className='BookmarkItem'>
        <div className='BookmarkItem__row'>
          <h3 className='BookmarkItem__title'>
            <a
              href={this.props.url}
              target='_blank'
              rel='noopener noreferrer'>
              {this.props.title}
            </a>
          </h3>
          <Rating value={this.props.rating} />
        </div>
        <p className='BookmarkItem__description'>
          {this.props.description}
        </p>
        <div className='BookmarkItem__buttons'>
          <Link to={`/edit/${this.props.id}`}>
            Edit
          </Link>
          {' '}
          <button
            className='BookmarkItem__description'
            onClick={() => deleteBookmarkRequest(this.props.id, this.context.deleteBookmark)}
          >
            Delete
          </button>
        </div>
      </li>
    )
  }
}

export default BookmarkItem;



