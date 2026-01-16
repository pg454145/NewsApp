import React, { useEffect, useState, useCallback } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';

const News = (props) => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageNo, setPageNo] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [error, setError] = useState(null);

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    // --- Proxy Fetch Logic ---
    const updateNews = useCallback(async (page = 1) => {
        props.setProgress(10);
        setLoading(true);
        setError(null);

        // Asli URL
        const targetUrl = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;

        // AllOrigins Proxy URL
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;

        try {
            let response = await fetch(proxyUrl);
            props.setProgress(30);

            let data = await response.json();
            // Sabse zaroori: contents ko parse karna kyunki proxy data ko string bana deti hai
            let parsedData = JSON.parse(data.contents);

            props.setProgress(70);

            if (parsedData.status === "error") {
                setError(parsedData.message);
                setArticles([]);
            } else {
                setArticles(parsedData.articles || []);
                setTotalResults(parsedData.totalResults || 0);
            }

            setLoading(false);
            props.setProgress(100);
        } catch (error) {
            console.error("Fetch error:", error);
            setError("Failed to fetch news. Please check your connection or API key.");
            setLoading(false);
        }
    }, [props]);

    useEffect(() => {
        document.title = `${capitalizeFirstLetter(props.category)} - NewsMonkey`;
        updateNews(pageNo);
        // eslint-disable-next-line
    }, []);

    const fetchMoreData = async () => {
        const nextPage = pageNo + 1;
        setPageNo(nextPage);

        const targetUrl = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${nextPage}&pageSize=${props.pageSize}`;
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;

        try {
            let response = await fetch(proxyUrl);
            let data = await response.json();
            let parsedData = JSON.parse(data.contents);

            setArticles(articles.concat(parsedData.articles || []));
            setTotalResults(parsedData.totalResults || 0);
        } catch (error) {
            console.error("InfiniteScroll error:", error);
        }
    };

    return (
        <div className="container my-3">
            <h1 className="text-center" style={{ margin: "35px 0px", marginTop: '20px' }}>
                NewsMonkey - Top {capitalizeFirstLetter(props.category)} Headlines
            </h1>

            {loading && <Spinner />}

            {error && <p className="text-center text-danger">{error}</p>}

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
                                author={element.author || "Unknown"}
                                date={element.publishedAt}
                                source={element.source?.name || "Unknown"}
                            />
                        </div>
                    ))}
                </div>
            </InfiniteScroll>
        </div>
    );
};

News.defaultProps = {
    country: 'in',
    pageSize: 8,
    category: 'general'
};

News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
    apiKey: PropTypes.string,
    setProgress: PropTypes.func.isRequired
};

export default News;