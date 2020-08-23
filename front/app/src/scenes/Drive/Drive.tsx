import React, { useState, useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import CloudDownload from '@material-ui/icons/CloudDownload'
import Delete from '@material-ui/icons/Delete'
import CloudUpload from '@material-ui/icons/CloudUpload'
import CreateNewFolder from '@material-ui/icons/CreateNewFolder'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import { UploadFileModal, CreateFolderModal, ConfirmDeletionModal } from './components'

const useStyles = makeStyles({
  title: {
    marginTop: 16
  },
  spaced: {
    marginBottom: 16
  }
})

export const Drive: React.FC = () => {
  const [uploadFileOpen, setUploadFileOpen] = useState<boolean>(false)
  const [createFolderOpen, setCreateFolderOpen] = useState<boolean>(false)
  const [confirmDeletionOpen, setConfirmDeletionOpen] = useState<boolean>(false)
  const classes = useStyles()

  const toggleUploadFileModal = useCallback(() => {
    setUploadFileOpen(!uploadFileOpen)
  }, [uploadFileOpen])

  const toggleCreateFolderModal = useCallback(() => {
    setCreateFolderOpen(!createFolderOpen)
  }, [createFolderOpen])

  const toggleConfirmDeletionModal = useCallback(() => {
    setConfirmDeletionOpen(!confirmDeletionOpen)
  }, [confirmDeletionOpen])

  return (
    <Container>
      <Typography variant='h4' className={clsx([classes.spaced, classes.title])}>Guga</Typography>

      <Breadcrumbs className={classes.spaced}>
        <Link>Home</Link>
        <Link>About</Link>
        <Link>Guga</Link>
      </Breadcrumbs>

      <Card className={classes.spaced}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <Typography variant='h6' align='center'>Files</Typography>
              <Typography variant='body1' align='center'>0</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant='h6' align='center'>Folders</Typography>
              <Typography variant='body1' align='center'>0</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant='h6' align='center'>Size</Typography>
              <Typography variant='body1' align='center'>0 Mb</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box justifyContent='flex-end' display='flex' className={classes.spaced}>
        <Button startIcon={<CloudUpload />} onClick={toggleUploadFileModal}>
          Upload file
        </Button>
        <UploadFileModal open={uploadFileOpen} onClose={toggleUploadFileModal} />
        <Button startIcon={<CreateNewFolder />} onClick={toggleCreateFolderModal}>
          Create folder
        </Button>
        <CreateFolderModal open={createFolderOpen} onClose={toggleCreateFolderModal} />
        <Button startIcon={<CreateNewFolder />} onClick={toggleConfirmDeletionModal}>
          Confirm deletion
        </Button>
        <ConfirmDeletionModal open={confirmDeletionOpen} onClose={toggleConfirmDeletionModal} />
      </Box>

      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Last modified</TableCell>
              <TableCell align="right">Size</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>about.html</TableCell>
              <TableCell align="right">Apr 27, 2020</TableCell>
              <TableCell align="right">1 MB</TableCell>
              <TableCell align="right">
                <IconButton>
                  <CloudDownload />
                </IconButton>
                <IconButton>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>about.html</TableCell>
              <TableCell align="right">Apr 27, 2020</TableCell>
              <TableCell align="right">1 MB</TableCell>
              <TableCell align="right">
                <IconButton>
                  <CloudDownload />
                </IconButton>
                <IconButton>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>about.html</TableCell>
              <TableCell align="right">Apr 27, 2020</TableCell>
              <TableCell align="right">1 MB</TableCell>
              <TableCell align="right">
                <IconButton>
                  <CloudDownload />
                </IconButton>
                <IconButton>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>about.html</TableCell>
              <TableCell align="right">Apr 27, 2020</TableCell>
              <TableCell align="right">1 MB</TableCell>
              <TableCell align="right">
                <IconButton>
                  <CloudDownload />
                </IconButton>
                <IconButton>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

    </Container>
  )
}