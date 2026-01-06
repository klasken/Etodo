import { useEffect, useState } from "react";
import { Construction, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TodoItem from "../TodoItem";

const getUserId = (token: string) => { try { return JSON.parse(atob(token.split('.')[1])).user_id; } catch { return null; } };

export default function TodoApp() {
    const navigate = useNavigate();
    type Priority = "Urgente" | "Moyenne" | "Basse";
    type Todo = { id: number; text: string; priority: Priority; };

    const [input, setInput] = useState("");
    const [priority, setPriority] = useState<Priority>("Moyenne");
    const [todos, setTodos] = useState<Todo[]>([]);
    const [filter, setFilter] = useState<Priority | "Tous">("Tous");
    const [selectedTodos, setSelectedTodos] = useState<Set<number>>(new Set());

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/");

        fetch('http://localhost:3000/user/todos', { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setTodos(data.map((i:any) => ({
                        id: i.id,
                        text: i.title,
                        priority: ["Urgente", "Moyenne", "Basse"].includes(i.description) ? i.description : "Moyenne"
                    })));
                } else {
                    setTodos([]);
                }
            })
            .catch(err => console.error("Erreur chargement", err));
    }, [navigate]);

    async function addTodo() {
        if (!input.trim()) return;
        const token = localStorage.getItem("token");
        if(!token) return;

        const res = await fetch('http://localhost:3000/todos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ title: input.trim(), description: priority, due_time: "2025-12-31 23:59:59", status: "todo", user_id: getUserId(token) })
        });

        if (res.ok) {
            const d = await res.json();
            setTodos([{ id: d.id, text: d.title, priority: d.description as Priority }, ...todos]);
            setInput(""); setPriority("Moyenne");
        }
    }

    async function deleteTodo(id: number) {
        await fetch(`http://localhost:3000/todos/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` } });
        setTodos(todos.filter((t) => t.id !== id));
    }

    function toggleSelectTodo(id: number) {
        const newSelected = new Set(selectedTodos);
        newSelected.has(id) ? newSelected.delete(id) : newSelected.add(id);
        setSelectedTodos(newSelected);
    }

    async function finishSelected() {
        if (!selectedTodos.size) return;
        const token = localStorage.getItem("token");
        for (const id of Array.from(selectedTodos)) await fetch(`http://localhost:3000/todos/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
        setTodos(todos.filter((t) => !selectedTodos.has(t.id)));
        setSelectedTodos(new Set());
    }

    const logout = () => { localStorage.removeItem("token"); navigate("/"); };
    const filteredTodos = filter === "Tous" ? todos : todos.filter((t) => t.priority === filter);
    const counts = { Urgente: 0, Moyenne: 0, Basse: 0, Tous: todos.length };
    todos.forEach(t => { if(t.priority in counts) counts[t.priority]++ });

    return (
        <div className="flex flex-col items-center mt-10 relative">
            <button onClick={logout} className="absolute top-0 right-10 btn btn-ghost btn-sm text-error gap-2 hover:bg-error/10">
                <LogOut size={18} /> Se déconnecter
            </button>
            <h1 className="text-4xl font-extrabold text-primary mb-8 text-center">BIENVENUE SUR NOTRE <span className="text-secondary">IT-TO-DO !</span></h1>

            <div className="w-2/3 flex flex-col gap-4 bg-base-300 p-5 rounded-2xl shadow-lg">
                <div className="flex gap-4">
                    <input type="text" className="input w-full" placeholder="Ajouter une tâche..." value={input} onChange={(e) => setInput(e.target.value)} />
                    <select className="select w-full" value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
                        <option value="Urgente">Urgente</option><option value="Moyenne">Moyenne</option><option value="Basse">Basse</option>
                    </select>
                    <button onClick={addTodo} className="btn btn-primary">Ajouter</button>
                </div>

                <div className="space-y-2 flex-1 h-fit">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-4">
                            {(["Tous", "Urgente", "Moyenne", "Basse"] as const).map(p => (
                                <button key={p} className={`btn btn-soft ${filter === p ? "btn-primary" : ""}`} onClick={() => setFilter(p)}>{p} ({counts[p]})</button>
                            ))}
                        </div>
                        <button onClick={finishSelected} className="btn btn-primary" disabled={selectedTodos.size === 0}>Finir la sélection ({selectedTodos.size})</button>
                    </div>
                    {filteredTodos.length > 0 ? (
                        <ul className="divide-y divide-primary/20">
                            {filteredTodos.map((t) => (
                                <li key={t.id}><TodoItem todo={t} isSelected={selectedTodos.has(t.id)} onDelete={() => deleteTodo(t.id)} onToggleSelect={toggleSelectTodo} /></li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex justify-center items-center flex-col p-5"><Construction strokeWidth={1} className="w-40 h-40 text-primary" /><p className="text-sm">Aucune tâche pour ce filtre</p></div>
                    )}
                </div>
            </div>
        </div>
    );
}
