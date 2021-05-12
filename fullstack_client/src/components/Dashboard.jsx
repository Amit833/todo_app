import { useEffect } from 'react';
import { fetchTodos } from '../helpers/apiCalls';
import { UserContext } from '../context/UserContext';
import { useContext } from 'react';
import TodosContainer from './TodosContainer';
import TodoForm from './TodoForm';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const Dashboard = () => {
  const { user, setTodos } = useContext(UserContext);
  const { register, handleSubmit, errors, watch } = useForm();

  // Get the todos straight away and pass them in the hook
  useEffect(() => {
    console.log('Dashboard is fetching the todos');
    const getData = async () => {
      let todos = await fetchTodos();
      setTodos(todos);
    };

    getData();
  }, []);

  return (
    <div className='dashboard'>
      <section>
        <h3>Dashboard</h3>
        <div className='form-container'>
          <TodoForm></TodoForm>
        </div>
        <div className='todos-container'>
          <TodosContainer></TodosContainer>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
