import { createContext, useState, useEffect } from 'react';
import { authenticateUser } from '../helpers/apiCalls';
export const UserContext = createContext();

export const UserContextProvider = (props) => {
  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState([]);
  const [error, setError] = useState({ message: '' });

  // this gets executed BEFORE first render
  const [user, setUser] = useState(); // load login info on STARTUP (before rendering)
  const [authIsDone, setAuthIsDone] = useState(false);

  // last thing to get executed (after all components have been rendered already)
  useEffect(() => {
    console.log('Context is trying to authenticate the user');
    const authMe = async () => {
      try {
        // /me/auth
        const result = await authenticateUser();
        if (result.error) {
          setUser();
          setAuthIsDone(true);
          return;
        }

        setUser(result);
        setAuthIsDone(true);
      } catch (error) {}
    };

    authMe();
  }, []); // will executed AFTER first render

  const sharedData = {
    user,
    setUser,
    todos,
    setTodos,
    todo,
    setTodo,
    error,
    setError,
    authIsDone,
    setAuthIsDone,
  };

  return <UserContext.Provider value={sharedData}>{props.children}</UserContext.Provider>;
};
