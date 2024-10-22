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
        // Signed up
        const user = userCredential.user;
        
        // Save user data to Firestore
        const userDocRef = doc(db, "users", user.uid);
        setDoc(userDocRef, {
          username: username,
          email: email,
          createdAt: new Date()
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
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage);
      });
  }

  function handleSubmitWithGoogle() {
    const provider = new GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        
        // Save Google user data to Firestore
        const userDocRef = doc(db, "users", user.uid);
        setDoc(userDocRef, {
          username: user.displayName,
          email: user.email,
          createdAt: new Date()
        }, { merge: true }) // Use merge: true to update existing documents
        .then(() => {
          console.log("Google user data saved to Firestore");
          navigate("/");
        })
        .catch((error) => {
          console.error("Error saving Google user data: ", error);
        });
      })
      .catch((error) => {
        const errorMessage = error.message;
        alert(errorMessage);
      });
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 animate-fade-in">
      <h1 className="text-4xl font-bold text-center mb-6 animate-bounce"
      style={{  color: '#b88e2f' }}>
        
        Sign Up
      </h1>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md animate-slide-up">
        <form onSubmit={onSubmit} className="flex flex-col space-y-4">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="Username"
            required
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 transition duration-300 ease-in-out"
          />
          <input
            value={email}
            type="email"
            placeholder="Email"
            required
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 transition duration-300 ease-in-out"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            value={password}
            type="password"
            placeholder="Password"
            required
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber -700 transition duration-300 ease-in-out"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
                type="submit"
                className=" text-white p-3 rounded-lg  transition duration-300 ease-in-out"
                style={{ backgroundColor: '#b88e2f', color: 'white' }}
              >
                Sign up
              </button>
            </form>
            <div className="flex items-center justify-center my-4">
              <span className="text-gray-600">or</span>
            </div>
            <button
              onClick={handleSubmitWithGoogle}
              className=" text-white p-3 rounded-lg -700 transition duration-300 ease-in-out w-full "
              style={{ backgroundColor: '#b88e2f', color: 'white' }}
            >
              Sign up With Google
            </button>
        <p className="text-sm text-gray-600 text-center mt-4">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;