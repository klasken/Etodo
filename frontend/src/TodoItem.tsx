import { Trash, Calendar, Clock, CheckCircle2 } from "lucide-react";

type Priority = "Urgente" | "Moyenne" | "Basse";

type Todo = {
    id: number;
    text: string;
    priority: Priority;
    date: string;
    created: string;
    status: string;
};

type Props = {
    todo: Todo;
    onDelete: () => void;
    isSelected: boolean;
    onToggleSelect: (id: number) => void;
};

export default function TodoItem({ todo, onDelete, isSelected, onToggleSelect }: Props) {
    const statusColor = todo.status === 'done' ? 'text-success' : todo.status === 'in progress' ? 'text-info' : 'text-gray-400';
    const priorityColor = todo.priority === "Urgente" ? "bg-error" : todo.priority === "Basse" ? "bg-success" : "bg-warning";

    return (
        <li className="p-3 bg-base-100 rounded-lg border border-base-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start gap-3">
                <input
                    type="checkbox"
                    className="checkbox checkbox-primary checkbox-sm mt-1"
                    checked={isSelected}
                    onChange={() => onToggleSelect(todo.id)}
                />

                <div className="flex flex-col gap-1 w-full">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-base-content">{todo.text}</span>
                        <span className={`badge badge-sm border-0 text-white font-semibold ${priorityColor}`}>{todo.priority}</span>
                        <span className={`flex items-center gap-1 text-xs font-bold uppercase ${statusColor}`}>
                            <CheckCircle2 size={12} /> {todo.status}
                        </span>
                    </div>

                    <div className="flex gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Calendar size={12} /> {todo.date}</span>
                        <span className="flex items-center gap-1 opacity-70"><Clock size={12} /> {todo.created}</span>
                    </div>
                </div>

                <button onClick={onDelete} className="btn btn-sm btn-ghost text-error btn-square">
                    <Trash className="w-4 h-4" />
                </button>
            </div>
        </li>
    );
}
