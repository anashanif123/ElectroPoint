import { createRoot } from "react-dom/client";
import "./index.css";
import AppRouter from "./route.jsx";
import UserContextProvider from "./context/UserAuthentication.jsx";
import { CartProvider } from "./context/CartContext.jsx";

createRoot(document.getElementById("root")).render(
  
    <UserContextProvider>
      <CartProvider>
      <AppRouter />
      </CartProvider>
    </UserContextProvider>
);
