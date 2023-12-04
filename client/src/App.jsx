import { useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import * as authService from './services/authService';
import * as favouriteService from './services/favouriteService';

import MovieList from './components/movie-list/MovieList';
import MovieCreate from './components/movie-create/MovieCreate';
import Layout from './components/layout/Layout';
import Login from './components/login/Login';
import Register from './components/register/Register';
import AuthContext from './contexts/authContext';
import Logout from './components/logout/Logout';
import MovieDetails from './components/movie-details/MovieDetails';
import MovieEdit from './components/movie-edit/MovieEdit';
import PageNotFound from './components/page-not-found/PageNotFound';
import FavouriteMovieDetails from './components/movie-details/FavouriteMovieDetails';


function App() {
  // TODO check if you need a different state for every modal
  const [showModal, setShowModal] = useState(false);
  const [auth, setAuth] = useState({});
  const [favourites, setFavourites] = useState([]);
  const navigate = useNavigate();

  const loginSubmitHandler = async (values) => {
    const result = await authService.login(values.email, values.password);

    // Catch the error!!!
    console.log(result);
    setAuth(result);
    localStorage.setItem('accessToken', result.accessToken);
    navigate('/movies');
  }

  const registerSubmitHandler = async (values) => {
    const result = await authService.register(values.email, values.password);

    // Validate if password == confirmPassword!!!

    setAuth(result);
    localStorage.setItem('accessToken', result.accessToken);
    navigate('/movies');
  }

  const logoutHandler = () => {
    setAuth({});
    localStorage.removeItem('accessToken');
  }

  const onClickOpen = () => {
    setShowModal(true);
  };

  const onClickClose = () => {
    setShowModal(false);
  };

  const addFavouriteMovie = (movie) => {
    if (auth._id) {
      movie.isFavouredBy = auth._id;
      const newFavouriteList = [...favourites, movie];
      setFavourites(newFavouriteList);
      console.log(favourites);
      favouriteService.create(movie);
    } else {
      navigate('/login');
    }

  }

  const values = {
    loginSubmitHandler,
    registerSubmitHandler,
    logoutHandler,
    onClickOpen,
    onClickClose,
    showModal,
    ownerId: auth._id,
    isAuthenticated: !!auth.accessToken,
    addFavouriteMovie,
    favourites
  }

  return (
    <AuthContext.Provider value={values}>
      <>
        <Routes>
          <Route path='/' element={<Layout onClickOpen={onClickOpen} />}>
            <Route path='movies' element={<MovieList />} />
            <Route path='movies/create' element={<MovieCreate />} />
            <Route path='login' element={<Login />} />
            <Route path='register' element={<Register />} />
            <Route path='logout' element={<Logout />} />
            <Route path='/movies/:id' element={<MovieDetails />} />
            <Route path='/favourites/:id' element={<FavouriteMovieDetails />} />
            <Route path='/movies/:id/edit' element={<MovieEdit />} />
          </Route>
          <Route path='*' element={<PageNotFound />} />

        </Routes>
      </>
    </AuthContext.Provider>
  )
}

export default App
