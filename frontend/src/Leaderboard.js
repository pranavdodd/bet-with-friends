import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function Leaderboard({ groupId }) {
  const [board, setBoard] = useState([]);

  useEffect(() => {
    (async () => {
      const snap = await getDocs(collection(db, "groups", groupId, "messages"));
      // sum bets per user
      const tally = {};
      snap.docs.forEach(d => {
        const { uid, bet } = d.data();
        if (!tally[uid]) tally[uid] = 0;
        tally[uid] += bet;
      });
      // fetch usernames
      const entries = await Promise.all(
        Object.entries(tally).map(async ([uid, total]) => {
          const u = await db.collection("users").doc(uid).get();
          return { name: u.data().username, total };
        })
      );
      setBoard(entries.sort((a,b)=>b.total - a.total));
    })();
  }, [groupId]);

  return (
    <div>
      <h4>Leaderboard</h4>
      {board.map((p,i) => (
        <div key={i}>{p.name}: {p.total} tokens</div>
      ))}
    </div>
  );
}
