import { useContext, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { signUpUser } from '../helpers/apiCalls';
import { UserContext } from '../context/UserContext';
import { useHistory } from 'react-router-dom';

const SignUp = () => {
  const { register, handleSubmit, errors, watch } = useForm();
  const { setUser, setError } = useContext(UserContext);
  const history = useHistory();

  let password = useRef({}); // setup a ref, that will track a form field
  password = watch('password', ''); // track the password field (for confirmation check)

  const onSubmit = async (data) => {
    let res = await signUpUser(data);
    if (res.error) {
      return setError(res.error); // forward API error to our central context
    }

    // handle success case
    setError({}); // clear error in context
    setUser(res); // store received user in context
    history.push('/dashboard'); // forward to protected resource
  };

  return (
    <div className='auth-container'>
      <section>
        <h3>Sign Up</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='info'>
            <label>First name</label>
            <input
              name='firstName'
              defaultValue='Noel'
              ref={register({
                required: true,
              })}
            />
            <div className='error-message'>
              {errors.firstName && <span>Please put your name sir.</span>}
            </div>

            <label>Last name</label>
            <input
              name='lastName'
              defaultValue='Fielding'
              ref={register({
                required: true,
              })}
            />
            <div className='error-message'>
              {errors.lastName && <span>Please put your lastname sir.</span>}
            </div>

            <label>Username</label>
            <input
              name='username'
              defaultValue='Richmond'
              ref={register({
                required: true,
              })}
            />
            <div className='error-message'>
              {errors.userName && <span>Please put your username sir.</span>}
            </div>

            <label>Email</label>
            <input
              name='email'
              defaultValue='test@gmail.com'
              ref={register({
                required: true,
              })}
            />
            <div className='error-message'>
              {errors.email && <span>Please put your email sir.</span>}
            </div>

            <label>Password</label>
            <input
              name='password'
              defaultValue='Fbw36123123!!!'
              type='password'
              ref={register({
                required: true,
                minLength: {
                  value: 5,
                  message: 'This shitty password needs to have min 5 characters!',
                },
              })}
            />
            <div className='error-message'>
              {errors.password && <span>{errors.password.message}</span>}
            </div>

            <label>Repeat password</label>
            <input
              name='password_repeat'
              type='password'
              defaultValue='Fbw36123123!!!'
              ref={register({
                validate: (value) => value === password || 'The passwords do not match',
              })}
            />
            <div className='error-message'>
              {errors.password_repeat && <p>{errors.password_repeat.message}</p>}
            </div>
          </div>
          <div className='submit'>
            <input type='submit' value='Signup' />
          </div>
        </form>
      </section>
    </div>
  );
};

export default SignUp;
