import React, { useContext, useEffect, useState } from 'react'
import styles from "./RubriquePage.module.scss"
import axios from 'axios';

import TextField from '@mui/material/TextField';
import { Button, Paper, Switch } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Navigate, useParams } from 'react-router-dom';
import { UserContext } from '../../../../../utils/Context/UserContext/UserContext';


const RubriquePage = ({handleOpenAlert, changeAlertValues}) => {
  const { id } = useParams();
  const {cookies} = useContext(UserContext)
  const [rubriqueInfo, setRubriqueInfo] = useState({
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

  const fetchRubrique = async () => {
    const rubriqueRaw = await axios.get(`/rubrique-type/${id}`, {headers: {jwt: cookies.token}})
    setRubriqueInfo(rubriqueRaw.data)
    setIsParent(rubriqueRaw.data?.parent === "" ? true : false)
  }

  useEffect(() => {
    fetchRubriques();
    fetchRubrique();
  },[])

  const handleSubmitForm = async () => {
    setLinkAlreadtExists(false)
    setMissingValue(false)
    if(
      rubriqueInfo.title === "" 
      || rubriqueInfo.description === "" 
      || rubriqueInfo.link === "" || (rubriqueInfo.parent === "" && isParent === false)
    ){
      setMissingValue(true)
 
    }
    else {
      if(isParent){
        rubriqueInfo.parent = ""
      }
      try {
        await axios.patch(`/rubrique-type/${id}`, {
          title: rubriqueInfo.title,
          description: rubriqueInfo.description,
          link: rubriqueInfo.link,
          parent: rubriqueInfo.parent,
          imgLink: rubriqueInfo.imgLink
        }, {headers: {jwt: cookies.token}})
        handleOpenAlert()
        changeAlertValues('success', 'Rubrique créée')
        setRedirection(true)
      }
      catch (err) {
        if(err.response.data.error?.code === 11000){
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
    setRubriqueInfo(prev => ({...prev, link: e.target.value.toLowerCase().replace(" ", "_")}))
  }

  return (
    <>
      {redirection ? <Navigate to={'/admin/rubrique-type/list'}/> : <></>}
      <div className={styles.container}>
        <div className={styles.box}>
          <h2>Rubrique {rubriqueInfo?.title} : </h2>

          {/* Titre */}
          <Paper elevation={2} sx={{marginBottom: '30px'}}>
            <TextField required disabled={!!!rubriqueInfo} value={rubriqueInfo?.title} sx={{width: '100%'}} label="Titre" variant="outlined" onChange={e => setRubriqueInfo(prev => ({...prev, title: e.target.value}))}/>
          </Paper>

          {/* Description */}
          <Paper elevation={2} sx={{marginBottom: '30px'}}>
            <TextField required disabled={!!!rubriqueInfo} value={rubriqueInfo?.description} sx={{width: '100%'}} label="Description" variant="outlined" onChange={e => setRubriqueInfo(prev => ({...prev, description: e.target.value}))}/>
          </Paper>

          {/* Lien */}
          <Paper elevation={2} sx={{marginBottom: '30px'}}>
            <TextField required disabled={!!!rubriqueInfo} value={rubriqueInfo?.link} sx={{width: '100%'}} label="Lien" variant="outlined" onChange={(e) => handleChangeLink(e)}/>
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
            <TextField required disabled={!!!rubriqueInfo} value={rubriqueInfo?.imgLink} sx={{width: '100%'}} label="URL de l'image" variant="outlined" onChange={e => setRubriqueInfo(prev => ({...prev, imgLink: e.target.value}))}/>
          </Paper>

          {/* Valid */}
          <FormControlLabel
            control={<Switch disabled={!!!rubriqueInfo} value={isParent} checked={isParent} onChange={(e) => setIsParent(!isParent)}/>} label={`Rubrique parent ? : ${isParent === true ? "Oui" : "Non"}`}
          />

          {isParent ?
            <></>
          :
            <Paper elevation={2} sx={{marginBottom: '40px'}}>
              <FormControl disabled={!!!rubriqueInfo} fullWidth>
                <InputLabel id="demo-multiple-checkbox-label">Enfant de la rubrique :</InputLabel>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  label="Enfant de la rubrique"
                  value={rubriqueInfo?.parent}
                  onChange={e => setRubriqueInfo(prev => ({...prev, parent: e.target.value}))}
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
            <Button disabled={!!!rubriqueInfo} variant='contained' color='warning' sx={{width: "100%"}} onClick={handleSubmitForm}>Modifier</Button>
          </Paper>

        </div>
      </div>
    </>
  );
}

export default RubriquePage;