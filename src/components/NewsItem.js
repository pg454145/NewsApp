
import React from 'react';
const NewsItem = (props) => {
  let { title, description, imageUrl, newsUrl, author, date } = props;
  return (
    <div className="card my-3 position-relative">
      <img
        src={imageUrl ? imageUrl : "https://via.placeholder.com/150"}
        className="card-img-top"
        alt="news"
      />
      <div className="card-body">
        <h5 className="card-title">
          {title ? title : "No Title Available"} 
          <span className="badge rounded-pill bg-success">New</span>
        </h5>
        <p className="card-text">
          {description ? description : "No Description Available"}
        </p>
        <p className="card-text">
          <small className="text-muted">
            By {author ? author : "Unknown"} on {new Date(date).toGMTString()}
          </small>
        </p>
        <a 
          href={newsUrl} 
          target="_blank" 
          rel="noreferrer" 
          className="btn btn-sm btn-dark"
        >
          Read More
        </a>
      </div>
    </div>
  );
};

export default NewsItem;