import React, { useEffect, useState } from 'react'
import styles from "./ListRubriqueType.module.scss"
import axios from 'axios'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { Dialog } from '@mui/material';
import { Link } from 'react-router-dom';

const ListRubriqueType = ({handleOpenAlert, changeAlertValues}) => {
  const [rubriqueTypes, setRubriqueTypes] = useState()

  const [dialogOpened, setDialogOpened] = useState(false)
  const [rubriqueToDelete, setRubriqueToDelete] = useState("")

  const fetchRubriques = async () => {
    const rubriqueTypeRaw = await axios.get('/rubrique-type')
    setRubriqueTypes(rubriqueTypeRaw.data)
  }

  useEffect(() => {
    fetchRubriques();
  }, [])

  const dialogApears = (rubrique_id) => {
    setRubriqueToDelete(rubrique_id)
    setDialogOpened(true)
  }

  const deletionComplete = () => {
    setRubriqueToDelete("")
    setDialogOpened(false)
  }


  const deleteContent = async () => {
    try {
      await axios.delete(`/rubrique-type/${rubriqueToDelete}`)
      handleOpenAlert()
      changeAlertValues('success', 'Rubrique supprimé')
      fetchRubriques();
      deletionComplete();
    }
    catch (err) {
      handleOpenAlert()
      changeAlertValues('error', err)
    }
  
  }

  return (
    <div className={styles.container}>
      <h2>Liste des rubriques</h2>
      <Link to="/admin/rubrique-type/new" style={{textDecoration: "none"}}>
        <Button variant='contained' color='success' sx={{display: 'flex', margin: '10px 0 20px auto'}}>Ajouter une rubrique</Button>
      </Link>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{fontWeight: 'bold'}}>Titre</TableCell>
              <TableCell sx={{fontWeight: 'bold'}}>Description</TableCell>
              <TableCell sx={{fontWeight: 'bold'}}>Lien</TableCell>
              <TableCell sx={{fontWeight: 'bold'}}>Rubrique parente</TableCell>
              <TableCell sx={{fontWeight: 'bold'}}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rubriqueTypes?.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.title?.length > 25 ? `${item.title.substring(0,25)}...` : item.title?.length === 0 ? "-" : item.title}</TableCell>
                <TableCell>{item.description?.length > 25 ? `${item.description.substring(0,25)}...` : item.description?.length === 0 ? "-" : item.description}</TableCell>
                <TableCell>{item.link}</TableCell>
                <TableCell>{item.parent === "" ? "-" : rubriqueTypes?.filter((rt) => rt._id === item.parent)[0]?.title === undefined ? <span style={{fontStyle: 'italic'}}>Non disponible</span> : rubriqueTypes?.filter((rt) => rt._id === item.parent)[0]?.title}</TableCell>
                <TableCell>
                  <ButtonGroup variant="contained">
                    <Link to={`/rubrique/${item.title}`}>
                      <Button variant='contained' color="warning">
                        <ArrowForwardRoundedIcon/>
                      </Button>
                    </Link>
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
              Vous allez supprimer définitivement le rubrique "{rubriqueTypes?.filter((us) => us._id === rubriqueToDelete)[0]?.title}", confirmez vous ?
            </div>
            <div style={{margin: "20px 0 0 auto"}}>
              <ButtonGroup sx={{width: '100%'}}>
                <Button variant='outlined' sx={{width: '50%'}} onClick={() => deletionComplete()}>Annuler</Button>
                <Button variant='contained' autoFocus sx={{width: '50%'}} color="error" onClick={() => deleteContent()}>Supprimer</Button>
              </ButtonGroup>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
}

export default ListRubriqueType;