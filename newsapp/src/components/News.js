
import React, { useEffect, useState } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';

const News = (props) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageNo, setPageNo] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const updateNews = async (page = 1) => {
    props.setProgress(10);
    setLoading(true);
    let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
    try {
      let data = await fetch(url);
      props.setProgress(30);
      let parsedData = await data.json();
      props.setProgress(70);
      setArticles(parsedData.articles || []);
      setTotalResults(parsedData.totalResults || 0);
      setLoading(false);
      props.setProgress(100);
    } catch (error) {
      console.error("API fetch error:", error);
      setLoading(false);
    }
  };

useEffect(() => {
  document.title = `${capitalizeFirstLetter(props.category)} - NewsMonkey`;
  updateNews(pageNo);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [pageNo]);


  const fetchMoreData = async () => {
    const nextPage = pageNo + 1;
    setPageNo(nextPage);

    let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${nextPage}&pageSize=${props.pageSize}`;
    try {
      let data = await fetch(url);
      let parsedData = await data.json();
      setArticles(articles.concat(parsedData.articles || []));
      setTotalResults(parsedData.totalResults || totalResults);
    } catch (error) {
      console.error("InfiniteScroll fetch error:", error);
    }
  };

  return (
    <div className="container my-3">
      <h1 className="text-center" style={{ margin: "35px 0px", marginTop: '90px' }}>
        NewsMonkey - Top {capitalizeFirstLetter(props.category)} Headlines
      </h1>

      {loading && <Spinner />}

      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length < totalResults}
        loader={<Spinner />}
        style={{ overflow: "hidden" }}
      >
        <div className="row">
          {articles.map((element) => (
            <div className="col-md-4" key={element.url}>
              <NewsItem
                title={element.title ? element.title.slice(0, 45) : "No Title"}
                description={element.description ? element.description.slice(0, 88) : "No Description"}
                imageUrl={element.urlToImage ? element.urlToImage : "https://via.placeholder.com/150"}
                newsUrl={element.url}
                author={element.author ? element.author : "Unknown"}
                date={element.publishedAt}
                source={element.source?.name || "Unknown"}
              />
            </div>
          ))}
        </div>
      </InfiniteScroll>

      {!loading && articles.length === 0 && (
        <p className="text-center">
          No news available for {props.category} in {props.country}.
        </p>
      )}
    </div>
  );
};

News.defaultProps = {
  country: 'us',
  pageSize: 5,
  category: 'general'
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
  apiKey: PropTypes.string.isRequired,
  setProgress: PropTypes.func.isRequired
};

export default News;