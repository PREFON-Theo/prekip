import React, { useContext, useEffect, useState } from 'react'
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

import ModeEditRoundedIcon from '@mui/icons-material/ModeEditRounded';

import Pagination from '@mui/material/Pagination';
import { UserContext } from '../../../../../utils/Context/UserContext/UserContext';

const nbItemPerPage = 10;

const ListRubriqueType = ({handleOpenAlert, changeAlertValues}) => {
  const {cookies} = useContext(UserContext)
  const [rubriqueTypes, setRubriqueTypes] = useState()

  const [dialogOpened, setDialogOpened] = useState(false)
  const [rubriqueToDelete, setRubriqueToDelete] = useState("")

  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(0)

  const fetchRubriques = async () => {
    const rubriqueTypeRaw = await axios.get('/rubrique-type', {headers: {jwt: cookies.token}})
    setRubriqueTypes(rubriqueTypeRaw.data)
    setMaxPage(Math.ceil(rubriqueTypeRaw.data?.length / 10 || 0))
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
      await axios.delete(`/rubrique-type/${rubriqueToDelete}`, {headers: {jwt: cookies.token}})
      handleOpenAlert()
      changeAlertValues('success', 'Rubrique supprimé')
      fetchRubriques();
      deletionComplete();
    }
    catch (err) {
      //handleOpenAlert()
      //changeAlertValues('error', err)
      console.log(err)
    }
  
  }

  const handleChangePage = (event, value) => {
    setPage(value)
  }

  return (
    <div className={styles.container}>
      <h2>Liste des rubriques</h2>
      <Link to="/admin/rubrique-type/new" style={{textDecoration: "none", color: "white", display: "contents"}}>
        <Button variant='contained' color='success' sx={{display: 'flex', margin: '10px 0 20px auto'}}>
          Ajouter une rubrique
        </Button>
      </Link>
      <TableContainer>
        <Table sx={{ minWidth: 'auto' }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{fontWeight: 'bold'}}>Titre</TableCell>
              <TableCell sx={{fontWeight: 'bold'}} className={styles.semi_width_first}>Description</TableCell>
              <TableCell sx={{fontWeight: 'bold'}} className={styles.semi_width_second}>Lien</TableCell>
              <TableCell sx={{fontWeight: 'bold'}} className={styles.semi_width_second}>Rubrique parente</TableCell>
              <TableCell sx={{fontWeight: 'bold'}} className={styles.semi_width_first}>Lien du l'image</TableCell>
              <TableCell sx={{fontWeight: 'bold'}}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              !!rubriqueTypes
              ?
              rubriqueTypes?.slice((page-1)*nbItemPerPage, page*nbItemPerPage).map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.title?.length > 25 ? `${item.title.substring(0,25)}...` : item.title?.length === 0 ? "-" : item.title}</TableCell>
                  <TableCell className={styles.semi_width_first}>{item.description?.length > 25 ? `${item.description.substring(0,25)}...` : item.description?.length === 0 ? "-" : item.description}</TableCell>
                  <TableCell className={styles.semi_width_second}>{item.link}</TableCell>
                  <TableCell className={styles.semi_width_second}>{item.parent === "" ? "-" : rubriqueTypes?.filter((rt) => rt._id === item.parent)[0]?.title === undefined ? <span style={{fontStyle: 'italic'}}>Non disponible</span> : rubriqueTypes?.filter((rt) => rt._id === item.parent)[0]?.title}</TableCell>
                  <TableCell className={styles.semi_width_first}>{item.imgLink === undefined || item.imgLink === "" ? "-" : <a href={item.imgLink} target='_blank'>{item.imgLink.length > 20 ? `${item.imgLink.substring(0,20)}...`  : item.imgLink}</a>}</TableCell>
                  <TableCell>
                    <Link to={`/rubrique/${item.link}`}>
                      <Button variant='contained' color="warning" sx={{margin: '10px'}}>
                        <ArrowForwardRoundedIcon/>
                      </Button>
                    </Link>
                    <Link to={`/admin/rubrique/edit/${item._id}`}>
                      <Button variant='contained' color="primary" sx={{margin: '10px'}}>
                        <ModeEditRoundedIcon/>
                      </Button>
                    </Link>
                    <Button color='error' sx={{margin: '10px'}} variant="contained" onClick={() => dialogApears(item._id)}><DeleteForeverRoundedIcon/></Button>
                  </TableCell>
                </TableRow>
              ))
              :
              <TableRow><TableCell>Aucune rubrique disponible...</TableCell></TableRow>
            }
          </TableBody>
        </Table>
      </TableContainer>
      <div className={styles.pagination}>
        <Pagination count={maxPage} color="primary" value={page} onChange={handleChangePage}/> 
      </div>

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