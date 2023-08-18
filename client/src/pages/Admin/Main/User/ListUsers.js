import React, { useEffect, useState } from 'react'
import styles from "./ListUsers.module.scss"
import axios from 'axios'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import DoDisturbOnRoundedIcon from '@mui/icons-material/DoDisturbOnRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ModeEditRoundedIcon from '@mui/icons-material/ModeEditRounded';
import { Dialog } from '@mui/material';
import { Link } from 'react-router-dom';

const ListUsers = ({handleOpenAlert, changeAlertValues}) => {
  const [users, setUsers] = useState()

  const [dialogOpened, setDialogOpened] = useState(false)
  const [userToDelete, setUserToDelete] = useState("")

  const fetchUsers = async () => {
    const usersRaw = await axios.get('/user')
    setUsers(usersRaw.data)
  }

  useEffect(() => {
    fetchUsers();
  }, [])

  const dialogApears = (user_id) => {
    setUserToDelete(user_id)
    setDialogOpened(true)
  }

  const deletionComplete = () => {
    setUserToDelete("")
    setDialogOpened(false)
  }


  const deleteUser = async () => {
    try {
      await axios.delete(`/user/${userToDelete}`)
      handleOpenAlert()
      changeAlertValues('success', 'Utilisateur supprimé')
      fetchUsers();
      deletionComplete();
    }
    catch (err) {
      handleOpenAlert()
      changeAlertValues('error', err)
    }
  
  }

  return (
    <div className={styles.container}>
      <h2>Liste des utilisateurs</h2>
      <Link to="/admin/user/new" style={{textDecoration: "none"}}>
        <Button variant='contained' color='success' sx={{display: 'flex', margin: '10px 0 20px auto'}}>Ajouter un utilisateur</Button>
      </Link>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{fontWeight: 'bold'}}>Prénom Nom</TableCell>
              <TableCell sx={{fontWeight: 'bold'}}>Email</TableCell>
              <TableCell sx={{fontWeight: 'bold'}}>Date d'arrivée</TableCell>
              <TableCell sx={{fontWeight: 'bold'}}>Date de départ</TableCell>
              <TableCell sx={{fontWeight: 'bold'}}>Roles</TableCell>
              <TableCell sx={{fontWeight: 'bold'}}>Compte valide ?</TableCell>
              <TableCell sx={{fontWeight: 'bold'}}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users?.map((item, index) => (
              <TableRow key={index}>
                <TableCell sx={{filter: !item.valid ? "opacity(50%)" : ""}}>{item.firstname} {item.lastname}</TableCell>
                <TableCell sx={{filter: !item.valid ? "opacity(50%)" : ""}}>{item.email}</TableCell>
                <TableCell sx={{filter: !item.valid ? "opacity(50%)" : ""}}>{item.joiningDate === null ? "-" : new Date(item.joiningDate).toLocaleDateString('fr-FR')}</TableCell>
                <TableCell sx={{filter: !item.valid ? "opacity(50%)" : ""}}>{item.leavingDate === null ? "-" : new Date(item.leavingDate).toLocaleDateString('fr-FR')}</TableCell>
                <TableCell sx={{filter: !item.valid ? "opacity(50%)" : ""}}>{item.roles[0]} {item.roles[1]} {item.roles[2]}</TableCell>
                <TableCell sx={{filter: !item.valid ? "opacity(50%)" : ""}}>{item.valid === true ? <VerifiedRoundedIcon color='success'/> : <DoDisturbOnRoundedIcon color='error'/>}</TableCell>
                <TableCell>
                  <ButtonGroup variant="contained">
                    <Link to={`/admin/user/page/${item._id}`}>
                      <Button>
                          <ModeEditRoundedIcon/>
                      </Button>
                    </Link>
                    {/* <Button color='action'>
                      {!item.valid === true ? 
                        <VerifiedRoundedIcon color='success'/>
                      :
                        <DoDisturbOnRoundedIcon color='error'/>
                      }
                    </Button> */}
                    <Button color='error' onClick={() => dialogApears(item._id)}><DeleteForeverRoundedIcon/></Button>
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className={styles.dialog_delete}>
        <Dialog
          open={dialogOpened}
          onClose={() => setDialogOpened(false)}
        >
          <div style={{padding: "50px"}}>
            <div>
              Vous allez supprimer définitivement l'utilisateur "{users?.filter((us) => us._id === userToDelete)[0]?.firstname} {users?.filter((us) => us._id === userToDelete)[0]?.lastname}", confirmez vous ?
            </div>
            <div style={{margin: "20px 0 0 auto"}}>
              <ButtonGroup sx={{width: '100%'}}>
                <Button variant='outlined' sx={{width: '50%'}} color="primary" onClick={() => deletionComplete()}>Annuler</Button>
                <Button variant='contained' sx={{width: '50%'}} color="error" onClick={() => deleteUser()}>Supprimer</Button>
              </ButtonGroup>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
}

export default ListUsers;
