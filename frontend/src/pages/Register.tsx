import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !firstName || !lastName || !password) {
      alert("Tous les champs sont obligatoires !");
      return;
    }

    if (password !== confirmPass) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: email,
            password: password,
            firstname: firstName,
            name: lastName
        })
      });

      const data = await response.json();

      if (response.ok) {
          alert("Compte créé avec succès ! Connectez-vous.");
          navigate("/");
      } else {
          alert("Erreur: " + data.msg);
      }
    } catch (error) {
        console.error("Erreur réseau", error);
        alert("Impossible de contacter le serveur");
    }
  }

  return (
    <div className="flex flex-col items-center mt-20">
      <h1 className="text-3xl font-bold mb-6">Créer un compte</h1>

      <form className="flex flex-col gap-4 w-64" onSubmit={handleRegister}>
        {}
        <input
          type="email"
          className="input input-bordered"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="text"
          className="input input-bordered"
          placeholder="Prénom"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <input
          type="text"
          className="input input-bordered"
          placeholder="Nom"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <input
          type="password"
          className="input input-bordered"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          className="input input-bordered"
          placeholder="Confirmer"
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value)}
        />

        <button className="btn btn-secondary" type="submit">
          S'inscrire
        </button>
      </form>

      <p className="mt-4 text-sm">
        Déjà un compte ?{" "}
        <Link to="/" className="text-primary">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
