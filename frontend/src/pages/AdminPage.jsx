import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function AdminPage() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {user && <p>Welcome, {user.name} (Role: {user.role})</p>}
    </div>
  );
}

export default AdminPage;
