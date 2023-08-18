import React, { useEffect, useState } from 'react'
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


const NewRubrique = ({handleOpenAlert, changeAlertValues}) => {
  const [newRubrique, setNewRubrique] = useState({
    title: "",
    description: "",
    link: "",
    parent: ""
  })
  const [redirection, setRedirection] = useState(false);
  const [rubriqueTypes, setRubriqueTypes] = useState()
  const [missingValue, setMissingValue] = useState(false)
  const [linkAlreadtExists, setLinkAlreadtExists] = useState(false)
  const [isParent, setIsParent] = useState(false)
  
  const fetchRubriques = async () => {
    const rubriquesRaw = await axios.get('/rubrique-type')
    setRubriqueTypes(rubriquesRaw.data)
  }

  useEffect(() => {
    fetchRubriques();
  },[])

  const handleSubmitForm = async () => {
    // check if all input are full
    setLinkAlreadtExists(false)
    setMissingValue(false)
    if(
      newRubrique.title === "" 
      || newRubrique.description === "" 
      || newRubrique.link === "" || (newRubrique.parent === "" && isParent === false)
    ){
      //manque de valeur
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
          parent: newRubrique.parent
        })
        handleOpenAlert()
        changeAlertValues('success', 'Rubrique créée')
        setRedirection(true)
      }
      catch (err) {
        console.log(err)
        if(err.status === 401){
          setLinkAlreadtExists(true)
        }
        else {
          handleOpenAlert()
          changeAlertValues('error', 'Erreur lors de la création')
        }
      }
      console.log("ok")
      
      
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
          {/* TODO check if no space */}
          {
            linkAlreadtExists ?
              <div style={{margin: "20px 0", color: "red"}}>
                Veuillez renseigner un lien qui n'existe pas
              </div>
            :
              <></>
          }


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
                  {rubriqueTypes?.filter((rub) => rub.parent === '').map((item, index) => (
                    <MenuItem key={index} value={item._id}>{item.title}</MenuItem>
                  ))}
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