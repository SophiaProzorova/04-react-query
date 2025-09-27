import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import ReactPaginate from 'react-paginate';
import SearchBar from '../SearchBar/SearchBar';
import Loader from '../Loader/Loader';
import MovieGrid from "../MovieGrid/MovieGrid";
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';

import { fetchMovies } from "../../services/movieService";
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import type { Movie } from "../../types/movie";

import styles from './App.module.css';

const notifyEmptyResponse = () => toast.error('No movies found for your request.');


function App() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [movieTitle, setMovieTitle] = useState<string>('');
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [isMovieModalOpen, setIsMovieModalOpen] = useState<boolean>(false);

  const onSelectHandler = (movie: Movie) => {
    setSelectedMovieId(movie.id);
    openMovieModal();
  };

  const openMovieModal = () => setIsMovieModalOpen(true);
  const closeMovieModal = () => setIsMovieModalOpen(false);


  const { data, isLoading, isError, isSuccess } = useQuery({
      queryKey: ['movie', currentPage, movieTitle],
      queryFn: () => fetchMovies(movieTitle, currentPage),
      enabled: movieTitle !== '',
      placeholderData: keepPreviousData
  })

  const totalPages = data?.totalPages ?? 0;

  const handleSearch = async (query: string) => {
    setMovieTitle(query);
    setCurrentPage(1);
  };


  useEffect(()=>{
    if (isSuccess && data) {
      setMovieList(data.results);
    }
    else setMovieList([]);    
  }, [isSuccess, data])

  useEffect(()=>{
      if (isSuccess && totalPages === 0) notifyEmptyResponse();
  }, [isSuccess, totalPages])

  useEffect(()=>{
    console.log(movieList);
  })

  return (
    <div className={styles.app}>
      <Toaster position="top-center" reverseOrder={false} />
      <SearchBar onSubmit={handleSearch} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {isSuccess && totalPages > 1 && (
        <ReactPaginate 
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setCurrentPage(selected + 1)}
          forcePage={currentPage - 1}
          containerClassName={styles.pagination}
          activeClassName={styles.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {movieList?.length > 0 && <MovieGrid movies={movieList} onSelect={onSelectHandler} />}
      {isMovieModalOpen && <MovieModal movie={movieList.find((movie) => movie.id === selectedMovieId)} onClose={closeMovieModal}/>}
    </div>
  )
}

export default App
