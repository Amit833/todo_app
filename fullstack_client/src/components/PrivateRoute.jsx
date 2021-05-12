import { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import Loading from '../components/Loading';

const PrivateRoute = ({ path, component, redirectTo = '/login' }) => {
  // grab the info if user is logged in from context
  const { user, authIsDone } = useContext(UserContext);

  // in case we are logged in => allow passing the given route
  // in case we are NOT logged in => redirect that fu**** not known person to login
  if (!authIsDone) return <Loading />;
  if (authIsDone) {
    return user ? (
      <Route path={path} component={component} />
    ) : (
      <Redirect to={redirectTo} />
    );
  }
};

export default PrivateRoute;
