import React, { useCallback, useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import Modal from '@material-ui/core/Modal'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import CloseIcon from '@material-ui/icons/Close'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import RemoveIcon from '@material-ui/icons/Remove'
import { useDropzone } from 'react-dropzone'

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
  dropzone: {
    padding: 16,
    border: '1px dashed black',
    cursor: 'pointer'
  },
  uploadButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 8
  },
  filePreviewContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4
  }
})

export interface UploadFileModalProps {
  open: boolean,
  onClose: () => void
}
export const UploadFileModal: React.FC<UploadFileModalProps> = (props) => {
  const classes = useStyles()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setSelectedFile(acceptedFiles[0])
  }, [])

  const removeFile = useCallback(() => {
    setSelectedFile(null)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <Modal {...props}>
      <Paper className={classes.modal}>
        <div className={classes.titleContainer}>
          <Typography variant='h5'>Upload file</Typography>
          <IconButton aria-label='close' onClick={props.onClose}>
            <CloseIcon />
          </IconButton>
        </div>
        {!selectedFile && (
          <div {...getRootProps({ className: classes.dropzone })} style={isDragActive ? ({ borderColor: 'blue' }) : undefined}>
             <input {...getInputProps()} />
             {
               isDragActive ?
                 <p>Drop the file here...</p> :
                 <p>Drag 'n' drop the file here, or click to select</p>
             }
          </div>
        )}
        {selectedFile && (
          <div className={classes.filePreviewContainer}>
            <span>{selectedFile.name} - {selectedFile.size} bytes</span>
            <IconButton aria-label='remove' style={{ padding: 4 }} onClick={removeFile}>
              <RemoveIcon />
            </IconButton>
          </div>
        )}
        <div className={classes.uploadButtonContainer}>
          <Button startIcon={<CloudUploadIcon />} variant='contained' color='primary' disabled={!selectedFile}>upload</Button>
        </div>
      </Paper>
    </Modal>
  )
}
