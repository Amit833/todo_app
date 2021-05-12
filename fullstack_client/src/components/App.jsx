import '../scss/App.scss';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Nav from './Nav';
import Login from './Login';
import Signup from './Signup';
import Dashboard from './Dashboard';
import NotFound from './NotFound';
import Homepage from './Homepage';
import TodoInfo from './TodoInfo';
import ErrorDisplay from './ErrorDisplay';
import PrivateRoute from './PrivateRoute';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import AccountVerification from './AccountVerification';

console.log('API_URL:', process.env.REACT_APP_API_BASE_URL);

const App = (props) => {
  const { authIsDone } = useContext(UserContext);

  console.log('APPJS IS AUTH DONE:', authIsDone);
  return (
    <div className='app'>
      <Router>
        <Nav />
        <ErrorDisplay />
        <div className='main'>
          <Switch>
            <PrivateRoute exact path='/dashboard' component={Dashboard} />
            <PrivateRoute exact path='/dashboard/todos/:id' component={TodoInfo} />
            <Route exact path='/login' component={Login} />
            <Route exact path='/signup' component={Signup} />
            <Route
              exact
              path='/users/verify/:emailVerifToken'
              component={AccountVerification}
            />
            <Route exact path='' component={Homepage} />
            <Route path='*' component={NotFound} />
          </Switch>
        </div>
      </Router>
    </div>
  );
};

export default App;
