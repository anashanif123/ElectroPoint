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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 animate-fade-in">
        <h1
          className="text-4xl font-bold text-center mb-6 text-amber-600 animate-bounce"
          style={{ color: '#b88e2f' }}
        >
          Log In
        </h1>
        <div
          className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md animate-slide-up"
        >
          <form onSubmit={onSubmit} className="flex flex-col space-y-4">
            <input
              value={email}
              type="email"
              placeholder="Email"
              required
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition duration-300 ease-in-out"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              value={password}
              type="password"
              placeholder="Password"
              required
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition duration-300 ease-in-out"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              className="text-white p-3 rounded-lg transition duration-300 ease-in-out"
              style={{ backgroundColor: '#b88e2f', color: 'white' }}
            >
              Log In
            </button>
          </form>
          <div className="flex items-center justify-center my-4">
            <span className="text-gray-600">or</span>
          </div>
          <button
            onClick={handleSigninWithGoogle}
            className="text-white p-3 rounded-lg transition duration-300 ease-in-out w-full"
            style={{ backgroundColor: '#b88e2f', color: 'white' }}
          >
            Sign In With Google
          </button>
          <br />
          <br />
          <div className="text-center">
            Don't have an account? <Link className="underline text-lg" to="/signup">Sign Up</Link>
          </div>
        </div>

        {/* Display admin credentials */}
        <div className="mt-6 bg-white p-4 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-lg font-semibold">Admin Credentials:</h2>
          <p>Email: <span className="font-bold">admin@gmail.com</span></p>
          <p>Password: <span className="font-bold">123456</span></p>
        </div>
      </div>
    </>
  );
}

export default LoginForm;
