// netlify/functions/fetchNews.js

exports.handler = async function(event, context) {
  const apiKey = process.env.REACT_APP_NEWS_API_KEY;

  // Query params from request
  const { country = "in", category = "general", page = 1, pageSize = 5 } = event.queryStringParameters;

  const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}&page=${page}&pageSize=${pageSize}`;

  try {
    
    const response = await fetch(url);
    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch news" }),
    };
  }
};