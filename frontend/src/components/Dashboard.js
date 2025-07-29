import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { auth, db } from "../firebase";
import AddFriend     from "./AddFriend";
import CreateGroup   from "./CreateGroup";
import GroupChat     from "./GroupChat";
import Leaderboard   from "./Leaderboard";

export default function Dashboard() {
  const uid = auth.currentUser.uid;
  const [groups, setGroups] = useState([]);
  const [activeGroup, setActiveGroup] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "groups"), where("members", "array-contains", uid));
    return onSnapshot(q, snap => {
      setGroups(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, [uid]);

  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: 250, padding: 20 }}>
        <h3>Groups</h3>
        {groups.map(g => (
          <div
            key={g.id}
            style={{ cursor: "pointer", margin: 5, fontWeight: activeGroup === g.id ? "bold" : "normal" }}
            onClick={()=>setActiveGroup(g.id)}
          >{g.name}</div>
        ))}
        <AddFriend />
        <CreateGroup />
      </div>
      <div style={{ flex: 1, padding: 20 }}>
        {activeGroup
          ? <>
              <GroupChat groupId={activeGroup} />
              <Leaderboard groupId={activeGroup} />
            </>
          : <div>Select or create a group</div>
        }
      </div>
    </div>
  );
}
