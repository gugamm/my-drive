import React, { useCallback, useRef } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Avatar from '@material-ui/core/Avatar'
import Grid from '@material-ui/core/Grid'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'

const useStyles = makeStyles({
  container: {
    marginTop: 48,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 400,
    margin: 'auto'
  },
  lockIcon: {
    margin: 'auto',
    marginBottom: 8
  },
  form: {
    marginTop: 16
  },
  signInButton: {
    marginTop: 16
  },
  forgotPassword: {
    marginTop: 8,
    textAlign: 'right'
  }
})

export const Login: React.FC = () => {
  const classes = useStyles()
  const history = useHistory()
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  const handleSubmit = useCallback((event: any) => {
    event.preventDefault()

    const email = emailRef.current?.value
    const password = passwordRef.current?.value

    console.log(`Email: ${email}`)
    console.log(`Password: ${password}`)

    history.push('/drive')
  }, [emailRef, passwordRef, history])

  return (
    <div className={classes.container}>
      <Avatar className={classes.lockIcon}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography variant='h5' align='center'>Sign in</Typography>
      <form autoComplete='off' className={classes.form} onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField 
              id="username-field"
              label="Email Address"
              fullWidth
              required
              inputRef={emailRef}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField 
              id="password-field"
              label="Password"
              fullWidth
              required
              inputRef={passwordRef}
              type='password'
              variant="outlined"
            />
          </Grid>
        </Grid>
        <div className={classes.forgotPassword}>
          <Link to='/forgot-password'>Forgot your password?</Link>
        </div>
        <Button fullWidth type='submit' variant='contained' color='primary' className={classes.signInButton}>
          Sign in
        </Button>
      </form>
    </div>
  )
}