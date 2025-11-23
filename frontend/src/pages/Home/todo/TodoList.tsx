import { useState, useEffect, useMemo, useRef, createRef } from 'react';
import type { ChangeEvent } from 'react';
import { getlocalStorage, savelocalStorage } from "../../../utils/storage"; // for data localstorage
import { useAppContext } from "../../../context/AppContext"; // for events updates
import { CSSTransition, TransitionGroup } from "react-transition-group";
import {
  Container,
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Button,
  Alert,
  Box,
  Grid,
  Stack,
  Chip,
  List,
  ListItem,
  Checkbox,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab
} from '@mui/material';
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

  // Load todos from localStorage
  const initTodo = (): Todo[] => {
    let todos: Todo[] = []
    try {
      const storedTodos = getlocalStorage<Todo[]>('todos')// localStorage.getItem('todos');
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
      savelocalStorage('todos', todos); // localStorage.setItem('todos', JSON.stringify(todos));
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
  const nodeRefs = useRef<Record<string, React.RefObject<HTMLLIElement>>>({});

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container justifyContent="center">
        <Grid size={{ xs: 12, md: 12, lg: 12, xl: 12 }}>
          <Card sx={{ boxShadow: 1 }}>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <FontAwesomeIcon icon={faListCheck} />
                    <Typography variant="h5" component="span">To-Do List</Typography>
                  </Box>
                  <Chip label={`Active: ${activeCount}`} color="success" size="small" />
                </Box>
              }
            />
            <CardContent>
              <Stack spacing={3}>
                {msg && (
                  <Alert severity="info">
                    <strong>User message:</strong> {msg}
                  </Alert>
                )}

                <Box component="form">
                  <Grid container spacing={3} alignItems="flex-end">
                    <Grid size={{ md: 8 }}>
                      <TextField
                        fullWidth
                        id="todoInput"
                        label="Add a task"
                        placeholder="Enter a to-do item"
                        value={input}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                      />
                    </Grid>
                    <Grid size={{ md: 4 }}>
                      <Button
                        variant="contained"
                        onClick={handleAdd}
                        disabled={!input.trim()}
                        fullWidth
                        sx={{ height: '56px' }} // Match TextField height
                      >
                        Add Item
                      </Button>
                    </Grid>
                  </Grid>
                </Box>

                <Box>
                  <TextField
                    fullWidth
                    id="todoSearch"
                    label="Search your todos"
                    placeholder="Type to search..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    slotProps={{
                      input: {
                        startAdornment: <InputAdornment position="start">Search</InputAdornment>,
                      },
                    }}
                  />
                </Box>

                <Tabs
                  value={activeTab}
                  onChange={(_, newValue) => setActiveTab(newValue)}
                  centered
                  sx={{ mb: 3 }}
                >
                  <Tab label={`All (${allCount})`} value="all" />
                  <Tab label={`Active (${activeCount})`} value="active" />
                  <Tab label={`Complete (${completeCount})`} value="complete" />
                </Tabs>

                <Card variant="outlined">
                  <CardContent sx={{ p: 0 }}>
                    <List>
                      <TransitionGroup component={null}>
                        {filtered.map(todo => {
                          let ref: React.RefObject<HTMLLIElement>;
                          if (nodeRefs.current[todo.id]) {
                            ref = nodeRefs.current[todo.id];
                          } else {
                            ref = createRef<HTMLLIElement>() as React.RefObject<HTMLLIElement>;
                            nodeRefs.current[todo.id] = ref;
                          }

                          return (
                            <CSSTransition key={todo.id} nodeRef={ref} timeout={500} classNames="slide">
                              <ListItem
                                ref={ref}
                                divider
                                secondaryAction={
                                  <Button
                                    variant="outlined"
                                    color="error"
                                    size="small"
                                    onClick={() => handleDeleteRequest(todo)}
                                  >
                                    Delete
                                  </Button>
                                }
                              >
                                <Checkbox
                                  edge="start"
                                  checked={todo.completed}
                                  onChange={() => handleToggleComplete(todo.id)}
                                />
                                <Typography
                                  sx={{
                                    textDecoration: todo.completed ? 'line-through' : 'none',
                                    opacity: todo.completed ? 0.6 : 1,
                                    flexGrow: 1,
                                    ml: 2
                                  }}
                                >
                                  {todo.text}
                                </Typography>
                              </ListItem>
                            </CSSTransition>
                          );
                        })}
                      </TransitionGroup>
                      {filtered.length === 0 && (
                        <ListItem sx={{ justifyContent: 'center', py: 4 }}>
                          <Typography color="textSecondary">
                            Nothing to show yet. Try adding a new task above!
                          </Typography>
                        </ListItem>
                      )}
                    </List>
                  </CardContent>
                </Card>
              </Stack>

              <Dialog
                open={showDeleteModal}
                onClose={handleCancelDelete}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  Confirm delete
                </DialogTitle>
                <DialogContent>
                  <Typography>
                    {todoToDelete ? (
                      <>
                        Are you sure you want to delete <strong>{todoToDelete.text}</strong>?
                      </>
                    ) : (
                      'No item selected for deletion.'
                    )}
                  </Typography>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCancelDelete} color="inherit">
                    Cancel
                  </Button>
                  <Button onClick={handleConfirmDelete} color="error" autoFocus>
                    Delete
                  </Button>
                </DialogActions>
              </Dialog>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TodoList;
