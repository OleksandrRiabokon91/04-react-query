import axios from "axios";
import type { Movie } from "../types/movie";

const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export default async function fetchMovies(
  query: string,
  page: number = 1
): Promise<MoviesResponse> {
  const baseURL = "https://api.themoviedb.org/3";
  const endPoint = "/search/movie";
  const url = baseURL + endPoint;

  const params = {
    query,
    page,
    include_adult: false,
    language: "en-US",
  };

  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${TOKEN}`,
  };

  const res = await axios.get<MoviesResponse>(url, {
    headers,
    params,
  });

  return res.data;
}
