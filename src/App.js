import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import MovieList from "./components/MovieList";
import MovieDetail from "./components/MovieDetail";
import Login from "./components/Login";

export default function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation(); // Tracks page changes to check token status

    // Check if user session is active every time the app loads or the route changes
    useEffect(() => {
        const savedUsername = localStorage.getItem("username");
        if (savedUsername) {
            setCurrentUser(savedUsername);
        } else {
            setCurrentUser(null);
        }
    }, [location]); // Triggers a re-check automatically on every page switch!

    const handleLogOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        setCurrentUser(null);
        navigate("/login");
    };

    return (
        <div style={{ backgroundColor: "#282D35", minHeight: "100vh", color: "white" }}>
            
            {/* --- GLOBAL PERSISTENT NAVIGATION BAR --- */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 30px', backgroundColor: '#21222A', borderBottom: '1px solid #373945', position: 'sticky', top: 0, zIndex: 1000 }}>
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <h2 style={{ margin: 0, color: '#61DAFB' }}>AI Movie Matrix</h2>
                </Link>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    {currentUser ? (
                        <>
                            <span style={{ fontSize: '15px', color: '#fff' }}>
                                Welcome, <strong style={{ color: '#61DAFB' }}>{currentUser}</strong>!
                            </span>
                            <button 
                                onClick={handleLogOut}
                                style={{ padding: '8px 16px', border: '1px solid #FF9494', backgroundColor: 'transparent', color: '#FF9494', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                Log Out
                            </button>
                        </>
                    ) : (
                        <Link 
                            to="/login" 
                            style={{ padding: '8px 16px', backgroundColor: '#61DAFB', color: '#282D35', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' }}
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            </header>

            {/* --- DYNAMIC ROUTE VIEWS --- */}
            <Routes>
                <Route path="/" element={<MovieList />} />
                <Route path="/movie/:id" element={<MovieDetail />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </div>
    );
}