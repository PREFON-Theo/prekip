import React, { useContext, useEffect, useState } from 'react'
import styles from "./EditHomeLinks.module.scss"
import axios from 'axios'
import SortableList, { SortableItem } from "react-easy-sort";
import { arrayMoveImmutable } from "array-move";
import './EditHomeLinks.css'
import { Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import EditRoundedIcon from '@mui/icons-material/EditRounded';

import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import { UserContext } from '../../../../../../utils/Context/UserContext/UserContext';
import { Navigate } from 'react-router-dom';

const EditHomeLinks = ({handleOpenAlert, changeAlertValues}) => {
  const {user, ready} = useContext(UserContext);
  const [links, setLinks] = useState();
  const [linkToChange, setLinkToChange] = useState({
    _id: '',
    text: '',
    link: ''
  });
  const [dialogOpenned, setDialogOpenned] = useState(false);
  const [mode, setMode] = useState('')

  const fetchDataLink = async () => {
    const LinkRaw = await axios
      .get('/homelink')
    setLinks(LinkRaw.data)
  }

  useEffect(() => {
    fetchDataLink();
  }, [])



  const onSortEnd = (oldIndex, newIndex) => {
    const updatedLinks = links.map((item, index) => 
      index === oldIndex ? 
        item = {...item, place: newIndex+1} 
      : index === newIndex ?
      item = {...item, place: oldIndex+1}
      : item 

    )
    setLinks(updatedLinks)
    setLinks((array) => arrayMoveImmutable(array, oldIndex, newIndex));
  };

  const handleEditOrder = () => {
    links.map((item) => (
      axios.patch(`/homelink/${item._id}`, { 
        place: item.place
      }).then(() => {
        handleOpenAlert()
        changeAlertValues('success', "Modification de l'ordre réussi")
      })
    ))
  }

  const openDialog = (type) => {
    setMode(type)
    if(type === 'edit'){
      setupLinkEdition();
    }
    else if (type === 'new'){
      setupLinkAddition()
    }
  }

  const setupLinkEdition = (linkValue) => {
    setDialogOpenned(true)
    setLinkToChange(linkValue)
  }

  const setupLinkAddition = () => {
    setDialogOpenned(true)
  }

  const editOneLink = async () => {
    try {
      await axios.patch(`/homelink/${linkToChange._id}`, {
        text: linkToChange.text,
        link: linkToChange.link
      })
      handleOpenAlert()
      changeAlertValues('success', "Modification du lien réussi")
      fetchDataLink();
      setDialogOpenned(false);
    }
    catch (err) {
      console.log(err)
    }
  }

  const addOneLink = async () => {
    try {
      await axios.post(`/homelink`, {
        text: linkToChange.text,
        link: linkToChange.link,
        place: links.length + 1
      })
      handleOpenAlert()
      changeAlertValues('success', "Ajout d'un nouveau lien réussi")
      fetchDataLink();
      setDialogOpenned(false);
    }
    catch (err) {
      console.log(err)
    }
  }

  const deleteLink = async (id) => {
    try {
      await axios.delete(`/homelink/${id}`)
      handleOpenAlert()
      changeAlertValues('success', "Lien supprimé")
      fetchDataLink();
    }
    catch (err) {
      console.log(err)
    }
  }

  return (
    <>
    {
      ready === "waiting" 
      ?
        <>Chargement...</>
      :
        !user?.roles.includes("Administrateur") && !user?.roles.includes("Modérateur")
        ?
          <Navigate to={'/'}/>
        :
          <>
            <Dialog
              open={dialogOpenned}
              onClose={() => setDialogOpenned(false)}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <div className={styles.container_dialog}>
                { 
                mode === 'edit' ? 
                  <h1>
                      Edition du lien {linkToChange?.text}
                  </h1>
                :
                  <h1>
                      Edition du lien {linkToChange?.text}
                  </h1>
                }
                <div className={styles.container_inputs}>
                  <div className={styles.input_mail}>
                    <TextField sx={{margin: '10px 0'}} value={linkToChange?.text} label="Texte affiché" variant="outlined" onChange={e => setLinkToChange((prev) => ({...prev, text: e.target.value}))}/>        
                  </div>
                  <div className={styles.input_password}>
                    <TextField sx={{margin: '10px 0'}} value={linkToChange?.link} label="Lien" variant="outlined" onChange={e => setLinkToChange((prev) => ({...prev, link: e.target.value}))}/>
                  </div>
                  <div className={styles.button}>
                    {mode === 'edit' ? 
                      <Button variant='contained' color='warning' onClick={editOneLink}>Modifier</Button>
                    :
                      <Button variant='contained' color='success' onClick={addOneLink}>Ajouter</Button>
                    }
                  </div>
                </div>
              </div>
            </Dialog>

            <div className={styles.container}>
              <div className={styles.title}>
                <h2>Organisez l'ordre d'affichage des liens</h2>
                <Button variant='contained' color='success' onClick={() => openDialog('new')}>Ajouter un lien</Button>
              </div>

              <SortableList
                onSortEnd={onSortEnd}
                className="list_dragg"
                draggedItemClassName="dragged"
              >
                {links?.length === 0 ?
                  "Il n'y a pas de lien, ajoutez-en"
                :
                  links?.map((item, index) => (
                    <SortableItem key={index}>
                      <div className="item_dragg">
                        <div></div>
                        <div>{item.text}</div>
                        <div>
                          <div onClick={() => openDialog('edit')}><EditRoundedIcon/></div>
                          <div onClick={() => deleteLink(item._id)}><DeleteForeverRoundedIcon color='error'/></div>
                        </div>
                      </div>
                    </SortableItem>
                  ))
                }
              </SortableList>
              <Button variant='contained' color='warning' onClick={() => handleEditOrder()}>Enregister</Button>
            </div>
          </>
    }
    </>
  )
}

export default EditHomeLinks