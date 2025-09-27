import axios from "axios";
import type { Movie } from "../types/movie";

interface MovieHttpResponse {
  results: Movie[];
  totalPages: number;
};

export const fetchMovies =  async (query: string, page: number): Promise<MovieHttpResponse> => {    
      const API_KEY = import.meta.env.VITE_API_KEY;

      const options = {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${API_KEY}`
        },
        params: {
          query: query,
          include_adult: false,
          language: 'en-US',
          page: page
        }
      }

      const response = await axios.get<MovieHttpResponse>(
        `https://api.themoviedb.org/3/search/movie`,
        options
      );      

      return ({
        results: response.data.results,
        totalPages: response.data.total_pages
      })
}