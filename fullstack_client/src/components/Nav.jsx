import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { logOutUser } from '../helpers/apiCalls';

const Nav = () => {
  const { user, setUser, setAuthIsDone } = useContext(UserContext);

  const handleLogout = () => {
    setUser(); // clear user / shutdown login session
    setAuthIsDone(false); // reset the auth process hook
    logOutUser(); // log out user at API - by clearing cookie...
  };

  return (
    <nav>
      <ul>
        <div className='logo'>
          <NavLink exact to='/'>
            <p>TUTURUDUTU</p>
          </NavLink>
        </div>
        <div className='items'>
          {!user && (
            <>
              <li>
                <NavLink exact to='/signup'>
                  <p>Signup</p>
                </NavLink>
              </li>
              <li>
                <NavLink exact to='/login'>
                  <p>Login</p>
                </NavLink>
              </li>
            </>
          )}
          {user && (
            <>
              <li>
                <NavLink exact to='/user'>
                  <p>Profile</p>
                </NavLink>
              </li>
              <li>
                <NavLink exact to='/dashboard'>
                  <p>Dashboard</p>
                </NavLink>
              </li>
              <li className='signOut'>
                <FontAwesomeIcon
                  title='Logout'
                  onClick={handleLogout}
                  icon={faSignOutAlt}
                />
              </li>
            </>
          )}
        </div>
      </ul>
    </nav>
  );
};

export default Nav;
