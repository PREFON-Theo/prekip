import React, { useEffect, useState } from 'react'
import style from "./EditHomeLinks.module.scss"
import axios from 'axios'
import SortableList, { SortableItem } from "react-easy-sort";
import { arrayMoveImmutable } from "array-move";
import './EditHomeLinks.css'
import { Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import EditRoundedIcon from '@mui/icons-material/EditRounded';

import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';


const EditHomeLinks = () => {
  const [links, setLinks] = useState()
  const [linkToChange, setLinkToChange] = useState({
    _id: '',
    text: '',
    link: ''
  })
  const [dialogOpenned, setDialogOpenned] = useState(false)

  const fetchDataLink = async () => {
    const LinkRaw = await axios
      .get('/homelink')
    setLinks(LinkRaw.data)
    console.log(LinkRaw.data)
  }

  useEffect(() => {
    fetchDataLink();
  }, [])

  useEffect(() =>{
    if(links !== undefined){
      console.log(links)
    }
  }, [links])


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
      }).then((res) => console.log(res))
    ))
  }

  const setupLinkEdition = (linkValue) => {
    setDialogOpenned(true)
    setLinkToChange(linkValue)
  }

  const editOneLink = async () => {
    try {
      await axios.patch(`/homelink/${linkToChange._id}`, {
        text: linkToChange.text,
        link: linkToChange.link
      })
      console.log('first')
      fetchDataLink();
      setDialogOpenned(false);
    }
    catch (err) {
      console.log(err)
    }
  }

  return (
    <>
    <Dialog
      open={dialogOpenned}
      onClose={() => setDialogOpenned(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
          Edition du lien {linkToChange.text}
        </DialogTitle>
        <DialogContent sx={{paddingTop: '20px !important', display: 'flex', flexDirection: 'column'}}>
          <TextField sx={{margin: '10px 0'}} value={linkToChange.text} label="Texte affiché" variant="outlined" onChange={e => setLinkToChange((prev) => ({...prev, text: e.target.value}))}/>
          <TextField sx={{margin: '10px 0'}} value={linkToChange.link} label="Lien" variant="outlined" onChange={e => setLinkToChange((prev) => ({...prev, link: e.target.value}))}/>
        </DialogContent>
        <DialogActions sx={{padding: "20px"}}>
          <Button variant='contained' color='warning' onClick={editOneLink}>Modifier</Button>
        </DialogActions>
    </Dialog>

    <div className={style.container}>
      <h2>Organisez l'ordre d'affichage des liens</h2>
      <SortableList
        onSortEnd={onSortEnd}
        className="list_dragg"
        draggedItemClassName="dragged"
      >
        {links?.map((item, index) => (
          <SortableItem key={index}>
            <div className="item_dragg">
              <div></div>
              <div>{item.text}</div>
              <div onClick={() => setupLinkEdition(item)}><EditRoundedIcon/></div>
            </div>
          </SortableItem>
        ))}
      </SortableList>
      <Button variant='contained' color='warning' onClick={() => handleEditOrder()}>Enregister</Button>
    </div>
    </>
  )
}

export default EditHomeLinks