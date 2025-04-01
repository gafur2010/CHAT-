import { useState, useEffect } from "react";
import { Route, Routes, Link, useNavigate } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import Chat from "./pages/Home/Chat";
import "bootstrap/dist/css/bootstrap.min.css";

type NavbarProps = {
  user: string | null;
  setUser: React.Dispatch<React.SetStateAction<string | null>>;
};

const Navbar = ({ user, setUser }: NavbarProps) => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/auth/sign-in");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src="/src/img/iconca.webp" alt="" width={40} />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {user ? (
              <li className="nav-item">
                <button
                  onClick={handleSignOut}
                  className="btn btn-danger w-100"
                >
                  Sign Out
                </button>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/auth/sign-in">
                  <button className="btn btn-success w-100">Sign In</button>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

const App = () => {
  const [user, setUser] = useState(localStorage.getItem("user"));

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(localStorage.getItem("user"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <div>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/auth/sign-in" element={<SignIn setUser={setUser} />} />
        <Route path="/auth/sign-up" element={<SignUp />} />
        <Route path="*" element={<NotFound />} />
        <Route
          path="/"
          element={user ? <Chat /> : <SignIn setUser={setUser} />}
        />
      </Routes>
    </div>
  );
};

export default App;
