import React, { useContext, useEffect, useState } from 'react'
import styles from "./NewRubrique.module.scss"
import axios from 'axios';

import TextField from '@mui/material/TextField';
import { Button, Paper, Switch } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../../../../../utils/Context/UserContext/UserContext';


const NewRubrique = ({handleOpenAlert, changeAlertValues}) => {
  const {cookies} = useContext(UserContext)
  const [newRubrique, setNewRubrique] = useState({
    title: "",
    description: "",
    link: "",
    parent: "",
    imgLink: ""
  })
  const [redirection, setRedirection] = useState(false);
  const [rubriqueTypes, setRubriqueTypes] = useState()
  const [missingValue, setMissingValue] = useState(false)
  const [linkAlreadtExists, setLinkAlreadtExists] = useState(false)
  const [isParent, setIsParent] = useState(false)
  
  const fetchRubriques = async () => {
    const rubriquesRaw = await axios.get('/rubrique-type', {headers: {jwt: cookies.token}})
    setRubriqueTypes(rubriquesRaw.data)
  }

  useEffect(() => {
    fetchRubriques();
  },[])

  const handleSubmitForm = async () => {
    setLinkAlreadtExists(false)
    setMissingValue(false)
    if(
      newRubrique.title === "" 
      || newRubrique.description === "" 
      || newRubrique.link === "" || (newRubrique.parent === "" && isParent === false)
    ){
      setMissingValue(true)
 
    }
    else {
      if(isParent){
        newRubrique.parent = ""
      }
      try {
        await axios.post('/rubrique-type', {
          title: newRubrique.title,
          description: newRubrique.description,
          link: newRubrique.link,
          parent: newRubrique.parent,
          imgLink: newRubrique.imgLink
        }, {headers: {jwt: cookies.token}})
        handleOpenAlert()
        changeAlertValues('success', 'Rubrique créée')
        setRedirection(true)
      }
      catch (err) {
        if(err.response.data.error.code === 11000){
          setLinkAlreadtExists(true)
          handleOpenAlert()
          changeAlertValues('error', 'Erreur, le lien est déjà utilisé')
        }
        else {
          handleOpenAlert()
          changeAlertValues('error', 'Erreur lors de la création')
        }
      }      
      
    }
  }

  const handleChangeLink = (e) => {
    setNewRubrique(prev => ({...prev, link: e.target.value.replace(" ", "_")}))
  }

  return (
    <>
      {redirection ? <Navigate to={'/admin/rubrique-type/list'}/> : <></>}
      <div className={styles.container}>
        <div className={styles.box}>
          <h2>Nouvelle rubrique : </h2>

          {/* Titre */}
          <Paper elevation={2} sx={{marginBottom: '30px'}}>
            <TextField required value={newRubrique.title} sx={{width: '100%'}} label="Titre" variant="outlined" onChange={e => setNewRubrique(prev => ({...prev, title: e.target.value}))}/>
          </Paper>

          {/* Description */}
          <Paper elevation={2} sx={{marginBottom: '30px'}}>
            <TextField required value={newRubrique.description} sx={{width: '100%'}} label="Description" variant="outlined" onChange={e => setNewRubrique(prev => ({...prev, description: e.target.value}))}/>
          </Paper>

          {/* Lien */}
          <Paper elevation={2} sx={{marginBottom: '30px'}}>
            <TextField required value={newRubrique.link} sx={{width: '100%'}} label="Lien" variant="outlined" onChange={(e) => handleChangeLink(e)}/>
          </Paper>
          {
            linkAlreadtExists ?
              <div style={{margin: "20px 0", color: "red"}}>
                Le lien est déjà utilisé, veuillez renseigner un lien qui n'existe pas
              </div>
            :
              <></>
          }


          {/* Lien de l'image*/}
          <Paper elevation={2} sx={{marginBottom: '30px'}}>
            <TextField required value={newRubrique.imgLink} sx={{width: '100%'}} label="URL de l'image" variant="outlined" onChange={e => setNewRubrique(prev => ({...prev, imgLink: e.target.value}))}/>
          </Paper>

          {/* Valid */}
          <FormControlLabel
            control={<Switch value={isParent} onChange={(e) => setIsParent(!isParent)}/>} label={`Rubrique parent ? : ${isParent === true ? "Oui" : "Non"}`}
          />

          {isParent ?
            <></>
          :
            <Paper elevation={2} sx={{marginBottom: '40px'}}>
              <FormControl fullWidth>
                <InputLabel id="demo-multiple-checkbox-label">Enfant de la rubrique :</InputLabel>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  label="Enfnat de la rubrique"
                  value={newRubrique.roles}
                  onChange={e => setNewRubrique(prev => ({...prev, parent: e.target.value}))}
                  required
                >
                  {
                    !!rubriqueTypes
                    ?
                    rubriqueTypes?.filter((rub) => rub.parent === '').map((item, index) => (
                      <MenuItem key={index} value={item._id}>{item.title}</MenuItem>
                    ))
                    :
                    <MenuItem disabled>Aucune rubrique disponible...</MenuItem>
                  }
                </Select>
              </FormControl>
            </Paper>

          }


          {
            missingValue ?
              <div style={{marginTop: "10px", color: "red"}}>
                Veuillez renseigner les données manquantes
              </div>
            :
              <></>
          }
          

          <Paper elevation={2} sx={{width: '100%', marginTop: "20px"}}>
            <Button variant='contained' sx={{width: "100%"}} onClick={handleSubmitForm}>Ajouter</Button>
          </Paper>

        </div>
      </div>
    </>
  );
}

export default NewRubrique;