export type Article = {
  title: string;
  author: string;
  published_date: string;
  published_date_precision: string;
  link: string;
  clean_url: string;
  summary: string;
  rights: string;
  rank: number;
  topic: string;
  country: string;
  language: string;
  authors: string[];
  media: string;
  is_opinion: boolean;
  twitter_account: string;
  _score: number;
  _id: string;
};

export type UserInput = {
  q: string;
  lang: string;
  from: string;
  sort_by: string;
  page: number;
  size: number;
};

export type News = {
  status: string;
  total_hits: number;
  page: number;
  total_pages: number;
  page_size: number;
  articles: Article[];
  user_input: UserInput;
};

export type Sentiment = {
  text: string;
  totalLines: number;
  pos: number;
  neg: number;
  mid: number;
  pos_percent: string;
  neg_percent: string;
  mid_percent: string;
  lang: string;
};
