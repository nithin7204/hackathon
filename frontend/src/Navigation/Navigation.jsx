import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import "./Navbar.css";  // Import the CSS file

export default function Navigation() {
    const { user, logout } = useContext(AuthContext);

    return (
        <div className="navbar">
            <Link to="/">
                <button>Home</button>
            </Link>
            {
                user ? (
                    <>
                        <Link onClick={logout}>
                            <button>Logout</button>
                        </Link>
                    </>
                ) : (
                    <>
                        <Link to="/register">
                            <button>Register</button>
                        </Link>
                        <Link to="/login">
                            <button>Login</button>
                        </Link>
                    </>
                )
            }
        </div>
    );
}
