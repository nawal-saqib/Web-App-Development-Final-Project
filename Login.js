import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [statusMessage, setStatusMessage] = useState("");
    const navigate = useNavigate();

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        setStatusMessage("Authenticating...");

        // Post login credentials directly to our new Django JWT endpoint
        fetch("http://127.0.0.1:8000/auth/login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Invalid username or password credentials");
                return res.json();
            })
            .then((data) => {
                // Save both the access token and the raw username in local storage
                localStorage.setItem("token", data.access);
                localStorage.setItem("username", data.username); // <-- ADD THIS
                setStatusMessage("Login successful! Redirecting...");
                
                setTimeout(() => {
                    navigate("/");
                }, 1000);
            })
            .catch((err) => {
                setStatusMessage(err.message);
            });
    };

    return (
        <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#282D35', color: 'white' }}>
            <div style={{ backgroundColor: '#21222A', padding: '40px', borderRadius: '8px', width: '100%', maxWIdth: '360px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                <h2 style={{ margin: '0 0 20px 0', textAlign: 'center', color: '#fff' }}>Sign In</h2>
                
                <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontSize: '14px', color: '#aaa' }}>Username</label>
                        <input 
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #373945', backgroundColor: '#282D35', color: 'white' }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontSize: '14px', color: '#aaa' }}>Password</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #373945', backgroundColor: '#282D35', color: 'white' }}
                        />
                    </div>

                    <button type="submit" style={{ padding: '12px', borderRadius: '4px', border: 'none', backgroundColor: '#61DAFB', color: '#282D35', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
                        Login
                    </button>
                </form>

                {statusMessage && (
                    <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px', color: statusMessage.includes("successful") ? '#4BB543' : '#FF9494' }}>
                        {statusMessage}
                    </p>
                )}

                <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
                    <Link to="/" style={{ color: '#61DAFB', textDecoration: 'none' }}>← Back to Dashboard</Link>
                </div>
            </div>
        </main>
    );
}