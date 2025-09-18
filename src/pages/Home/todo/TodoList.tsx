import React, { useState, useEffect, ChangeEvent, useMemo } from 'react';
import { getData, saveData } from "../../../utils/storage"; // for data localstorage
import { useAppContext } from "../../../context/AppContext"; // for events updates
interface Todo {
  id: string;
  text: string;
}

const TodoList: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const { user } = useAppContext();
  const [msg, setMsg] = useState<string>("");

  // Load todos from localStorage
  const initTodo = (): Todo[] => {
    let todos: Todo[] = []
    try {
      const storedTodos = getData<Todo[]>('todos')// localStorage.getItem('todos');
      if (storedTodos) {
          todos = storedTodos;
      }
    } catch (error) {
      console.error('Error loading todos from localStorage:', error);
    }
    return todos;
  };

  const [todos, setTodos] = useState<Todo[]>(initTodo);
  const [query, setQuery] = useState('');

  // Memoize filtered results for performance
  const filtered = useMemo(() => {
    const lower = query.toLowerCase();
    if (!lower) return todos;
    return todos.filter(item => item.text.toLowerCase().includes(lower));
  }, [query, todos]);

  // Save todos to localStorage
  useEffect(() => {
    try {
      saveData('todos', todos); // localStorage.setItem('todos', JSON.stringify(todos));
    } catch (error) {
      console.error('Error saving todos to localStorage:', error);
    }
  }, [todos]);

  useEffect(() => {
    try {
      // console.log('user changed:', user);
      if (user){
        setMsg(user);
      }
    } catch (error) {
      console.error('Error saving todos to localStorage:', error);
    }
  }, [user]);


  const handleAdd = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    if (todos.some(todo => todo.text === trimmed)) return;

    const newTodo: Todo = {
      id: `todo_${Date.now()}`,
      text: trimmed
    };

    setTodos([...todos, newTodo]);
    setInput('');
  };

  const handleDelete = (idToDelete: string) => {
    const filteredTodos = todos.filter(todo => todo.id !== idToDelete);
    setTodos(filteredTodos);
  };

  return (
    <div>
      <div style={styles.container}>
        <h3 style={styles.heading}>To-Do List</h3><p>User msg: {msg}</p>
        <div style={styles.inputContainer}>
          <input
            type="text"
            value={input}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
            placeholder="Enter a to-do item"
            style={styles.input}
          />
          <button className="add" onClick={handleAdd} style={styles.addButton}>Add</button>
        </div>
        <input
          type="text"
          placeholder="Type to search..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ padding: '8px', width: '100%', boxSizing: 'border-box' }}
        />
        <ul style={styles.list}>
          {filtered.map((todo) => (
            <li key={todo.id} style={styles.listItem}>
              {todo.text}
              <button
                className="delete"
                id={todo.id}
                onClick={() => handleDelete(todo.id)}
                style={styles.deleteButton}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '500px',
    margin: '40px auto',
    padding: '20px',
    border: '2px solid #ddd',
    borderRadius: '10px',
    fontFamily: 'Arial, sans-serif'
  },
  heading: {
    textAlign: 'center'
  },
  inputContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px'
  },
  input: {
    flex: 1,
    padding: '8px',
    fontSize: '16px'
  },
  addButton: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer'
  },
  list: {
    listStyleType: 'none',
    paddingLeft: 0
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid #eee'
  },
  deleteButton: {
    background: '#ff5c5c',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '5px 10px',
    cursor: 'pointer'
  }
};

export default TodoList;
