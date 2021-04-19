import express from "express";
import FormData from "form-data";
import morgan from "morgan";
import fetch from "node-fetch";
import path from "path";
import { X_RAPIDAPI_KEY } from "./config";
import { News, Sentiment } from "./types";

export const port = 3002;
export const hostName = "localhost";
export const protocol = "http";
export const url = `${protocol}://${hostName}:${port}`;

const app = express();
app.use(morgan("tiny"));

function processSentiment({ totalLines, pos, mid, neg }: Sentiment) {
  return {
    pos_percent: calculatePercent(pos, totalLines),
    mid_percent: calculatePercent(mid, totalLines),
    neg_percent: calculatePercent(neg, totalLines),
  };
}

function calculatePercent(value: number, totalLines: Sentiment["totalLines"]) {
  return `${((value / totalLines) * 100).toFixed(2)}%`;
}

app.get("/sentimenter", async (req, res) => {
  try {
    const news: News = await (
      await fetch(
        `https://free-news.p.rapidapi.com/v1/search?lang=en&q=${req.query.q}`,
        {
          method: "GET",
          headers: {
            "x-rapidapi-key": X_RAPIDAPI_KEY,
            "x-rapidapi-host": "free-news.p.rapidapi.com",
          },
        }
      )
    ).json();

    const summaryCombined = news.articles
      .map(({ summary }) => summary.trim())
      .join("\n")
      // TODO: find out why sentiment analysis will fail if the payload is too large
      .slice(0, 10000);

    const formData = new FormData();
    formData.append("text", summaryCombined);

    const sentiment: Sentiment = await (
      await fetch("https://text-sentiment.p.rapidapi.com/analyze", {
        method: "POST",
        headers: {
          "x-rapidapi-key": X_RAPIDAPI_KEY,
          "x-rapidapi-host": "text-sentiment.p.rapidapi.com",
        },
        body: formData,
      })
    ).json();

    res.json(processSentiment(sentiment));
  } catch (e) {
    res.status(500).json({ message: `Fail: failed to fetch with error ${e}` });
  }
});

app.use("/", express.static(path.join(__dirname, "../public")));
app.listen(port, () => console.log(`listening on ${url}`));
