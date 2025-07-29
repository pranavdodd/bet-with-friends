import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass]   = useState("");
  const nav = useNavigate();

  const onSubmit = async e => {
    e.preventDefault();
    await signInWithEmailAndPassword(auth, email, pass);
    nav("/");
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>Log In</h2>
      <input placeholder="Email"    value={email}
        onChange={e => setEmail(e.target.value)} required />
      <input placeholder="Password" type="password" value={pass}
        onChange={e => setPass(e.target.value)} required />
      <button type="submit">Log In</button>
    </form>
  );
}
