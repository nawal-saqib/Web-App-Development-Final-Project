import React from "react"

export default function Navbar() {
    return (
        <nav style={{ display: 'flex', alignItems: 'center', backgroundColor: '#21222A', height: '90px', padding: '0 25px', color: 'white' }}>
            <h3 style={{ margin: 0, marginRight: 'auto', color: '#61DAFB', fontSize: '22px', fontWeight: 700 }}>🎬 MovieRec AI</h3>
            <h4 style={{ margin: 0, color: '#DEEBF8', fontWeight: 600 }}>Web App Project</h4>
        </nav>
    )
}