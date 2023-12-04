import styles from './TvShows.module.css'
import AddFavourites from '../../add-favourites/AddFavourites';
import { Link } from 'react-router-dom'
import { useContext } from 'react';
import AuthContext from '../../../contexts/authContext';

export default function TvShows({ tvShows }) {
    const { showModal, onClickOpen, addFavouriteMovie } = useContext(AuthContext);

    return (
        <>
            <h3>TV Shows</h3>
            <div className={styles.containerFluid}>

                <div className={styles.row} >

                    {tvShows.map(movie => (
                        <div className={styles.imageContainer} key={movie._id}>
                           <Link to={`/movies/${movie._id}`} onClick={onClickOpen}><img
                               
                                src={movie.posterUrl}
                                className={styles.rowPoster}
                                alt={movie.name}
                                style={{ width: '11em', height: '100%' }} /></Link>
                            <div onClick={() => addFavouriteMovie(movie)} className={`${styles.overlay} d-flex align-items-center justify-content-center`}><AddFavourites /></div>
                        </div>
                    ))}

                </div>
            </div>
        </>
    );
}