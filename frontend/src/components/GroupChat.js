import React, { useEffect, useState } from "react";
import {
  collection, query, orderBy,
  addDoc, serverTimestamp, doc, updateDoc
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { onSnapshot } from "firebase/firestore";

export default function GroupChat({ groupId }) {
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");
  const [bet, setBet]   = useState("");

  useEffect(() => {
    const q = query(
      collection(db, "groups", groupId, "messages"),
      orderBy("createdAt")
    );
    return onSnapshot(q, snap =>
      setMsgs(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    );
  }, [groupId]);

  const send = async () => {
    const uid = auth.currentUser.uid;
    // deduct tokens if betting
    if (bet) {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, { tokens: serverTimestamp() }); // implement deduction logic
    }
    await addDoc(collection(db, "groups", groupId, "messages"), {
      text,
      bet: bet ? Number(bet) : 0,
      uid,
      displayName: auth.currentUser.displayName,
      createdAt: serverTimestamp()
    });
    setText(""); setBet("");
  };

  return (
    <div>
      <div style={{ height: 300, overflowY: "scroll" }}>
        {msgs.map(m => (
          <div key={m.id}>
            <strong>{m.displayName}</strong>: {m.text}
            {m.bet > 0 && <span> 💰 {m.bet}</span>}
          </div>
        ))}
      </div>
      <input
        placeholder="Message"
        value={text}
        onChange={e=>setText(e.target.value)}
      />
      <input
        placeholder="Bet?"
        type="number"
        value={bet}
        onChange={e=>setBet(e.target.value)}
      />
      <button onClick={send}>Send</button>
    </div>
  );
}
