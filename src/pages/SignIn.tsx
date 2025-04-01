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
    <div>
      <div className="card m-3 w-25 mt-5 mx-auto">
        <h1 className="font-monospace text-info mx-auto mt-2">SIGN IN</h1>
        <input
          placeholder="Type email..."
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          type="email"
          className="form-control m-2 w-auto"
        />
        <input
          placeholder="Type password..."
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          type="password"
          className="form-control m-2 w-auto"
        />
        <p
          className="link-info mx-auto mb-2"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/auth/sign-up")}
        >
          Don't have an account?
        </p>

        <button
          onClick={loginUser}
          className="btn btn-primary mb-2 w-50 mx-auto"
        >
          SIGN IN
        </button>
      </div>
    </div>
  );
};

export default SignIn;
