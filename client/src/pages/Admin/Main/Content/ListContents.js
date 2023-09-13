import React, { useEffect, useState, useContext } from 'react'
import styles from "./ListContents.module.scss"
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

import { UserContext } from '../../../../utils/Context/UserContext/UserContext';

import Pagination from '@mui/material/Pagination';

const nbItemPerPage = 10;

const ListContents = ({handleOpenAlert, changeAlertValues}) => {
  const {cookies} = useContext(UserContext)
  const [articles, setArticles] = useState()
  const [categories, setCategories] = useState()
  const [users, setUsers] = useState()

  const [dialogOpened, setDialogOpened] = useState(false)
  const [articleToDelete, setArticleToDelete] = useState("")

  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(0)

  const fetchArticles = async () => {
    const articlesRaw = await axios.get('/article', {headers: {jwt: cookies.token}})
    setArticles(articlesRaw.data)
    setMaxPage(Math.ceil(articlesRaw.data?.length / 10))
  }

  const fetchCategories = async () => {
    const categoriesRaw = await axios.get('/rubrique-type')
    setCategories(categoriesRaw.data)
  }

  const fetchUsers = async () => {
    const usersRaw = await axios.get('/user', {headers: {jwt: cookies.token}})
    setUsers(usersRaw.data)
  }

  useEffect(() => {
    fetchArticles();
    fetchCategories();
    fetchUsers();
  }, [])

  const dialogApears = (article_id) => {
    setArticleToDelete(article_id)
    setDialogOpened(true)
  }

  const deletionComplete = () => {
    setArticleToDelete("")
    setDialogOpened(false)
  }

  const handleChangePage = (event, value) => {
    setPage(value)
  }

  const deleteContent = async () => {
    try {
      await axios.delete(`/article/${articleToDelete}`, {headers: {jwt: cookies.token}})
      await axios.delete(`/like/article/${articleToDelete}`, {headers: {jwt: cookies.token}})
      await axios.delete(`/comment/article/${articleToDelete}`, {headers: {jwt: cookies.token}})
      handleOpenAlert()
      changeAlertValues('success', 'Contenu supprimé')
      fetchArticles();
      deletionComplete();
    }
    catch (err) {
      handleOpenAlert()
      changeAlertValues('error', err)
    }
  
  }

  return (
    <div className={styles.container}>
      <h2>Liste des contenus</h2>
      <TableContainer>
        <Table sx={{ minWidth: 'auto' }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{fontWeight: 'bold'}}>Titre</TableCell>
              <TableCell sx={{fontWeight: 'bold'}} className={styles.semi_width_first}>Description</TableCell>
              <TableCell sx={{fontWeight: 'bold'}} className={styles.semi_width_second}>Date d'ajout</TableCell>
              <TableCell sx={{fontWeight: 'bold'}} className={styles.semi_width_first}>Catégorie</TableCell>
              <TableCell sx={{fontWeight: 'bold'}} className={styles.semi_width_second}>Créateur</TableCell>
              <TableCell sx={{fontWeight: 'bold'}} className={styles.semi_width_first}>Contient un fichier joint ?</TableCell>
              <TableCell sx={{fontWeight: 'bold'}} className={styles.semi_width_first}>Contenu important ?</TableCell>
              <TableCell sx={{fontWeight: 'bold'}}>Type de contenu</TableCell>
              <TableCell sx={{fontWeight: 'bold'}}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {articles?.slice((page-1)*nbItemPerPage, page*nbItemPerPage).map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.title?.length > 25 ? `${item.title.substring(0,25)}...` : item.title?.length === 0 ? "-" : item.title}</TableCell>
                <TableCell className={styles.semi_width_first}>{item.preview?.length > 25 ? `${item.preview.substring(0,25)}...` : item.preview?.length === 0 ? "-" : item.preview}</TableCell>
                <TableCell className={styles.semi_width_second}>{item.created_at === null ? "-" : new Date(item.created_at).toLocaleDateString('fr-FR')}</TableCell>
                <TableCell className={styles.semi_width_first}>{item.category === "" ? "-" : categories?.filter((cat) => cat._id === item.category)[0]?.title}</TableCell>
                <TableCell className={styles.semi_width_second}>
                  {item.author === "" 
                    ? "-" 
                    : `${users?.filter((usr) => usr._id === item.author)[0]?.firstname} ${users?.filter((usr) => usr._id === item.author)[0]?.lastname.charAt(0)}.`}
                    {/* : `${users?.filter((usr) => usr._id === item.author)[0]?.firstname} ${users?.filter((usr) => usr._id === item.author)[0]?.lastname}`} */}
                  </TableCell>
                <TableCell className={styles.semi_width_first}>{item.file !== "" ? "Oui" : "Non"}</TableCell>
                <TableCell className={styles.semi_width_first}>{item.important === true ? "Oui ": "Non" }</TableCell>
                <TableCell>{item.type === "actuality" ? "Actualité" : item.type === "reference" ? "Contenu de référence" : "Article"}</TableCell>
                <TableCell>
                  <Link to={`/${item.type}/${item._id}`} style={{margin: '10px'}}>
                    <Button variant='contained' color="warning">
                      <ArrowForwardRoundedIcon/>
                    </Button>
                  </Link>
                  <Button color='error' sx={{margin: '10px'}} variant="contained" onClick={() => dialogApears(item._id)}><DeleteForeverRoundedIcon/></Button>
                </TableCell>
              </TableRow>
            ))}
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
              Vous allez supprimer définitivement le contenu "{articles?.filter((us) => us._id === articleToDelete)[0]?.title}", confirmez vous ?
            </div>
            <div style={{margin: "20px 0 0 auto"}}>
              <ButtonGroup sx={{width: '100%'}}>
                <Button variant='outlined' sx={{width: '50%'}} onClick={() => deletionComplete()}>Annuler</Button>
                <Button variant='contained' sx={{width: '50%'}} color="error" onClick={() => deleteContent()}>Supprimer</Button>
              </ButtonGroup>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
}

export default ListContents;