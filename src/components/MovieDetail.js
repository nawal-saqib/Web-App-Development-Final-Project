import React, { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"

export default function MovieDetail() {
    const { id } = useParams()
    const [movie, setMovie] = useState(null)
    const [recommendations, setRecommendations] = useState([])
    const [userRating, setUserRating] = useState(0)
    const [ratingStatus, setRatingStatus] = useState("")
    const [error, setError] = useState(null)

    useEffect(() => {
        // 1. Instantly reset the UI star state memory when switching to a new movie id
        setUserRating(0);
        setRatingStatus("");

        const savedToken = localStorage.getItem("token");

        // 2. Fetch primary movie details
        fetch(`http://127.0.0.1:8000/movies/`)
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch movie details")
                return res.json()
            })
            .then(data => {
                const selectedMovie = data.find(m => m.id === parseInt(id))
                setMovie(selectedMovie)
            })
            .catch(err => setError(err.message))

        // 3. Fetch this specific logged-in user's previous rating record
        // Inside your useEffect block (Fetch this specific logged-in user's previous rating)
        fetch(`http://127.0.0.1:8000/movies/${id}/my-rating/`, {
            headers: {
                "Authorization": savedToken ? `Bearer ${savedToken}` : "",
            }
        })
            .then(res => {
                if (res.status === 401 || res.status === 403) {
                    // Token is dead! Flush it.
                    localStorage.removeItem("token");
                    localStorage.removeItem("username");
                    setUserRating(0);
                    return null;
                }
                return res.json();
            })
            .then(data => {
                if (data && data.rating) {
                    setUserRating(data.rating);
                }
            })
            .catch(err => console.error("Error loading user rating:", err));

        // 4. Fetch Hybrid AI recommendations
        fetch(`http://127.0.0.1:8000/movies/${id}/recommendations/`)
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch hybrid recommendations")
                return res.json()
            })
            .then(data => setRecommendations(data))
            .catch(err => console.error("Recs error:", err))
            
    }, [id]) // <-- Telling React to rerun this entire script whenever the URL ID parameter changes

    // Handle sending ratings to Django database
    const handleRatingSubmit = (score) => {
        setUserRating(score)
        setRatingStatus("Saving...")

        // Pull the access token string out of local storage state
        const savedToken = localStorage.getItem("token");

        fetch(`http://127.0.0.1:8000/ratings/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // Attach JWT token to the Authorization Header string context
                "Authorization": savedToken ? `Bearer ${savedToken}` : "",
            },
            body: JSON.stringify({
                movie: parseInt(id),
                rating: score
            })
        })
        .then(res => {
            if (res.ok) {
                setRatingStatus("Rating saved successfully!")
                return fetch(`http://127.0.0.1:8000/movies/${id}/recommendations/`)
            } else if (res.status === 401 || res.status === 403) {
                // --- FIX: Flush the dead session strings immediately ---
                localStorage.removeItem("token");
                localStorage.removeItem("username");
                
                throw new Error("Your session has expired. Please sign in again.");
            } else {
                throw new Error("Unable to save rating profile.");
            }
        })
        .then(res => res && res.json())
        .then(data => data && setRecommendations(data))
        .catch(err => setRatingStatus(err.message))
    }

    if (error) return <div style={{ color: "red", padding: "20px" }}>Error: {error}</div>
    if (!movie) return <div style={{ color: "white", padding: "20px" }}>Loading details...</div>

    return (
        <main style={{ padding: '57px 27px', backgroundColor: '#282D35', minHeight: '100vh', color: 'white' }}>
            <Link to="/" style={{ color: '#61DAFB', textDecoration: 'none', fontWeight: 600 }}>← Back to Dashboard</Link>
            
            <div style={{ backgroundColor: '#21222A', padding: '40px', borderRadius: '8px', marginTop: '20px' }}>
                <h1 style={{ margin: '0 0 10px 0', color: '#fff' }}>{movie.title}</h1>
                <span style={{ fontSize: '12px', backgroundColor: '#373945', padding: '6px 12px', borderRadius: '4px', color: '#61DAFB', fontWeight: 600 }}>
                    {movie.genres}
                </span>
                <p style={{ fontSize: '16px', color: '#DEEBF8', marginTop: '25px', lineHeight: '24px' }}>{movie.description}</p>

                {/* Star Interactive Feedback Area */}
                <div style={{ marginTop: '30px', borderTop: '1px solid #373945', paddingTop: '20px' }}>
                    <h4 style={{ margin: '0 0 10px 0' }}>Rate This Movie:</h4>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                onClick={() => handleRatingSubmit(star)}
                                style={{
                                    fontSize: '28px',
                                    cursor: 'pointer',
                                    color: star <= userRating ? '#FFD700' : '#4E515A',
                                    transition: 'color 0.2s'
                                }}
                            >
                                ★
                            </span>
                        ))}
                        {ratingStatus && <span style={{ marginLeft: '15px', fontSize: '14px', color: '#61DAFB' }}>{ratingStatus}</span>}
                    </div>
                </div>
            </div>

            {/* Hybrid AI Recommendations Slider Panel */}
            <div style={{ marginTop: '40px' }}>
                <h3 style={{ borderBottom: '2px solid #373945', paddingBottom: '10px' }}>More Movies Like This (AI Hybrid Recommendations)</h3>
                
                {!Array.isArray(recommendations) || recommendations.length === 0 ? (
                    <p style={{ color: '#aaa', fontStyle: 'italic' }}>
                        No recommendations found or data structure is invalid.
                    </p>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px', marginTop: '20px' }}>
                        {recommendations.map(rec => (
                            <div key={rec.id} style={{ backgroundColor: '#21222A', padding: '20px', borderRadius: '6px', borderTop: '4px solid #61DAFB' }}>
                                <Link to={`/movie/${rec.id}`} style={{ textDecoration: 'none' }}>
                                    <h4 style={{ margin: '0 0 8px 0', color: '#61DAFB' }}>{rec.title}</h4>
                                </Link>
                                <span style={{ fontSize: '10px', backgroundColor: '#373945', padding: '4px 8px', borderRadius: '4px', color: '#fff' }}>
                                    {rec.genres}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    )
}