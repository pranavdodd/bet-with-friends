import React, { useState } from "react";
import { doc, updateDoc, getDocs, collection, query, where } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function AddFriend() {
  const [username, setUsername] = useState("");

  const onAdd = async () => {
    const q = query(collection(db, "users"), where("username", "==", username));
    const snap = await getDocs(q);
    if (snap.empty) return alert("No such user");
    const friend = snap.docs[0].data();
    const meRef    = doc(db, "users", auth.currentUser.uid);
    const themRef  = doc(db, "users", friend.uid);
    await updateDoc(meRef,   { friends: [...auth.currentUser.friends || [], friend.uid] });
    await updateDoc(themRef, { friends: [...friend.friends, auth.currentUser.uid] });
    setUsername("");
  };

  return (
    <div>
      <h4>Add Friend</h4>
      <input
        placeholder="Friend’s username"
        value={username}
        onChange={e=>setUsername(e.target.value)}
      />
      <button onClick={onAdd}>Add</button>
    </div>
  );
}
