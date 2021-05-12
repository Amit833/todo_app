import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { addTodo } from '../helpers/apiCalls';
import { UserContext } from '../context/UserContext';

export default function TodoForm() {
  // Take the text from the form
  // Make a post call and store the todo in the db
  // Update the todo list with the one we just created
  const { user, todos, setTodos } = useContext(UserContext);
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    const newTodo = await addTodo({ userId: user._id, ...data });
    setTodos([...todos, newTodo.data]);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input name='text' ref={register} />
      <input type='submit' value='ADD' />
    </form>
  );
}
