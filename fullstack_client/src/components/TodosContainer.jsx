import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { checkTodo, deleteMultipleTodos, updateMultipleTodos } from '../helpers/apiCalls';
import { useForm } from 'react-hook-form';

const TodosContainer = () => {
  // let history = useHistory();
  const { todos, setTodos } = useContext(UserContext);
  const { register, handleSubmit, watch } = useForm();

  // Thsi value is being updated everytime somebody checks a checkbox, as it watches
  // for changes in each todo input. We use it to show/hide the multiple delete/update buttons
  const atLeastOneIsChecked = watch('todo', []);

  // Let's sort the todos so we have the todos on top and the todones on the bottom
  todos.sort((a, b) => {
    if (a.status < b.status) {
      return -1;
    } else return 1;
  });

  // If i click in one todo take me to it's details page. Deactivated for now
  const handleClick = () => {
    //history.push(`dashboard/todos/${data._id}`);
  };

  // Our form button triggers the method and the data are the form data thanks to our beloved react-hook-form
  const onDeleteMultiple = async (data) => {
    // Delete the todos from the database please
    await deleteMultipleTodos(data);

    const deletedTodos = data.todo;
    // Filter out the todos that do exist in the deletedTodos
    let remainingTodos = todos.filter((todo) => !deletedTodos.includes(todo._id));

    setTodos(remainingTodos);
  };

  // Our second form button triggers this method that is using the handleSubmit
  // of react-hooks-form so it can have access to the form data
  const onUpdateMultiple = handleSubmit(async (data) => {
    //Update the todos in the database
    let updatedTodos = await updateMultipleTodos(data);

    // Find the todos that were updated in the database, and toggle their status
    updatedTodos.map((todo) => {
      let index = todos.findIndex((el) => el._id === todo._id);
      todos[index] = todo;
    });

    setTodos(todos);
  });

  // Put up and checkbox
  // Onclick we need to update the status of the todo
  // using the todos id
  const handleTodoClick = async (e) => {
    // Grab the id of the todo straight from the jsx data-*property*
    const id = e.currentTarget.dataset.id;
    console.log(`This is the todo you clicked is ${id}`);

    // Get the whole todo with the text,status and id
    let todo = todos.find((todo) => todo._id === id);

    // Update it in the DB
    let updatedTodo = await checkTodo(todo);

    // Find it in the todos and update it in the frontend please
    const newTodos = todos.map((item) => {
      if (item._id == updatedTodo.data._id) {
        console.log('Item', item);
        item.status = !item.status;
      }
      return item;
    });

    setTodos(newTodos);
  };

  const todosList = todos.map((todo) => {
    return (
      <div
        key={todo._id}
        className={todo.status ? 'todo checked' : 'todo'}
        onClick={handleClick}
      >
        <p>
          <label>
            <input type='checkbox' ref={register} name='todo' value={todo._id}></input>
            {todo.text}
          </label>
        </p>
        <div className='actions'>
          <FontAwesomeIcon data-id={todo._id} icon={faCheck} onClick={handleTodoClick} />
          <FontAwesomeIcon icon={faTrash} />
          <FontAwesomeIcon icon={faEdit} />
        </div>
      </div>
    );
  });

  return (
    <form onSubmit={handleSubmit(onDeleteMultiple)}>
      <fieldset>{todosList}</fieldset>
      {atLeastOneIsChecked.length > 0 && (
        <>
          <input type='submit' value='Delete selected' />
          <input type='button' onClick={onUpdateMultiple} value='Update selected' />
        </>
      )}
    </form>
  );
};

export default TodosContainer;
