import React, { useContext, useEffect, useState } from 'react'
import styles from "./Forum.module.scss"
import axios from 'axios'
import { Link, Navigate } from "react-router-dom"

import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';

import { UserContext } from '../../../../../utils/Context/UserContext/UserContext';

import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import IconButton from '@mui/material/IconButton';

const usersList = await axios.get('/user')
const listOfUsers = usersList.data

const Forum = ({handleOpenAlert, changeAlertValues}) => {
  const { user, cookies } = useContext(UserContext);
  const [redirection, setRedirection] = useState(false);
  const [lastForum, setLastForum] = useState([]);
  const [forumInfo, setForumInfo] = useState();
  const [forumOnFocus, setForumOnFocus] = useState();
  const [answerText, setAnswerText] = useState('');
  const [answers, setAnswers] = useState([]);
  const [lenghtToLoad, setLengthToLoad] = useState(5);
  const [lengthOfForums, setLengthOfForums] = useState(0);
  const [listOfUsers, setListOfUsers] = useState()

  const [openDr, setOpenDr] = useState(false);

  const fetchAllForums = async () => {
    const frms = await axios
      .get(`/forum`, {headers: {jwt: cookies.token}})
    setLengthOfForums(frms?.data?.length)

    const usrs = await axios
      .get('/user', {headers: {jwt: cookies.token}})
    setListOfUsers(usrs.data)
  }

  const fetchLastForums = async () => {
    fetchAllForums();
    await axios
      .get(`/forum/last/${lenghtToLoad}`, {headers: {jwt: cookies.token}})
      .then((res) => {
        setLastForum(res.data)
      })
  }

  useEffect(() => {
    fetchLastForums();
  }, [])

  useEffect(() => {
    fetchLastForums();
  }, [lenghtToLoad])

  const fetchDataForum = async (id) => {
    await axios
      .get(`/forum/${id}`, {headers: {jwt: cookies.token}})
      .then((res) => setForumInfo(res.data))
  }

  const fetchDataAnswers = async (id) => {
    await axios
      .get(`/answer/forum/${id}`)
      .then((res) => setAnswers(res.data))
  }

  const changeTopic = (id) => {
    if(forumOnFocus !== id){
      setForumOnFocus(id)
      fetchDataForum(id);
      fetchDataAnswers(id);
    }
  }

  const handleAddAnswer = () => {
    axios
      .post(`/answer/`, {
        text: answerText,
        user_id: user,
        forum_id: forumInfo?._id,
      })
      .then(() => handleOpenAlert())
      .then(() => changeAlertValues('success', 'Commentaire ajouté'))
      .then(() => fetchDataAnswers(forumInfo?._id))
      .then(() => setAnswerText(''))
  }
  
  const changeVote = async (answer, up) => {
    await axios
      .patch(`/answer/${answer._id}`, {
        vote: up ? parseInt(answer.vote) + 1 : parseInt(answer.vote) - 1
    }).then(() => fetchDataAnswers(answer.forum_id))
  }

  const handleCloseForum = async (id, forumClosed) => {
    await axios
      .patch(`/forum/${id}`, {
        closed: !forumClosed
      }, {headers: {jwt: cookies.token}})
      .then(() => fetchDataForum(id))
      .then(() => fetchLastForums())
  }

  const deleteForum = async (id) => {
    await axios.delete(`/forum/${forumInfo?._id}`, {headers: {jwt: cookies.token}})
    await axios.delete(`/answer/forum/${forumInfo?._id}`)
    .then(() => {
      setRedirection(true)
      fetchLastForums()
      setForumOnFocus()
      setForumInfo()
      handleOpenAlert()
      changeAlertValues('success', 'Forum supprimé')
    })    
  }

  const changeLengthToLoad = async (more) => {
    if(more) {
      setLengthToLoad(lenghtToLoad+5)
    }
    else {
      setLengthToLoad(lenghtToLoad-5)
    }
  }

  return (
    <>
      {redirection ? <Navigate to={'/forum'}/> : <></>}
      <div className={styles.container}>
        <div className={styles.left}>
          <h4>Listes des sujets :</h4>
          {
            lastForum?.length === 0 ?
              <div>Il n'y a aucun sujet</div>
            :
            <>
              {lastForum?.map((item, index) => (
                <div key={index} className={forumOnFocus === item._id ? styles.item_last_forum_focused : styles.item_last_forum} onClick={() => changeTopic(item._id)}>
                    <span style={{color: item.closed ? "grey": "black"}}>{item.closed ? "[Fermé]" : ""}{item.title}</span>
                </div>
              ))}
              <div className={styles.more_to_load}>
                {lengthOfForums <= 5 ?
                <></>
                : lenghtToLoad >= lengthOfForums ?
                <>
                  <div className={styles.less} style={{cursor: "pointer"}} onClick={() => changeLengthToLoad(false)}>Voir moins</div>
                </>
                : lenghtToLoad === 5 ?
                <>
                  <div className={styles.more} style={{cursor: "pointer", margin: '0 0 0 auto'}} onClick={() => changeLengthToLoad(true)}>Voir plus</div>              
                </>
                :
                <>
                  <div className={styles.less} style={{cursor: "pointer", textAlign: "start"}} onClick={() => changeLengthToLoad(false)}>Voir moins</div>
                  <div className={styles.more} style={{cursor: "pointer", textAlign: "end"}} onClick={() => changeLengthToLoad(true)}>Voir plus</div>
                </>
                }
              </div>
            </>
          }
        </div>

        <Drawer
          open={openDr}
          onClose={() => setOpenDr(false)}
        >
          <Box
            sx={{ width: 'auto'}}
            role="presentation"
            onClick={() => setOpenDr(false)}
          >
            <div className={styles.left_semi_width}>
              <h4>Listes des sujets :</h4>
              {
                lastForum?.length === 0 ?
                  <div>Il n'y a aucun sujet</div>
                :
                <>
                  {lastForum?.map((item, index) => (
                    <div key={index} className={forumOnFocus === item._id ? styles.item_last_forum_focused : styles.item_last_forum} onClick={() => changeTopic(item._id)}>
                        <span style={{color: item.closed ? "grey": "black"}}>{item.closed ? "[Fermé]" : ""}{item.title}</span>
                    </div>
                  ))}
                  <div className={styles.more_to_load}>
                    {lengthOfForums <= 5 ?
                    <></>
                    : lenghtToLoad >= lengthOfForums ?
                    <>
                      <div className={styles.less} style={{cursor: "pointer"}} onClick={() => changeLengthToLoad(false)}>Voir moins</div>
                    </>
                    : lenghtToLoad === 5 ?
                    <>
                      <div className={styles.more} style={{cursor: "pointer", margin: '0 0 0 auto'}} onClick={() => changeLengthToLoad(true)}>Voir plus</div>              
                    </>
                    :
                    <>
                      <div className={styles.less} style={{cursor: "pointer", textAlign: "start"}} onClick={() => changeLengthToLoad(false)}>Voir moins</div>
                      <div className={styles.more} style={{cursor: "pointer", textAlign: "end"}} onClick={() => changeLengthToLoad(true)}>Voir plus</div>
                    </>
                    }
                  </div>
                </>
              }
            </div>

          </Box>
        </Drawer>

        <div className={styles.main}>
        
          {
            forumInfo === undefined ?
              <>
                <div className={styles.forum_hp}>
                  <div className={styles.menu_button}>
                    <IconButton aria-label="Menu" onClick={() => setOpenDr(true)}>
                      <MenuRoundedIcon fontSize='large' />
                    </IconButton>
                  </div>
                  <h1>Bienvenue sur la page Forum</h1>
                  <div className={styles.description}>Vous pouvez ajouter un sujet de discussion, interagir et échanger.</div>
                  <Link to={'/new-forum'}>
                    <Button variant='contained' sx={{marginTop: '20px'}} color='success'>Ajouter un sujet de discussion</Button>
                  </Link>
                </div>
              </>
            :

              <div className={styles.wrapper}>
                {
                  user ?
                    (forumInfo?.author === user?._id) || user.roles.includes('Administrateur') || user.roles.includes('Modérateur') ?
                    <div className={styles.button_manage}>
                      <Button variant='contained' color='info' sx={{marginLeft: '10px'}} onClick={() => handleCloseForum(forumInfo?._id, forumInfo?.closed)}>{forumInfo?.closed ? 'Réouvrir le forum' : 'Clôturer le forum'}</Button>
                      <Link to={`/edit-forum/${forumInfo?._id}`} style={{marginLeft: '10px'}}>
                        <Button variant='contained' color='warning'>Modifier le forum</Button>
                      </Link>
                      <Button variant='contained' color='error' onClick={() => deleteForum(forumInfo?._id)}>Supprimer le forum</Button>
                    </div>
                    :
                      <></>
                  :
                  <></>
                }
                <div className={styles.wrapper_topic}>
                  <div className={styles.menu_button}>
                    <IconButton aria-label="Menu" onClick={() => setOpenDr(true)}>
                      <MenuRoundedIcon fontSize='large' />
                    </IconButton>
                  </div>
                  <h1>{forumInfo?.closed ? "[Fermé]":''}{forumInfo?.title}</h1>
                  <div className={styles.description}>{forumInfo?.description}</div>
                  <div className={styles.author}>Posté le {new Date(forumInfo?.created_at).toLocaleDateString('fr-FR')}, par {`${listOfUsers?.filter((usr) => usr._id === forumInfo?.author)[0]?.firstname} ${listOfUsers?.filter((usr) => usr._id === forumInfo?.author)[0]?.lastname}`}</div>
                </div>

                <div className={styles.wrapper_answers}>
                  <div className={styles.answers}>
                    {
                      user ?
                        <div className={styles.add_ans}>
                          <TextField
                            id="outlined-basic"
                            label="Ajoutez une réponse..."
                            variant="outlined"
                            sx={{width: '100%', marginBottom: '20px'}}
                            value={answerText}
                            onChange={(e) => setAnswerText(e.target.value)}
                          />
                          <Button variant='contained' color='primary' onClick={() => handleAddAnswer()}>Ajouter</Button>
                        </div>
                      :
                      <></>
                    }

                    {answers?.map((item, index) => (
                      
                        item.user_id === user?._id ?
                        <>
                          <div className={styles.item_ans} key={index}>
                            <div className={styles.second}></div>
                            <div className={styles.text}>

                              <div className={styles.lft}>
                                <div className={styles.vote}>
                                  <KeyboardArrowUpRoundedIcon color='success' fontSize='medium' sx={{cursor: "pointer"}} onClick={() => changeVote(item, true)}/>
                                  {item.vote}
                                  <KeyboardArrowDownRoundedIcon color='error' fontSize='medium' sx={{cursor: "pointer"}} onClick={() => changeVote(item, false)}/>
                                </div>
                              </div>

                              <div className={styles.rght}>
                                <div className={styles.t}>
                                  <div className={styles.txt}>{item.text}</div>
                                  </div>
                                <div className={styles.a}>
                                  Par {`${listOfUsers?.filter((usr) => usr._id === item.user_id)[0]?.firstname} ${listOfUsers?.filter((usr) => usr._id === item.user_id)[0]?.lastname}`} le {new Date(item.created_at).toLocaleDateString('fr-FR')}
                                </div>
                              </div>

                            </div>
                          </div>
                        </>
                        :
                          <>
                            <div className={styles.item_ans} key={index}>
                              <div className={styles.text}>
                                <div className={styles.lft}>
                                  <div className={styles.vote}>
                                    <KeyboardArrowUpRoundedIcon color='success' fontSize='medium' sx={{cursor: "pointer"}} onClick={() => changeVote(item, true)}/>
                                    {item.vote}
                                    <KeyboardArrowDownRoundedIcon color='error' fontSize='medium' sx={{cursor: "pointer"}} onClick={() => changeVote(item, false)}/>
                                  </div>
                                </div>

                                <div className={styles.rght}>
                                  <div className={styles.t}>
                                    <div className={styles.txt}>{item.text}</div>
                                    </div>
                                  <div className={styles.a}>
                                    Par {`${listOfUsers?.filter((usr) => usr._id === item.user_id)[0]?.firstname} ${listOfUsers?.filter((usr) => usr._id === item.user_id)[0]?.lastname}`} le {new Date(item.created_at).toLocaleDateString('fr-FR')}
                                  </div>
                                </div>
                              </div>
                              <div className={styles.second}></div>
                            </div>
                          </>
                    ))}
                  </div>

                </div>
              </div>

              
          }
        </div>
      </div>
    </>
  )
}

export default Forum