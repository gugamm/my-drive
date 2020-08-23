import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import MUAppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
// import Button from '@material-ui/core/Button'

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  }
}))

export const AppBar: React.FC = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <MUAppBar position='static'>
        <Toolbar>
          <Typography variant='h6' className={classes.title}>
            MyDrive
          </Typography>
          {/*<Button color='inherit'>Login</Button>*/}
        </Toolbar>
      </MUAppBar>
    </div>
  )
}
