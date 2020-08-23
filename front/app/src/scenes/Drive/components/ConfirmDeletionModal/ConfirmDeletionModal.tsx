import React from 'react'
import { makeStyles } from '@material-ui/styles'
import Modal from '@material-ui/core/Modal'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import CloseIcon from '@material-ui/icons/Close'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'

const useStyles = makeStyles({
  modal: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    position: 'absolute',
    padding: 16,
    width: 400
  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  createButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 8
  },
  bodyContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4
  }
})

export interface ConfirmDeletionModalProps {
  open: boolean,
  onClose: () => void
}
export const ConfirmDeletionModal: React.FC<ConfirmDeletionModalProps> = (props) => {
  const classes = useStyles()

  return (
    <Modal {...props}>
      <Paper className={classes.modal}>
        <div className={classes.titleContainer}>
          <Typography variant='h5'>Confirm deletion</Typography>
          <IconButton aria-label='close' onClick={props.onClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <div className={classes.bodyContainer}>
          <span>Delete <b>index.html</b>?</span>
        </div>
        <div className={classes.createButtonContainer}>
          <Button startIcon={<DeleteForeverIcon />} variant='contained' color='primary'>delete</Button>
        </div>
      </Paper>
    </Modal>
  )
}
