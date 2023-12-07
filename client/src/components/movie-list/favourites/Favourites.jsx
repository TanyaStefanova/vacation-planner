import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import styles from './Favourites.module.css'
import RemoveFromFavourites from '../../remove-favourites/RemoveFromFavourites';
import AuthContext from '../../../contexts/authContext';
import * as favouriteService from "../../../services/favouriteService";
import { Button } from 'react-bootstrap';


export default function Favourites() {

    const { onClickOpen, ownerId, favourites } = useContext(AuthContext);
    const [favouriteMovies, setFavouriteMovies] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // TODO test error
    useEffect(() => {
        favouriteService.getAllFavourites(ownerId)
        .then(setFavouriteMovies)
        .catch(error => {
            setError('An error occurred while fetching data. Please try again later.')
        });
    }, [ownerId, favourites]);

    const removeFavouriteHandler = async (movieId, title) => {
   
        const hasConfirmed = confirm(`Are you sure you want to remove ${title} from favourites?`);

        if (hasConfirmed) {
            
            await favouriteService.remove(movieId);
            
            const newFavouriteList = favouriteMovies.filter(
                favourite => favourite._id !== movieId
            );

            setFavouriteMovies(newFavouriteList);

            navigate('/movies/favourites');
        }
    }

    return (
        <>
            <h2>My Favourite Movies</h2>
            {error && <p>{error}</p>}

          
            <div className="container">
            {favouriteMovies.length == 0 && (
                    <h1>No Favourite Movies Added</h1>
                   )}
                {favouriteMovies.map(movie => (
                    <div key={movie._id} style={{marginTop: '20px', backgroundColor:'#212529'}} className="card v4 tight">
                        <div className="wrapper">
                            <div className={styles.image} >
                            <Link to={`/favourites/${movie._id}`} onClick={onClickOpen}>
                                <div style={{float: 'left', width: '10%'}}> 
                                <img style={{ width: '94px', height: '141px' }}
                                src={movie.posterUrl}  alt="movie-poster" /> </div> </Link>
                               
                               
                                <div className={styles.details}>
                                    <div className={styles.title}><h2>{movie.title}</h2>
                                    <div onClick={() => removeFavouriteHandler(movie._id, movie.title)} className={`${styles.overlay} `}><RemoveFromFavourites /></div></div>
                                    <div className={styles.overview}><p>{movie.plot}</p></div>
                            </div>
                                   
                                  {/* <div onClick={() => removeFavouriteHandler(movie._id, movie.title)} className={`${styles.overlay} d-flex align-items-center justify-content-center`}><RemoveFromFavourites /></div> */}
                                </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );

}