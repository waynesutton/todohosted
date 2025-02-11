import React, { useState } from 'react';
import { PlusCircle, Circle, CheckCircle2, Trash2, Github } from 'lucide-react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    
    const todo: Todo = {
      id: crypto.randomUUID(),
      text: newTodo.trim(),
      completed: false
    };
    
    setTodos([...todos, todo]);
    setNewTodo('');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="min-h-screen bg-black relative flex flex-col">
      {/* Grid background with gradient */}
      <div className="absolute inset-0 grid-background" />
      <div className="absolute inset-0 gradient-overlay" />
      
      {/* Header */}
      <header className="relative w-full py-6 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-white text-sm">Self hosted Reminders</h1>
        </div>
      </header>
      
      {/* Content */}
      <main className="relative flex-1 flex flex-col items-center px-4">
        <div className="w-full max-w-2xl">
          <h2 className="text-4xl mb-12 text-center tracking-tighter text-white">
            Reminders
          </h2>
          
          <div className="bg-zinc-900 rounded-lg p-6 shadow-lg">
            <form onSubmit={addTodo} className="mb-6">
              <div className="flex items-center gap-4 bg-zinc-800 rounded-lg p-4">
                <PlusCircle className="text-zinc-400 w-5 h-5" />
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="Add a task..."
                  className="bg-transparent flex-1 outline-none text-zinc-100 placeholder-zinc-500"
                />
              </div>
            </form>

            <div className="space-y-3">
              {todos.map(todo => (
                <div 
                  key={todo.id}
                  className="flex items-center gap-4 p-4 bg-zinc-800/50 rounded-lg group"
                >
                  <button 
                    onClick={() => toggleTodo(todo.id)}
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    {todo.completed ? 
                      <CheckCircle2 className="w-5 h-5" /> : 
                      <Circle className="w-5 h-5" />
                    }
                  </button>
                  <span className={`flex-1 ${todo.completed ? 'text-zinc-500 line-through' : 'text-zinc-100'}`}>
                    {todo.text}
                  </span>
                  <button 
                    onClick={() => deleteTodo(todo.id)}
                    className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative w-full py-6 px-4 mt-20">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <p className="text-zinc-400 text-sm">Open source powered by Convex</p>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;