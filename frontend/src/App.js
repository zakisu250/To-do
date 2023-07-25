import { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

import './App.css';

const baseUrl = 'http://127.0.0.1:5000/';

function App() {
  const [description, setDescription] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [todosList, setTodosList] = useState([]);
  const [todoId, setTodoId] = useState(null);

  // const fetchTodos = async () => {
  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${baseUrl}/todos`);
      const todos = response.data;
      setTodosList(todos);
    } catch (error) {
      console.log(error);
    }
  };
  const handleChange = (e, field) => {
    if (field === 'edit') {
      setEditDescription(e.target.value);
    } else {
      setDescription(e.target.value);
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`${baseUrl}/todos/${id}`);
    fetchTodos();
  };

  const handleEdit = (event) => {
    setTodoId(event.id);
    setEditDescription(event.description);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editDescription) {
        const { data } = await axios.put(`${baseUrl}/todos/${todoId}`, {
          description: editDescription,
        });
        const updatedTodo = data.Todo;
        const updatedList = todosList.map((todo) => {
          if (todo.id === todoId) {
            return (todo = updatedTodo);
          }
          return todo;
        });
        setTodosList(updatedList);
      } else {
        if (!description) {
          alert('No text to Add');
          return;
        }
        const { data } = await axios.post(`${baseUrl}/todos`, { description });
        setTodosList([...todosList, data]);
      }
      setDescription('');
      setEditDescription('');
      setTodoId(null);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="App">
      <section>
        <form onSubmit={handleSubmit}>
          <label htmlFor="description" className="main-head">
            TODO-LIST
          </label>
          <div className="input-holder">
            <input
              onChange={(e) => handleChange(e, 'description')}
              type="text"
              name="description"
              id="description"
              placeholder="Describe what to do"
              value={description}
            />
            <button type="submit" className="add-butt">
              ADD
            </button>
          </div>
        </form>
      </section>
      <section className="main-content">
        <ul>
          {todosList.map((todo) => {
            if (todoId === todo.id) {
              return (
                <li>
                  <form onSubmit={handleSubmit} key={todo.id}>
                    <input
                      onChange={(e) => handleChange(e, 'edit')}
                      type="text"
                      name="editDescription"
                      id="editDescription"
                      value={editDescription}
                    />
                    <button type="submit" className="new-butt sub-mit">
                      Submit
                    </button>
                  </form>
                </li>
              );
            } else {
              return (
                <div className="list-items">
                  <li key={todo.id} className="items">
                    {format(new Date(todo.createdAt), 'dd/MM, p')} :{' '}
                    {todo.description}
                  </li>
                  <button onClick={() => handleEdit(todo)} className="new-butt">
                    EDIT
                  </button>
                  <i
                    className="butt fa-solid fa-trash"
                    onClick={() => handleDelete(todo.id)}
                  ></i>
                </div>
              );
            }
          })}
        </ul>
      </section>
    </div>
  );
}

export default App;
