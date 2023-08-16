import React, { useEffect, useState } from 'react'
import styles from "./IndexAdmin.module.scss"
import ItemIndex from './ItemIndex/ItemIndex'
import axios from 'axios'

const IndexAdmin = () => {
  const [users, setUsers] = useState()
  const [contents, setContents] = useState()
  const [rolesInUsers, setRolesInUsers] = useState({
    user: 0,
    modo: 0,
    admin: 0
  })

  const [typeOfArticles, setTypeOfArticles] = useState({
    article: 0,
    actuality: 0,
    reference: 0
  })

  const fetchUsers = async () => {
    const usersData = await axios.get('/user')
    console.log(usersData.data)
    setUsers(usersData.data)
    let user = 0, modo = 0, admin = 0;
    for (let usr = 0; usr < usersData.data.length; usr++) {
      if(usersData.data[usr].roles.includes("Administateur")){
        admin = admin +1;
      }
      else if(usersData.data[usr].roles.includes("Modérateur")){
        modo = modo +1;
      }
      else {
        user = user + 1;
      }
    }
    setRolesInUsers(
      {
        user: user,
        modo: modo,
        admin: admin
      }
    )
  }

  const fetchContents = async () => {
    const contentData = await axios.get('/article')
    console.log(contentData.data)
    setContents(contentData.data)
    let article = 0, actuality = 0, reference = 0;
    for (let ctnt = 0; ctnt < contentData.data.length; ctnt++) {
      if(contentData.data[ctnt].type === "article"){
        article = article +1;
      }
      else if(contentData.data[ctnt].type === "actuality"){
        actuality = actuality +1;
      }
      else if(contentData.data[ctnt].type === "reference"){
        reference = reference + 1;
      }
    }
    setTypeOfArticles(
      {
        article: article,
        actuality: actuality,
        reference: reference
      }
    )
  }


  useEffect(() => {
    fetchUsers();
    fetchContents();
  }, [])
  
  return (
    <>
      <div className={styles.container}>
        <ItemIndex link="user/list" title="Nombre d'utilisateurs total" number={users?.length} text={`Dont ${rolesInUsers.user} utilisateur${rolesInUsers.user > 1 ? "s" : ""} / ${rolesInUsers.modo} modérateur${rolesInUsers.modo > 1 ? "s" : ""} / ${rolesInUsers.admin} administateur${rolesInUsers.admin > 1 ? "s" : ""}`}/>
        <ItemIndex link="user/list" title="Nombre d'utilisateurs total" number="15" text="Roles: 10 utilisateurs / 3 modérateurs / 2 administateurs"/>
        <ItemIndex link="user/list" title="Nombre d'utilisateurs total" number="15" text="Roles: 10 utilisateurs / 3 modérateurs / 2 administateurs"/>
        <ItemIndex link="content/list" title="Nombre de contenus ajoutés dans le mois" number={contents?.length} text={`Dont: ${typeOfArticles.article} article${typeOfArticles.article > 1 ? "s" : ""} / ${typeOfArticles.actuality} actualité${typeOfArticles.actuality > 1 ? "s" : ""} / ${typeOfArticles.reference} contenu${typeOfArticles.reference > 1 ? "s" : ""} de références`}/>
        <ItemIndex link="user/list" title="Nombre d'utilisateurs total" number="15" text="Roles: 10 utilisateurs / 3 modérateurs / 2 administateurs"/>
        <ItemIndex link="user/list" title="Nombre d'utilisateurs total" number="15" text="Roles: 10 utilisateurs / 3 modérateurs / 2 administateurs"/>
      </div>
    </>
  )
}

export default IndexAdmin