import React, { useState, useEffect, ChangeEvent } from 'react';
import { getData, saveData } from "../../../utils/storage"; // for data localstorage
import { useAppContext } from "../../../context/AppContext"; // for events updates
import MyModal from '../../../utils/Modal';
import '../../../utils/Modal.css';
interface Todo {
  id: string;
  text: string;
}

const TodoList: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const { user } = useAppContext();
  const [msg, setMsg] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
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

      <div>
        {/* Modal window - the contant of MyModal will be project in children prop */}
        <div>
          <MyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            {/* The content wrapped inside will be strongly typed */}
            <h2>Welcome to To-Do List Modal!</h2>
            <p>This is some flexible content for the modal body.</p>
            <ul>
              <li>You can put anything here</li>
              <li>Forms, lists, images, and more</li>
            </ul>
          </MyModal>
        </div>
      </div>

      <div style={styles.container}>
        <button onClick={() => setIsModalOpen(true)}>Open Modal</button>
        <h1 style={styles.heading}>To-Do List</h1><p>User msg: {msg}</p>
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
        <ul style={styles.list}>
          {todos.map((todo) => (
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
    padding: '10px',
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
