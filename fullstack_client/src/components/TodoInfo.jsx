import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { fetchTodo } from '../helpers/apiCalls';
import { UserContext } from '../context/UserContext';
import { useContext } from 'react';

const TodoInfo = () => {
  let { id } = useParams();
  const { todo, setTodo } = useContext(UserContext);

  useEffect(() => {
    const getData = async () => {
      let res = await fetchTodo(id);
      setTodo(res.data);
    };

    getData();
  }, []);

  return (
    <div className='todo-info'>
      <section>
        <p>{todo.text}</p>
      </section>
    </div>
  );
};

export default TodoInfo;
