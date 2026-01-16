const fetch = require("node-fetch");

exports.handler = async function (event, context) {
    const apiKey = process.env.REACT_APP_NEWS_API_KEY;
    const { country = "in", category = "general", page = 1, pageSize = 5 } = event.queryStringParameters;

    const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}&page=${page}&pageSize=${pageSize}`;

    try {
        const response = await fetch(url, {
            headers: { 'User-Agent': 'NewsApp' } // Ye zaroori hai
        });

        const data = await response.json();

        if (response.ok) {
            return {
                statusCode: 200,
                body: JSON.stringify(data),
            };
        } else {
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: "API Error", details: data }),
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to fetch news", details: error.toString() }),
        };
    }
};

