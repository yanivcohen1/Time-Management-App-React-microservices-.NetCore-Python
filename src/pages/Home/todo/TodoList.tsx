import React, { useState, useEffect, ChangeEvent, useMemo, useRef, createRef } from 'react';
import { getData, saveData } from "../../../utils/storage"; // for data localstorage
import { useAppContext } from "../../../context/AppContext"; // for events updates
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import Alert from "react-bootstrap/Alert";
import Modal from "react-bootstrap/Modal";
import Nav from "react-bootstrap/Nav";
import { useTheme } from "../../../hooks/useTheme";
import "../../../animation/slide-right.css";
import "../../../animation/fade.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListCheck } from "@fortawesome/free-solid-svg-icons";
interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

const TodoList: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const { user } = useAppContext();
  const [msg, setMsg] = useState<string>("");
  const theme = useTheme();
  const isDarkTheme = theme === 'dark';

  // Load todos from localStorage
  const initTodo = (): Todo[] => {
    let todos: Todo[] = []
    try {
      const storedTodos = getData<Todo[]>('todos')// localStorage.getItem('todos');
      if (storedTodos) {
          todos = storedTodos.map(todo => ({ ...todo, completed: todo.completed ?? false }));
      }
    } catch (error) {
      console.error('Error loading todos from localStorage:', error);
    }
    return todos;
  };

  const [todos, setTodos] = useState<Todo[]>(initTodo);
  const [query, setQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'complete'>('all');

  // Memoize filtered results for performance
  const filtered = useMemo(() => {
    const lower = query.toLowerCase();
    let filteredTodos = todos;
    if (lower) {
      filteredTodos = filteredTodos.filter(item => item.text.toLowerCase().includes(lower));
    }
    if (activeTab === 'active') {
      filteredTodos = filteredTodos.filter(item => !item.completed);
    } else if (activeTab === 'complete') {
      filteredTodos = filteredTodos.filter(item => item.completed);
    }
    return filteredTodos;
  }, [query, todos, activeTab]);

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
      text: trimmed,
      completed: false
    };

    setTodos([...todos, newTodo]);
    setInput('');
  };

  const handleDelete = (idToDelete: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== idToDelete));
  };

  const handleDeleteRequest = (todo: Todo) => {
    setTodoToDelete(todo);
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setTodoToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (!todoToDelete) return;
    handleDelete(todoToDelete.id);
    handleCancelDelete();
  };

  const handleToggleComplete = (id: string) => {
    setTodos(prev => prev.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  };

  const allCount = todos.length;
  const activeCount = todos.filter(t => !t.completed).length;
  const completeCount = todos.filter(t => t.completed).length;

  // Manage refs for each list item to avoid findDOMNode
  const nodeRefs = useRef<Record<string, React.RefObject<any>>>({});

  return (
    <Container fluid="md" className="py-4">
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8} xl={6}>
          <Card className={`shadow-sm ${isDarkTheme ? 'bg-dark text-white border-secondary' : ''}`}>
            <Card.Header className={isDarkTheme ? 'bg-dark text-white border-secondary' : 'bg-white'}>
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="mb-0 d-flex align-items-center gap-2">
                  <FontAwesomeIcon icon={faListCheck} />
                  <span>To-Do List</span>
                </h3>
                <Badge bg="primary" pill>
                  {todos.length}
                </Badge>
              </div>
            </Card.Header>
            <Card.Body className={isDarkTheme ? 'bg-dark text-white' : undefined}>
              <Stack gap={3}>
                {msg && (
                  <Alert
                    variant="info"
                    className="mb-0"
                  >
                    <strong>User message:</strong> {msg}
                  </Alert>
                )}

                <Form>
                  <Row className="g-3 align-items-end">
                    <Col md={8}>
                      <Form.Group controlId="todoInput">
                        <Form.Label className={isDarkTheme ? 'text-white' : undefined}>Add a task</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter a to-do item"
                          value={input}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                          className={isDarkTheme ? 'bg-dark text-white border-secondary' : undefined}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4} className="d-grid">
                      <Button onClick={handleAdd} disabled={!input.trim()}>
                        Add Item
                      </Button>
                    </Col>
                  </Row>
                </Form>

                <Form.Group controlId="todoSearch">
                  <Form.Label className={isDarkTheme ? 'text-white' : undefined}>Search your todos</Form.Label>
                  <InputGroup>
                    <InputGroup.Text
                      id="search-label"
                      className={isDarkTheme ? 'bg-dark text-white border-secondary' : undefined}
                    >
                      Search
                    </InputGroup.Text>
                    <Form.Control
                      type="search"
                      placeholder="Type to search..."
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      aria-describedby="search-label"
                      className={isDarkTheme ? 'bg-dark text-white border-secondary' : undefined}
                    />
                  </InputGroup>
                </Form.Group>

                <Nav
                  variant="tabs"
                  className="justify-content-center mb-3"
                  activeKey={activeTab}
                  onSelect={(k) => setActiveTab(k as 'all' | 'active' | 'complete')}
                  data-bs-theme={isDarkTheme ? 'dark' : undefined}
                >
                  <Nav.Item>
                    <Nav.Link eventKey="all">All ({allCount})</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="active">Active ({activeCount})</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="complete">Complete ({completeCount})</Nav.Link>
                  </Nav.Item>
                </Nav>

                <Card className={`shadow-sm ${isDarkTheme ? 'bg-dark text-white border-secondary' : ''}`}>
                  <Card.Body>
                    <ListGroup
                      variant="flush"
                      className={`border rounded ${isDarkTheme ? 'bg-dark text-white border-secondary' : ''}`}
                    >
                      <TransitionGroup component={null}>
                    {filtered.map(todo => {
                      let ref = nodeRefs.current[todo.id];
                      if (!ref) {
                        ref = createRef<HTMLLIElement>();
                        nodeRefs.current[todo.id] = ref;
                      }

                      return (
                        <CSSTransition key={todo.id} nodeRef={ref} timeout={500} classNames="slide">
                          <ListGroup.Item
                            ref={ref}
                            className={`d-flex justify-content-between align-items-center py-3 ${isDarkTheme ? 'bg-dark text-white border-secondary' : ''}`}
                          >
                            <span className={`me-3 flex-grow-1 ${todo.completed ? 'text-decoration-line-through text-muted' : ''}`} style={todo.completed ? {opacity: 0.6} : undefined}>{todo.text}</span>
                            <div className="d-flex align-items-center gap-2">
                              <Form.Check
                                type="checkbox"
                                checked={todo.completed}
                                onChange={() => handleToggleComplete(todo.id)}
                                label={<span style={{opacity: 0.6}}>Done</span>}
                              />
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDeleteRequest(todo)}
                              >
                                Delete
                              </Button>
                            </div>
                          </ListGroup.Item>
                        </CSSTransition>
                      );
                    })}
                  </TransitionGroup>
                  {filtered.length === 0 && (
                    <ListGroup.Item className={`text-center py-4 ${isDarkTheme ? 'bg-dark text-white border-secondary' : 'text-muted'}`}>
                      Nothing to show yet. Try adding a new task above!
                    </ListGroup.Item>
                  )}
                </ListGroup>
                  </Card.Body>
                </Card>
              </Stack>
              <Modal
                show={showDeleteModal}
                onHide={handleCancelDelete}
                centered
                backdrop="static"
                keyboard={false}
                contentClassName={isDarkTheme ? 'bg-dark text-white border-secondary' : undefined}
                data-bs-theme={isDarkTheme ? 'dark' : undefined}
              >
                <Modal.Header closeButton closeVariant={isDarkTheme ? 'white' : undefined} className={isDarkTheme ? 'border-secondary' : undefined}>
                  <Modal.Title>Confirm delete</Modal.Title>
                </Modal.Header>
                <Modal.Body className={isDarkTheme ? 'bg-dark text-white' : undefined}>
                  {todoToDelete ? (
                    <>
                      Are you sure you want to delete <strong>{todoToDelete.text}</strong>?
                    </>
                  ) : (
                    'No item selected for deletion.'
                  )}
                </Modal.Body>
                <Modal.Footer className={isDarkTheme ? 'border-secondary' : undefined}>
                  <Button variant={isDarkTheme ? 'outline-light' : 'secondary'} onClick={handleCancelDelete}>
                    Cancel
                  </Button>
                  <Button variant="danger" onClick={handleConfirmDelete}>
                    Delete
                  </Button>
                </Modal.Footer>
              </Modal>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TodoList;
