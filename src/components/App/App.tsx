import { useEffect, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Toaster, toast } from "react-hot-toast";

import css from "./App.module.css";
import "modern-normalize";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Loader from "../Loader/Loader";
import ReactPaginate from "react-paginate";

import fetchMovies from "../../services/movieService";
import type { Movie } from "../../types/movie";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ["movies", searchQuery, currentPage],
    queryFn: () => fetchMovies(searchQuery, currentPage),
    enabled: searchQuery !== "",
    placeholderData: keepPreviousData,
  });

  const movies = data?.results || [];
  const totalPages = data?.total_pages || 0;

  const handleQuerySubmit = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (isSuccess && data && data.results.length === 0) {
      toast.error("No movies found for your request.");
    }

    if (isError && error instanceof Error) {
      toast.error("Something went wrong - try again later");
    }
  }, [isSuccess, isError, data, error]);

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
