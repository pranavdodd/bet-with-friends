import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function App() {
  const [user, loading] = useAuthState(auth);
  if (loading) return <div>Loading...</div>;
  return (
    <Routes>
      <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
      <Route path="/login"  element={!user ? <Login  /> : <Navigate to="/" />} />
      <Route path="/*"       element={user  ? <Dashboard /> : <Navigate to="/login" />} />
    </Routes>
  );
}
