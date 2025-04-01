import { signInWithEmailAndPassword } from "firebase/auth";
import { ref, get } from "firebase/database";
import { useEffect, useState } from "react";
import { auth, database } from "../tools/firebase.config";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);

  async function loginUser() {
    if (!user.email || !user.password) {
      alert("Email va parolni kiriting!");
      return;
    }

    try {
      const res = await signInWithEmailAndPassword(
        auth,
        user.email,
        user.password
      );

      const userId = res.user.uid;

      const userRef = ref(database, `users/${userId}`);
      const snapshot = await get(userRef);

      let userData = {
        name: "Unknown",
        email: res.user.email,
        password: user.password,
        id: userId,
      };

      if (snapshot.exists()) {
        userData.name = snapshot.val().name || "Unknown";
      }

      localStorage.setItem("user", JSON.stringify(userData));

      setUser({ email: "", password: "" });
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      alert("Login xatosi! Ma'lumotlaringizni tekshiring.");
    }
  }

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100">
      <div
        className="card p-4 shadow-sm"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h1 className="text-center text-info mb-3">SIGN IN</h1>
        <input
          placeholder="Type email..."
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          type="email"
          className="form-control mb-2"
        />
        <input
          placeholder="Type password..."
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          type="password"
          className="form-control mb-3"
        />
        <a className="text-center d-block text-info mb-2" href="/auth/sign-up">
          Don't have an account?
        </a>
        <button onClick={loginUser} className="btn btn-primary w-100">
          SIGN IN
        </button>
      </div>
    </div>
  );
};

export default SignIn;
