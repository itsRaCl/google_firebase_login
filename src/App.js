// Import required modules
import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const loggedInUser = result.user;
      const idt = await loggedInUser.getIdToken();
      console.log(idt);
      setUser({
        name: loggedInUser.displayName,
        email: loggedInUser.email,
        photo: loggedInUser.photoURL,
      });

      await fetch("http://16.171.39.76/api/v1/users/login/", {
        method: "POST",
        body: JSON.stringify({ id_token: idt }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Firebase Google Login</h1>
      {!user ? (
        <button
          onClick={handleLogin}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#4285F4",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Login with Google
        </button>
      ) : (
        <div style={{ marginTop: "20px" }}>
          <h2>Welcome, {user.name}!</h2>
          <p>Email: {user.email}</p>
          <img
            src={user.photo}
            alt="User Photo"
            style={{ borderRadius: "50%", width: "100px", height: "100px" }}
          />
        </div>
      )}
    </div>
  );
}

export default App;
