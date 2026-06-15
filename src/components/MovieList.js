import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function MovieList() {
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/movies/")
            .then(response => {
                if (!response.ok) throw new Error("Failed to connect to Django API server");
                return response.json();
            })
            .then(data => setMovies(data))
            .catch(err => setError(err.message));
    }, []);

    return (
        <main style={{ padding: '57px 27px' }}>
            <h1 style={{ margin: '0 0 46px 0', fontSize: '39px', letterSpacing: '-0.05em' }}>Trending Movies</h1>
            
            {error && <p style={{ color: '#ff6b6b' }}>Error: {error}</p>}
            
            {movies.length === 0 && !error && (
                <p>No movies found. Add some records in your Django admin dashboard!</p>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '25px' }}>
                {movies.map(movie => (
                    <div key={movie.id} style={{ backgroundColor: '#21222A', padding: '25px', borderRadius: '8px', borderLeft: '5px solid #61DAFB' }}>
                        <Link to={`/movie/${movie.id}`} style={{ textDecoration: 'none' }}>
                            <h3 style={{ margin: '0 0 12px 0', color: '#61DAFB', cursor: 'pointer' }}>{movie.title}</h3>
                        </Link>
                        <span style={{ fontSize: '11px', backgroundColor: '#373945', padding: '5px 10px', borderRadius: '4px', color: '#fff', fontWeight: 600 }}>
                            {movie.genres}
                        </span>
                        <p style={{ fontSize: '14px', color: '#DEEBF8', marginTop: '15px', lineHeight: '20px' }}>{movie.description}</p>
                    </div>
                ))}
            </div>
        </main>
    );
}