import React, { Fragment, useState } from "react";
import { Link } from 'react-router-dom';
//import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    });

    const { name, email, password, password2 } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        if (password !== password2) console.log('Passwords do not match');
        else { 
            // const newUser = {    // this is an example how to hit backend routes with axios
            //     name,email,password
            // }

            // const config = {
            //     headers: {
            //         'Content-Type':'application/json'
            //     }
            // }

            // const body = JSON.stringify(newUser);

            // try {
            //     const res = await axios.post('/api/users/register',body,config);
            //     console.log(res.data);
            // } catch (error) {
            //     console.log(error);
            // }
            console.log('SUCESS');
        }
    }
    return (
        <Fragment>
            <h1 className='large text-primary'>Register</h1>
            <p className='lead'>
                <i className='fas fa-user'></i> Create Your Account
               </p>
            <form className='form' onSubmit={e => onSubmit(e)} >
                <div className='form-group'>
                    <input
                        type='text'
                        placeholder='Name'
                        name='name'
                        value={name}
                        onChange={e => onChange(e)}

                        required
                    />
                </div>
                <div className='form-group'>
                    <input
                        type='email'
                        placeholder='Email Address'
                        name='email'
                        value={email}
                        onChange={e => onChange(e)}
                        required
                    />
                </div>
                <div className='form-group'>
                    <input
                        type='password'
                        placeholder='Password'
                        name='password'
                        minLength='6'
                        value={password}
                        onChange={e => onChange(e)}
                        required
                    />
                </div>
                <div className='form-group'>
                    <input
                        type='password'
                        placeholder='Confirm Password'
                        name='password2'
                        minLength='6'
                        value={password2}
                        onChange={e => onChange(e)}
                        required
                    />
                </div>
                <input
                    type='submit'
                    className='btn btn-primary'
                    value='Register'
                />
            </form>
            <p className='my-1'>
                Already have an account? <Link to='/login'>Login</Link>
            </p>
        </Fragment>
    );
};

export default Register;
