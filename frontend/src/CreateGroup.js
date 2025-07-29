import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function CreateGroup() {
  const [name, setName] = useState("");
  const onCreate = async () => {
    await addDoc(collection(db, "groups"), {
      name,
      members: [auth.currentUser.uid],
      createdAt: new Date()
    });
    setName("");
  };

  return (
    <div>
      <h4>New Group</h4>
      <input
        placeholder="Group name"
        value={name}
        onChange={e=>setName(e.target.value)}
      />
      <button onClick={onCreate}>Create</button>
    </div>
  );
}
