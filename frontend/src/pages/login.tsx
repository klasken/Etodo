import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("token", data.token);
            navigate("/todo");
        } else {
            alert("Erreur : " + data.msg);
        }

    } catch (error) {
        console.error(error);
        alert("Erreur de connexion au serveur");
    }
  }

  return (
    <div className="flex flex-col items-center mt-20">
      <h1 className="text-3xl font-bold mb-6">Connexion</h1>

      <form className="flex flex-col gap-4 w-64" onSubmit={handleLogin}>
        <input
          type="email"
          className="input input-bordered"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="input input-bordered"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn btn-primary" type="submit">
          Se connecter
        </button>
      </form>
      <p className="mt-4 text-sm">
        Pas de compte ?{" "}
        <Link to="/register" className="text-primary">
          Créer un compte
        </Link>
      </p>
    </div>
  );
}
