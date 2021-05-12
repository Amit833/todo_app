import { useForm } from 'react-hook-form';
import { loginUser, googleLoginUser } from '../helpers/apiCalls';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { useContext } from 'react';
import { GoogleLogin } from 'react-google-login';

const Login = () => {
  const { register, handleSubmit, errors } = useForm();
  const { setUser, setError } = useContext(UserContext);
  const history = useHistory();

  const onSubmit = async (userData) => {
    let result = await loginUser(userData);

    // handle error case
    // We expect always the backend to give us an error in THIS structure:
    // { error: { message: 'Something went wrong' } }
    if (result.error) {
      return setError(result.error); // forward API error to our central context
    }

    // handle success case
    setError({}); // clear error in context
    setUser(result); // store received user in context
    history.push('/dashboard'); // forward to protected resource
  };

  const responseGoogle = async (response) => {
    const { email, familyName, givenName, googleId } = response.profileObj;
    const data = {
      email,
      googleId,
      firstName: givenName,
      lastName: familyName,
    };

    let result = await googleLoginUser(data);

    if (result.error) {
      return setError(result.error); // forward API error to our central context
    }

    // handle success case
    setError({}); // clear error in context
    setUser(result); // store received user in context
    history.push('/dashboard'); // forward to protected resource
  };

  return (
    <div className='auth-container'>
      <section>
        <h3>Log In</h3>
        <GoogleLogin
          clientId='506337378250-qfh9nvnvcsabbopleft6dro5d98p032p.apps.googleusercontent.com'
          buttonText='Login'
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy={'single_host_origin'}
        />
        <div className='seperator'>
          <p>OR</p>
        </div>
        <form autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
          <div className='info'>
            <label>email</label>
            <input
              name='email'
              defaultValue='steve@steve.steve'
              ref={register({
                required: 'Required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'invalid email address',
                },
              })}
            />
            <div className='error-message'>
              {errors.email && <span>{errors.email.message}</span>}
            </div>

            <label>password</label>

            <input
              name='password'
              defaultValue='Fbw36123123!!!'
              type='password'
              ref={register({
                required: 'Required',
                minLength: {
                  value: 5,
                  message: 'PW should have min length of 5',
                },
              })}
            />
            <div className='error-message'>
              {errors.password && <span>{errors.password.message}</span>}
            </div>
          </div>

          <div className='submit'>
            <input type='submit' />
          </div>
        </form>
      </section>
    </div>
  );
};

export default Login;
