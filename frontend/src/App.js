import React, { useState, useEffect } from 'react';

const API_URL = '/api/todos';

function App() {
  const [todos, setTodos] = useState([]);
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      setError('Failed to load todos.');
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });
      if (!res.ok) throw new Error('Failed to add todo');
      const newTodo = await res.json();
      setTodos((prev) => [...prev, newTodo]);
      setInputText('');
      setError('');
    } catch (err) {
      setError('Failed to add todo.');
    }
  };

  const toggleTodo = async (todo) => {
    try {
      const res = await fetch(`${API_URL}/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !todo.completed }),
      });
      if (!res.ok) throw new Error('Failed to update todo');
      const updated = await res.json();
      setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch (err) {
      setError('Failed to update todo.');
    }
  };

  const deleteTodo = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete todo');
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError('Failed to delete todo.');
    }
  };

  const remaining = todos.filter((t) => !t.completed).length;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>📝 Todo App</h1>

        <form onSubmit={addTodo} style={styles.form}>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Add a new todo..."
            style={styles.input}
          />
          <button type="submit" style={styles.addButton}>
            Add
          </button>
        </form>

        {error && <p style={styles.error}>{error}</p>}

        {loading ? (
          <p style={styles.info}>Loading...</p>
        ) : todos.length === 0 ? (
          <p style={styles.info}>No todos yet. Add one above!</p>
        ) : (
          <>
            <p style={styles.summary}>
              {remaining} task{remaining !== 1 ? 's' : ''} remaining
            </p>
            <ul style={styles.list}>
              {todos.map((todo) => (
                <li key={todo.id} style={styles.item}>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo)}
                    style={styles.checkbox}
                  />
                  <span
                    style={{
                      ...styles.text,
                      textDecoration: todo.completed ? 'line-through' : 'none',
                      color: todo.completed ? '#aaa' : '#333',
                    }}
                  >
                    {todo.text}
                  </span>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    style={styles.deleteButton}
                    title="Delete"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '40px 16px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  card: {
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
    padding: '36px 32px',
    width: '100%',
    maxWidth: '500px',
  },
  title: {
    margin: '0 0 24px',
    fontSize: '1.8rem',
    color: '#333',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
  },
  input: {
    flex: 1,
    padding: '10px 14px',
    fontSize: '1rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    outline: 'none',
  },
  addButton: {
    padding: '10px 20px',
    fontSize: '1rem',
    background: '#667eea',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  error: {
    color: '#e74c3c',
    fontSize: '0.9rem',
    margin: '0 0 12px',
  },
  info: {
    color: '#888',
    textAlign: 'center',
    margin: '24px 0',
  },
  summary: {
    color: '#666',
    fontSize: '0.9rem',
    margin: '0 0 12px',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 0',
    borderBottom: '1px solid #f0f0f0',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  text: {
    flex: 1,
    fontSize: '1rem',
  },
  deleteButton: {
    background: 'none',
    border: 'none',
    color: '#ccc',
    fontSize: '1rem',
    cursor: 'pointer',
    padding: '2px 6px',
    borderRadius: '4px',
  },
};

export default App;
