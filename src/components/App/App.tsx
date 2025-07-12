import css from "./App.module.css";
import "modern-normalize";

import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { toast } from "react-hot-toast";
import ReactPaginate from "react-paginate";

import type { Movie } from "../../types/movie";

import SearchBar from "../SearchBar/SearchBar";
import fetchMovies from "../../services/movieService";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["movies", searchQuery, currentPage],
    queryFn: () => fetchMovies(searchQuery, currentPage),
    enabled: searchQuery !== "",
    placeholderData: keepPreviousData,
  });

  const movies = data?.results || [];
  const totalPages = data?.total_pages || 0;

  const handleQuerySubmit = async (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);

    const result = await refetch();

    if (result.data?.results.length === 0) {
      toast.error("No movies found for your request.");
    }

    if (result.error) {
      toast.error("Something went wrong - try again later");
    }
  };

  return (
    <div className={css.app}>
      <Toaster position="top-center" reverseOrder={false} />

      <SearchBar onSubmit={handleQuerySubmit} />

      {isLoading ? (
        <Loader />
      ) : isError ? (
        <ErrorMessage message={(error as Error).message} />
      ) : movies.length > 0 ? (
        <>
          <MovieGrid
            movies={movies}
            onSelect={(movie) => setSelectedMovie(movie)}
          />

          {totalPages > 1 && (
            <ReactPaginate
              pageCount={totalPages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setCurrentPage(selected + 1)}
              forcePage={currentPage - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}
        </>
      ) : null}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}
