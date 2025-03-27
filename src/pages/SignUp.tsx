import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth, database } from "../tools/firebase.config";
import { ref, set } from "firebase/database";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    messages: [],
  });
  const navigate = useNavigate();

  function createUser() {
    if (!user.email || !user.password || !user.name) {
      alert("Barcha maydonlarni to‘ldiring!");
      return;
    }

    createUserWithEmailAndPassword(auth, user.email, user.password)
      .then((res) => {
        if (res.user) {
          set(ref(database, `users/${res.user.uid}`), {
            name: user.name,
            email: user.email,
            password: user.password,
            messages: [],
          });

          localStorage.setItem("user", JSON.stringify(res.user));
          setUser({ name: "", email: "", password: "", messages: [] });

          navigate("/");
        }
      })
      .catch((error) => {
        alert(error.message);
      });
  }

  return (
    <div>
      <div className="card m-3 w-25 mt-5 mx-auto">
        <h1 className="font-monospace text-info mx-auto mt-2">SIGN UP</h1>
        <input
          placeholder="Type name..."
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
          type="text"
          className="form-control m-2 w-auto"
        />
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
        <a
          className="link-info mx-auto mb-2"
          href="http://localhost:5173/auth/sign-in"
        >
          Already have an account?
        </a>
        <button
          onClick={createUser}
          className="btn btn-success mb-2 w-50 mx-auto"
        >
          SIGN UP
        </button>
      </div>
    </div>
  );
};

export default SignUp;
