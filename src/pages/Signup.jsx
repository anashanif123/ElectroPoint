import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../utils/utils.js";

function SignUp() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const userDocRef = doc(db, "users", user.uid);
        setDoc(userDocRef, {
          username: username,
          email: email,
          createdAt: new Date(),
        })
          .then(() => {
            console.log("User data saved to Firestore");
            navigate("/");
          })
          .catch((error) => {
            console.error("Error saving user data: ", error);
          });
      })
      .catch((error) => {
        console.error(error.code, error.message);
      });
  }

  function handleSubmitWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        const userDocRef = doc(db, "users", user.uid);
        setDoc(userDocRef, {
          username: user.displayName,
          email: user.email,
          createdAt: new Date(),
        }, { merge: true })
          .then(() => {
            console.log("Google user data saved to Firestore");
            navigate("/");
          })
          .catch((error) => {
            console.error("Error saving Google user data: ", error);
          });
      })
      .catch((error) => {
        alert(error.message);
      });
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-slate-400 to-blue-600 p-6">
      <h1 className="text-4xl font-bold text-white text-center mb-6">Sign Up</h1>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <form onSubmit={onSubmit} className="flex flex-col space-y-4">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="Username"
            required
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
          <input
            value={email}
            type="email"
            placeholder="Email"
            required
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            value={password}
            type="password"
            placeholder="Password"
            required
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="text-white p-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition duration-300"
          >
            Sign Up
          </button>
        </form>
        <div className="flex items-center justify-center my-4">
          <span className="text-gray-600">or</span>
        </div>
        <button
          onClick={handleSubmitWithGoogle}
          className="text-white p-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition duration-300 w-full"
        >
          Sign Up With Google
        </button>
        <p className="text-sm text-gray-600 text-center mt-4">
          Already have an account? <Link className="text-blue-600 underline" to="/login">Log In</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
