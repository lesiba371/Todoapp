import { useState, useEffect } from 'react'
import './App.css'

type FilterType = 'all' | 'active' | 'completed'

interface Todo {
  id: number
  text: string
  completed: boolean
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos')
    return saved ? (JSON.parse(saved) as Todo[]) : []
  })
  const [inputValue, setInputValue] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    const text = inputValue.trim()
    if (!text) return
    setTodos([...todos, { id: Date.now(), text, completed: false }])
    setInputValue('')
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((t) => t.id !== id))
  }

  const clearCompleted = () => {
    setTodos(todos.filter((t) => !t.completed))
  }

  const filteredTodos = todos.filter((t) => {
    if (filter === 'active') return !t.completed
    if (filter === 'completed') return t.completed
    return true
  })

  const activeCount = todos.filter((t) => !t.completed).length

  return (
    <div className="app">
      <h1 className="app-title">todos</h1>

      <div className="todo-container">
        <div className="todo-input-row">
          <input
            className="todo-input"
            type="text"
            placeholder="What needs to be done?"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
            aria-label="New todo"
          />
          <button className="add-btn" onClick={addTodo} aria-label="Add todo">
            Add
          </button>
        </div>

        {todos.length > 0 && (
          <>
            <ul className="todo-list" aria-label="Todo list">
              {filteredTodos.map((todo) => (
                <li key={todo.id} className={`todo-item${todo.completed ? ' completed' : ''}`}>
                  <input
                    type="checkbox"
                    className="todo-checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
                  />
                  <span className="todo-text">{todo.text}</span>
                  <button
                    className="delete-btn"
                    onClick={() => deleteTodo(todo.id)}
                    aria-label={`Delete "${todo.text}"`}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>

            <div className="todo-footer">
              <span className="item-count">
                {activeCount} {activeCount === 1 ? 'item' : 'items'} left
              </span>

              <div className="filters" role="group" aria-label="Filter todos">
                {(['all', 'active', 'completed'] as FilterType[]).map((f) => (
                  <button
                    key={f}
                    className={`filter-btn${filter === f ? ' active' : ''}`}
                    onClick={() => setFilter(f)}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>

              {todos.some((t) => t.completed) && (
                <button className="clear-btn" onClick={clearCompleted}>
                  Clear completed
                </button>
              )}
            </div>
          </>
        )}

        {todos.length === 0 && (
          <p className="empty-message">No todos yet. Add one above!</p>
        )}
      </div>
    </div>
  )
}

export default App
