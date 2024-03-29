import React, { useContext, useEffect, useState } from 'react'
import styles from "./NewUser.module.scss"
import axios from 'axios';

import TextField from '@mui/material/TextField';
import { Button, Paper, Switch } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { Navigate } from 'react-router-dom';
import "dayjs/locale/fr"
import { UserContext } from '../../../../utils/Context/UserContext/UserContext';

const rolesData = [
  {name:"User", label: "Utilisateur"},
  {name:"Mod", label: "Modérateur"},
  {name:"Admin", label: "Administrateur"}
]

const NewUser = ({handleOpenAlert, changeAlertValues}) => {
  const {cookies} = useContext(UserContext)
  const [newUser, setNewUser] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    roles: [],
    joiningDate: "",
    leavingDate: "",
    valid: false,
    divisions: []
  })

  const [missingValue, setMissingValue] = useState(false)
  const [diffPassword, setDiffPassword] = useState(false)
  const [emailIncorrect, setEmailIncorrect] = useState(false)
  const [emailAlreadyUsed, setEmailAlreadyUsed] = useState(false)

  const [redirection, setRedirection] = useState(false);

  const [rubriqueList, setRubriqueList] = useState();


  const fetchRubriques = async () => {
    const rubriquesRaw = await axios.get("/rubrique-type/parents", {headers: {jwt: cookies.token}})
    setRubriqueList(rubriquesRaw.data)
  }

  useEffect(() => {
    fetchRubriques();
  }, [])

  const handleChangeRoles = (event) => {
    const {
      target: { value },
    } = event;
    setNewUser(prev => ({...prev, roles: typeof value === 'string' ? value.split(',') : value}));
  };

  const handleChangeDivisions = (event) => {
    const {
      target: { value },
    } = event;
    setNewUser(prev => ({...prev, divisions: typeof value === 'string' ? value.split(',') : value}));
  };

  const handleSubmitForm = async () => {
    // check if all input are full
    setMissingValue(false)
    setDiffPassword(false)
    setEmailIncorrect(false)
    setEmailAlreadyUsed(false)
    if(
      newUser.firstname === "" 
      || newUser.lastname === "" 
      || newUser.email === "" 
      || newUser.password === "" 
      || newUser.confirmPassword === ""
      || newUser.roles.length === 0
      || newUser.divisions.length === 0
      || newUser.joiningDate === ""
    ){
      setMissingValue(true)
 
    }
    else {
      if(newUser.password !== newUser.confirmPassword){
        setDiffPassword(true)
      }
      else {
        if(/.+@.+\.[A-Za-z]+$/.test(newUser.email) === false){
          setEmailIncorrect(true)
        }
        else {
          try {
            let divisionArr = []
            newUser.divisions.map((item, index) => {
              divisionArr.push(rubriqueList.filter((rl) => rl.title === item)[0]._id)
            })


            const userCreation = await axios.post('/user/register', {
              firstname: newUser.firstname,
              lastname: newUser.lastname,
              email: newUser.email,
              password: newUser.password,
              roles: newUser.roles,
              divisions: divisionArr,
              joiningDate: newUser.joiningDate,
              leavingDate: newUser.leavingDate,
              valid: newUser.valid,
            }, {headers: {jwt: cookies.token}})
            if(userCreation.respond?.status === 409){
              setEmailAlreadyUsed(true)
              handleOpenAlert()
              changeAlertValues('error', 'Erreur, le mail est déjà utilisé')
            }
            else {
              handleOpenAlert()
              changeAlertValues('success', 'Utilisateur créé')
              setRedirection(true)
            }
          }
          catch (err) {
            handleOpenAlert()
            changeAlertValues('error', 'Erreur lors de la création')
          }
        }
      }
    }
  }

  return (
    <>
      {redirection ? <Navigate to={'/admin/user/list'}/> : <></>}
      <div className={styles.container}>
        <div className={styles.box}>
          <h2>Nouvel utilisateur : </h2>
          {/* Prénom / Nom */}
          <div style={{marginBottom: '40px', justifyContent:"space-between"}} className={styles.full_width}>
            <Paper elevation={2} sx={{width: '48%'}}>
              <TextField required value={newUser.firstname} sx={{width: '100%'}} label="Prénom" variant="outlined" onChange={e => setNewUser(prev => ({...prev, firstname: e.target.value}))}/>
            </Paper>
            <Paper elevation={2} sx={{width: '48%'}}>
              <TextField required value={newUser.lastname} sx={{width: '100%'}} label="Nom" variant="outlined" onChange={e => setNewUser(prev => ({...prev, lastname: e.target.value}))}/>
            </Paper>
          </div>

          <Paper elevation={2} sx={{marginBottom: '30px'}} className={styles.semi_width}>
            <TextField required value={newUser.firstname} sx={{width: '100%'}} label="Prénom" variant="outlined" onChange={e => setNewUser(prev => ({...prev, firstname: e.target.value}))}/>
          </Paper>
          <Paper elevation={2} sx={{marginBottom: '30px'}} className={styles.semi_width}>
            <TextField required value={newUser.lastname} sx={{width: '100%'}} label="Nom" variant="outlined" onChange={e => setNewUser(prev => ({...prev, lastname: e.target.value}))}/>
          </Paper>

          {/* Email */}
          <Paper elevation={2} sx={{marginBottom: '30px'}}>
            <TextField required type="email" value={newUser.email} sx={{width: '100%'}} label="Adresse mail" variant="outlined" onChange={e => setNewUser(prev => ({...prev, email: e.target.value}))}/>
          </Paper>
          {
            emailIncorrect ?
              <div style={{margin: "20px 0", color: "red"}}>
                Veuillez renseigner un mail correct
              </div>
            :
            emailAlreadyUsed ?
              <div style={{margin: "20px 0", color: "red"}}>
                Ce mail est déjà utilisé, veuillez renseigner un autre mail.
              </div>
            :
              <></>
          }


          {/* Password / Confirm Password */}
          <div style={{marginBottom: '30px', justifyContent:"space-between"}} className={styles.full_width}>
            <Paper elevation={2} sx={{width: '48%'}}>
              <TextField required type='password' value={newUser.password} sx={{width: '100%'}} label="Mot de passe" variant="outlined" onChange={e => setNewUser(prev => ({...prev, password: e.target.value}))}/>
            </Paper>
            <Paper elevation={2} sx={{width: '48%'}}>
              <TextField required type='password' value={newUser.confirmPassword} sx={{width: '100%'}} label="Confirmation du mot de passe" variant="outlined" onChange={e => setNewUser(prev => ({...prev, confirmPassword: e.target.value}))}/>
            </Paper>
          </div>

          <Paper elevation={2} sx={{marginBottom: '30px'}} className={styles.semi_width}>
            <TextField required type='password' value={newUser.password} sx={{width: '100%'}} label="Mot de passe" variant="outlined" onChange={e => setNewUser(prev => ({...prev, password: e.target.value}))}/>
          </Paper>
          <Paper elevation={2} sx={{marginBottom: '30px'}} className={styles.semi_width}>
            <TextField required type='password' value={newUser.confirmPassword} sx={{width: '100%'}} label="Confirmation du mot de passe" variant="outlined" onChange={e => setNewUser(prev => ({...prev, confirmPassword: e.target.value}))}/>
          </Paper>

          {
            diffPassword ?
              <div style={{margin: "20px 0", color: "red"}}>
                Veuillez confirmer avec le même mot de passe
              </div>
            :
              <></>
          }

          {/* Dropdown Roles */}
          <Paper elevation={2} sx={{marginBottom: '40px'}}>
            <FormControl fullWidth>
              <InputLabel id="demo-multiple-checkbox-label">Liste des roles</InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={newUser.roles}
                onChange={handleChangeRoles}
                input={<OutlinedInput label="Liste des roles" />}
                renderValue={(selected) => selected.join(', ')}
                required
              >
                {rolesData.map((item, index) => (
                  <MenuItem key={index} value={item.label} label={item.label}>
                    <Checkbox checked={newUser.roles.indexOf(item.label) > -1} />
                    <ListItemText primary={item.label} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>

          {/* Dropdown Pôles */}
          <Paper elevation={2} sx={{marginBottom: '40px'}}>
            <FormControl fullWidth>
              <InputLabel id="demo-multiple-checkbox-label">Liste des pôles</InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={newUser.divisions}
                onChange={handleChangeDivisions}
                input={<OutlinedInput label="Liste des pôles" />}
                renderValue={(selected) => selected.join(', ')}
                required
              >
                {rubriqueList?.map((item, index) => (
                  <MenuItem key={index} label={item.title} value={item.title}>
                    <Checkbox checked={newUser.divisions.indexOf(item.title) > -1} />
                    <ListItemText primary={item.title} label={item.title}/>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>

          {/* Joining Date / Leaving Date */}
          <div style={{marginBottom: '40px', justifyContent:"space-between"}} className={styles.full_width}>
            <Paper elevation={2} sx={{width: '48%'}}>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='fr'>
                <DatePicker
                  value={newUser.joiningDate === "" ? null : dayjs(newUser.joiningDate)}
                  format="DD/MM/YYYY"
                  sx={{width: '100%'}}
                  label="Date de d'arrivée"
                  variant="outlined"
                  maxDate={dayjs(newUser.leavingDate)}
                  required
                  onChange={value => setNewUser(prev => ({...prev, joiningDate: value}))}
                />
              </LocalizationProvider>
            </Paper>
            <Paper elevation={2} sx={{width: '48%'}}>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='fr'>
                <DatePicker
                  value={newUser.leavingDate === "" ? null : dayjs(newUser.leavingDate)}
                  format="DD/MM/YYYY"
                  sx={{width: '100%'}}
                  label="Date de départ"
                  variant="outlined"
                  minDate={dayjs(newUser.joiningDate)}
                  onChange={value => setNewUser(prev => ({...prev, leavingDate: value}))}
                />
              </LocalizationProvider>
            </Paper>
          </div>

          <Paper elevation={2} sx={{marginBottom: '30px'}} className={styles.semi_width}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='fr'>
              <DatePicker
                value={newUser.joiningDate === "" ? null : dayjs(newUser.joiningDate)}
                format="DD/MM/YYYY"
                sx={{width: '100%'}}
                label="Date de d'arrivée"
                variant="outlined"
                maxDate={dayjs(newUser.leavingDate)}
                required
                onChange={value => setNewUser(prev => ({...prev, joiningDate: value}))}
              />
            </LocalizationProvider>
          </Paper>
          <Paper elevation={2} sx={{marginBottom: '30px'}} className={styles.semi_width}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='fr'>
              <DatePicker
                value={newUser.leavingDate === "" ? null : dayjs(newUser.leavingDate)}
                format="DD/MM/YYYY"
                sx={{width: '100%'}}
                label="Date de départ"
                variant="outlined"
                minDate={dayjs(newUser.joiningDate)}
                onChange={value => setNewUser(prev => ({...prev, leavingDate: value}))}
              />
            </LocalizationProvider>
          </Paper>

          {/* Valid */}
          <FormControlLabel
            control={<Switch 
              value={newUser.valid}
              onChange={() => setNewUser(prev => ({...prev, valid: !newUser.valid}))}/>
            }
            label={`Compte valide: ${newUser.valid ? "Oui" : "Non"}`}
          />

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

export default NewUser;