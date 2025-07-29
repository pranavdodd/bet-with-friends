import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail]         = useState("");
  const [pass, setPass]           = useState("");
  const [userName, setUserName]   = useState("");
  const nav = useNavigate();

  const onSubmit = async e => {
    e.preventDefault();
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(res.user, { displayName: userName });
    await setDoc(doc(db, "users", res.user.uid), {
      uid: res.user.uid,
      username: userName,
      tokens: 1000,
      friends: [],
    });
    nav("/");
  };

  return (
    <div className="form-container">
      <h2>🎲 Bet With Friends</h2>
      <form onSubmit={onSubmit}>
        <input
          placeholder="Username"
          value={userName}
          onChange={e => setUserName(e.target.value)}
          required
        />
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          placeholder="Password"
          type="password"
          value={pass}
          onChange={e => setPass(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}
