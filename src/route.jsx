import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { CSSTransition, SwitchTransition } from "react-transition-group"; // Import for transitions
import Header from "./components/Header";
import About from "./pages/About";
import Shop from "./pages/Shop";
import Contact from "./pages/Contact";
import ProductComparison from "./pages/ProductComparison";
import LoginForm from "./pages/Login";
import SignUp from "./pages/Signup";
import ProductDetails from "./components/ProductDetail";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import CheckoutPage from "./pages/Checkout";
import ScrollToTop from "./components/ScrollToTop";
import AdminPanel from "./pages/AdminPanel";
import ToShip from "./pages/ToShip";
import Home from "./pages/Home";
import "./index.css"; // Import your custom CSS for transitions

function AppRouter() {


  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes location={location}>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/login" element={<Layout hideHeader><LoginForm /></Layout>} />
        <Route path="/signup" element={<Layout hideHeader><SignUp /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/shop" element={<Layout><Shop /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
        <Route path="/cart" element={<Layout><Cart /></Layout>} />
        <Route path="/wishlist" element={<Layout><Wishlist /></Layout>} />
        <Route path="/product/:id" element={<Layout><ProductDetails /></Layout>} />
        <Route path="/adminpanel" element={<Layout hideHeader><AdminPanel /></Layout>} />
        <Route path="/toship" element={<Layout><ToShip /></Layout>} />
        <Route path="/productcomparison" element={<Layout><ProductComparison /></Layout>} />
        <Route path="/checkout" element={<Layout><CheckoutPage /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

function Layout({ children, hideHeader }) {
  const location = useLocation();

  return (
    <div>
      {!hideHeader && location.pathname !== "/adminpanel" && <Header />}
      <SwitchTransition>
        <CSSTransition
          key={location.pathname}
          classNames="fade"
          timeout={300} // Duration of the animation
        >
          <div>{children}</div>
        </CSSTransition>
      </SwitchTransition>
    </div>
  );
}

export default AppRouter;
