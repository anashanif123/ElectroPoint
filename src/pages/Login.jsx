import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { auth } from "../utils/utils.js";
import { Link, useNavigate } from "react-router-dom";

function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function onSubmit(e) {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        // Check if the user is admin
        if (user.email === "admin@gmail.com") {
          navigate("/AdminPanel"); // Navigate to admin panel
        } else {
          navigate("/"); // Navigate to normal user dashboard
        }

        console.log("Login successful");
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.error(errorMessage);
      });
  }

  function handleSigninWithGoogle() {
    const provider = new GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;

        // Check if the user is admin
        if (user.email === "admin@gmail.com") {
          navigate("/AdminPanel"); 
        } else {
          navigate("/"); 
        }
      })
      .catch((error) => {
        const errorMessage = error.message;
        alert(errorMessage);
      });
  }

  return (
    <>
       <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-slate-400 to-blue-600 p-6">
      <h1 className="text-5xl font-bold text-center mb-8 text-white">
        Log In
      </h1>
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <form onSubmit={onSubmit} className="flex flex-col space-y-5">
          <input
            value={email}
            type="email"
            placeholder="Email"
            required
            className="p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            value={password}
            type="password"
            placeholder="Password"
            required
            className="p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="text-white bg-blue-600 p-4 rounded-lg transition duration-200 hover:bg-blue-700"
          >
            Log In
          </button>
        </form>
        <div className="flex items-center justify-center my-4">
          <span className="text-gray-600">or</span>
        </div>
        <button
          onClick={handleSigninWithGoogle}
          className="text-white bg-blue-600 p-4 rounded-lg transition duration-200 hover:bg-blue-700 w-full"
        >
          Sign In With Google
        </button>
        <div className="text-center mt-6">
          Don't have an account?{" "}
          <Link className="underline text-blue-600" to="/signup">
            Sign Up
          </Link>
        </div>
      </div>

      {/* Admin credentials section */}
      <div className="mt-8 bg-white p-4 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold">Admin Credentials:</h2>
        <p>
          Email: <span className="font-bold">admin@gmail.com</span>
        </p>
        <p>
          Password: <span className="font-bold">123456</span>
        </p>
      </div>
    </div>
    </>
  );
}

export default LoginForm;
