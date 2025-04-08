import React, { useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, InputAdornment } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import EmailIcon from '@material-ui/icons/Email';
import LockIcon from '@material-ui/icons/Lock';
import { signUpService } from '../../services/index';

const useStyles = makeStyles((theme) => ({
  container: {
    maxWidth: '400px',
    margin: 'auto',
    padding: theme.spacing(3),
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    textAlign: 'center',
    marginBottom: theme.spacing(3),
    color: theme.palette.primary.main,
    fontWeight: 'bold',
  },
  formGroup: {
    marginBottom: theme.spacing(2),
  },
  errorMessage: {
    color: theme.palette.error.main,
    fontSize: '0.85rem',
    marginTop: theme.spacing(0.5),
  },
  submitButton: {
    width: '100%',
    padding: theme.spacing(1.5),
    marginTop: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}));

export default function SignUp() {
  const classes = useStyles();
  const navigate = useNavigate();

  const loginRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const [loginError, setLoginError] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateInputs()) {
      
      const dataObject = {
        email: emailRef.current.value,
        login: loginRef.current.value,
        password: passwordRef.current.value,
      };
      try {
        await signUpService(dataObject);
        navigate("/login");
      } catch (err) {
        console.error(err);
      }
    }
  };

  const validateInputs = () => {
    const login = loginRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    let isValid = true;

    if (!login || login.length < 3) {
      setLoginError(true);
      setLoginErrorMessage('Please enter a valid login (at least 3 characters).');
      isValid = false;
    } else {
      setLoginError(false);
      setLoginErrorMessage('');
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  return (
    <div className={classes.container}>
      <Typography variant="h5" className={classes.heading}>
        Регистрация
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box className={classes.formGroup}>
          <TextField
            type="text"
            id="login"
            name="login"
            label="Логин"
            variant="outlined"
            inputRef={loginRef}
            error={loginError}
            helperText={loginError ? loginErrorMessage : ''}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box className={classes.formGroup}>
          <TextField
            type="email"
            id="email"
            name="email"
            label="Электронная почта"
            variant="outlined"
            inputRef={emailRef}
            error={emailError}
            helperText={emailError ? emailErrorMessage : ''}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box className={classes.formGroup}>
          <TextField
            type="password"
            id="password"
            name="password"
            label="Пароль"
            variant="outlined"
            inputRef={passwordRef}
            error={passwordError}
            helperText={passwordError ? passwordErrorMessage : ''}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Button type="submit" variant="contained" className={classes.submitButton}>
          Зарегистрироваться
        </Button>
      </form>
    </div>
  );
}
