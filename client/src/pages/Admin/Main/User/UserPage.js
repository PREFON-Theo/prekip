import React, {useState, useEffect, useContext} from 'react'
import styles from "./UserPage.module.scss"
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
import { Navigate, useParams } from 'react-router-dom';
import "dayjs/locale/fr"
import { UserContext } from '../../../../utils/Context/UserContext/UserContext';

const rolesData = [
  {name:"User", label: "Utilisateur"},
  {name:"Mod", label: "Modérateur"},
  {name:"Admin", label: "Administrateur"}
]

const UserPage = ({handleOpenAlert, changeAlertValues}) => {
  const {id} = useParams();
  const {cookies} = useContext(UserContext)
  const [userInfo, setUserInfo] = useState({
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
  const [redirectionErr, setRedirectionErr] = useState(false);

  const [rubriqueList, setRubriqueList] = useState();

  const fetchData = async () => {
    try {
      const rubriquesRaw = await axios.get("/rubrique-type/parents", {headers: {jwt: cookies.token}})
      setRubriqueList(rubriquesRaw.data)

      const userData = await axios.get(`/user/one/${id}`, {headers: {jwt: cookies.token}});
      let divisionArr = []
      userData.data.divisions.map((item, index) => {
        divisionArr.push(rubriquesRaw.data.filter((rl) => rl._id === item)[0].title)
      })

      setUserInfo({
        firstname: userData.data.firstname,
        lastname: userData.data.lastname,
        email: userData.data.email,
        roles: userData.data.roles,
        joiningDate: userData.data.joiningDate,
        leavingDate: userData.data.leavingDate,
        valid: userData.data.valid,
        divisions: divisionArr
      })
    }
    catch (err) {
      console.log(err)
      setRedirectionErr(true)
    }
  }


  useEffect(() => {
    fetchData()
  }, [])

  const handleChangeRoles = (event) => {
    const {
      target: { value },
    } = event;
    setUserInfo(prev => ({...prev, roles: typeof value === 'string' ? value.split(',') : value}));
  };

  const handleChangeDivisions = (event) => {
    const {
      target: { value },
    } = event;
    setUserInfo(prev => ({...prev, divisions: typeof value === 'string' ? value.split(',') : value}));
  };


  const handleSubmitForm = async () => {
    // check if all input are full
    setMissingValue(false)
    setDiffPassword(false)
    setEmailIncorrect(false)
    setEmailAlreadyUsed(false)
    if(
      userInfo.firstname === "" 
      || userInfo.lastname === "" 
      || userInfo.email === "" 
      || userInfo.roles.length === 0
      || userInfo.divisions.length === 0
      || userInfo.joiningDate === ""
    ){
      //manque de valeur
      setMissingValue(true)
    }
    else {
      if(/.+@.+\.[A-Za-z]+$/.test(userInfo.email) === false){
        setEmailIncorrect(true)
      }
      else {
        if(userInfo.password === '' && userInfo.confirmPassword === ''){
          try {
            let divisionArr = []
            userInfo.divisions.map((item, index) => {
              divisionArr.push(rubriqueList.filter((rl) => rl.title === item)[0]._id)
            })


            await axios.patch(`/user/${id}`, {
              firstname: userInfo.firstname,
              lastname: userInfo.lastname,
              email: userInfo.email,
              roles: userInfo.roles,
              divisions: divisionArr,
              joiningDate: userInfo.joiningDate,
              leavingDate: userInfo.leavingDate,
              valid: userInfo.valid,
            }, {headers: {jwt: cookies.token}})
            handleOpenAlert()
            changeAlertValues('success', 'Utilisateur modifié')
            setRedirection(true)
          }
          catch (err) {
            handleOpenAlert()
            changeAlertValues('error', 'Erreur lors de la création')
          }
        }
        else {
          // check if psw ok
          if(userInfo.password !== userInfo.confirmPassword){
            setDiffPassword(true)
          }
          else {
            try {
              let divisionArr = []
              userInfo.divisions.map((item, index) => {
                divisionArr.push(rubriqueList.filter((rl) => rl.title === item)[0]._id)
              })

              
              await axios.patch(`user/${id}`, {
                firstname: userInfo.firstname,
                lastname: userInfo.lastname,
                email: userInfo.email,
                password: userInfo.password,
                roles: userInfo.roles,
                divisions: divisionArr,
                joiningDate: userInfo.joiningDate,
                leavingDate: userInfo.leavingDate,
                valid: userInfo.valid,
              }, {headers: {jwt: cookies.token}})
              handleOpenAlert()
              changeAlertValues('success', 'Utilisateur modifié')
              setRedirection(true)
            }
            catch (err) {
              if(err.response.data.error?.code === 11000){
                setEmailAlreadyUsed(true)
                handleOpenAlert()
                changeAlertValues('error', 'Erreur, le mail est déjà utilisé')
              }
              else {
                handleOpenAlert()
                changeAlertValues('error', 'Erreur lors de la création')
              }
            }
          }
        }
      }
    }
  }

  return (
    <>
      {redirection ? <Navigate to={'/admin/user/list'}/> : <></>}
      {redirectionErr ? <Navigate to={'/admin/*'}/> : <></>}
      <div className={styles.container}>
        <div className={styles.box}>
          <h2>Utilisateur {id} : </h2>
          {/* Prénom / Nom */}
          <div style={{marginBottom: '40px', justifyContent:"space-between"}} className={styles.full_width}>
            <Paper elevation={2} sx={{width: '48%'}}>
              <TextField required value={userInfo.firstname} sx={{width: '100%', borderColor: "red"}} label="Prénom" variant="outlined" onChange={e => setUserInfo(prev => ({...prev, firstname: e.target.value}))}/>
            </Paper>
            <Paper elevation={2} sx={{width: '48%'}}>
              <TextField required value={userInfo.lastname} sx={{width: '100%'}} label="Nom" variant="outlined" onChange={e => setUserInfo(prev => ({...prev, lastname: e.target.value}))}/>
            </Paper>
          </div>

          <Paper elevation={2} sx={{marginBottom: '30px'}} className={styles.semi_width}>
            <TextField required value={userInfo.firstname} sx={{width: '100%', borderColor: "red"}} label="Prénom" variant="outlined" onChange={e => setUserInfo(prev => ({...prev, firstname: e.target.value}))}/>
          </Paper>
          <Paper elevation={2} sx={{marginBottom: '30px'}} className={styles.semi_width}>
            <TextField required value={userInfo.lastname} sx={{width: '100%'}} label="Nom" variant="outlined" onChange={e => setUserInfo(prev => ({...prev, lastname: e.target.value}))}/>
          </Paper>

          {/* Email */}
          <Paper elevation={2} sx={{marginBottom: '30px'}}>
            <TextField required type="email" value={userInfo.email} sx={{width: '100%'}} label="Adresse mail" variant="outlined" onChange={e => setUserInfo(prev => ({...prev, email: e.target.value}))}/>
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


          {/* Password / Confirm Password TODO vérification de si les deux sont égaux*/}
          <div style={{marginBottom: '30px', justifyContent:"space-between"}} className={styles.full_width}>
            <Paper elevation={2} sx={{width: '48%'}}>
              <TextField required type='password' value={userInfo.password} sx={{width: '100%'}} label="Mot de passe" variant="outlined" onChange={e => setUserInfo(prev => ({...prev, password: e.target.value}))}/>
            </Paper>
            <Paper elevation={2} sx={{width: '48%'}}>
              <TextField required type='password' value={userInfo.confirmPassword} sx={{width: '100%'}} label="Confirmation du mot de passe" variant="outlined" onChange={e => setUserInfo(prev => ({...prev, confirmPassword: e.target.value}))}/>
            </Paper>
          </div>

          <Paper elevation={2} sx={{marginBottom: '30px'}} className={styles.semi_width}>
            <TextField required type='password' value={userInfo.password} sx={{width: '100%'}} label="Mot de passe" variant="outlined" onChange={e => setUserInfo(prev => ({...prev, password: e.target.value}))}/>
          </Paper>
          <Paper elevation={2} sx={{marginBottom: '30px'}} className={styles.semi_width}>
            <TextField required type='password' value={userInfo.confirmPassword} sx={{width: '100%'}} label="Confirmation du mot de passe" variant="outlined" onChange={e => setUserInfo(prev => ({...prev, confirmPassword: e.target.value}))}/>
          </Paper>

          {
            diffPassword ?
              <div style={{margin: "20px 0", color: "red"}}>
                Veuillez confirmer avec le même mot de passe
              </div>
            :
              <></>
          }

          {/* Dropdown Roles TODO rechercher le label dans rolesData et convertir en name*/}
          <Paper elevation={2} sx={{marginBottom: '40px'}}>
            <FormControl fullWidth>
              <InputLabel id="demo-multiple-checkbox-label">Liste des roles</InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={userInfo.roles}
                onChange={handleChangeRoles}
                input={<OutlinedInput label="Liste des roles" />}
                renderValue={(selected) => selected.join(', ')}
                required
              >
                {rolesData.map((item, index) => (
                  <MenuItem key={index} value={item.label} label={item.label}>
                    <Checkbox checked={userInfo.roles.indexOf(item.label) > -1} />
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
                value={userInfo.divisions}
                onChange={handleChangeDivisions}
                input={<OutlinedInput label="Liste des pôles" />}
                renderValue={(selected) => selected.join(', ')}
                required
              >
                {rubriqueList?.map((item, index) => (
                  <MenuItem key={index} label={item.title} value={item.title}>
                    <Checkbox checked={userInfo.divisions.indexOf(item.title) > -1} />
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
                  value={userInfo.joiningDate === null ? null : userInfo.joiningDate === "" ? null : dayjs(userInfo.joiningDate)}
                  format="DD/MM/YYYY"
                  sx={{width: '100%'}}
                  label="Date de d'arrivée"
                  variant="outlined"
                  maxDate={dayjs(userInfo.leavingDate)}
                  required
                  onChange={value => setUserInfo(prev => ({...prev, joiningDate: value}))}
                />
              </LocalizationProvider>
            </Paper>
            <Paper elevation={2} sx={{width: '48%'}}>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='fr'>
                <DatePicker
                  value={userInfo.leavingDate === null ? null : userInfo.leavingDate === "" ? null : dayjs(userInfo.leavingDate)}
                  format="DD/MM/YYYY"
                  sx={{width: '100%'}}
                  label="Date de départ"
                  variant="outlined"
                  minDate={dayjs(userInfo.joiningDate)}
                  onChange={value => setUserInfo(prev => ({...prev, leavingDate: value}))}
                />
              </LocalizationProvider>
            </Paper>
          </div>

          <Paper elevation={2} sx={{marginBottom: '30px'}} className={styles.semi_width}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='fr'>
              <DatePicker
                value={userInfo.joiningDate === null ? null : userInfo.joiningDate === "" ? null : dayjs(userInfo.joiningDate)}
                format="DD/MM/YYYY"
                sx={{width: '100%'}}
                label="Date de d'arrivée"
                variant="outlined"
                maxDate={dayjs(userInfo.leavingDate)}
                required
                onChange={value => setUserInfo(prev => ({...prev, joiningDate: value}))}
              />
            </LocalizationProvider>
          </Paper>
          <Paper elevation={2} sx={{marginBottom: '30px'}} className={styles.semi_width}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='fr'>
              <DatePicker
                value={userInfo.leavingDate === null ? null : userInfo.leavingDate === "" ? null : dayjs(userInfo.leavingDate)}
                format="DD/MM/YYYY"
                sx={{width: '100%'}}
                label="Date de départ"
                variant="outlined"
                minDate={dayjs(userInfo.joiningDate)}
                onChange={value => setUserInfo(prev => ({...prev, leavingDate: value}))}
              />
            </LocalizationProvider>
          </Paper>

          {/* Valid */}
          <FormControlLabel
            control={
              <Switch
                checked={userInfo.valid}
                onChange={() => setUserInfo(prev => ({...prev, valid: !userInfo.valid}))}
              />
            }
            label={`Compte valide: ${userInfo.valid === true ? "Oui" : "Non"}`}
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
            <Button variant='contained' color="warning" sx={{width: "100%"}} onClick={handleSubmitForm}>Modifier</Button>
          </Paper>

        </div>
      </div>
    </>
  );
}

export default UserPage;