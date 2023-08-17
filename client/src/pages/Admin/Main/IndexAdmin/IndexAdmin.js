import React, { useEffect, useState } from 'react'
import styles from "./IndexAdmin.module.scss"
import ItemIndex from './ItemIndex/ItemIndex'
import axios from 'axios'

const IndexAdmin = () => {
  const [userStats, setUserStats] = useState();
  const [typeOfContentGlobal, setTypeOfContentGlobal] = useState();
  const [typeOfContentMonthly, setTypeOfContentGlobalMonthly] = useState();
  const [forumsStats, setForumsStats] = useState();

  const fetchUsers = async () => {
    /*const usersData = await axios.get('/user')
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
    )*/

    const usersStats = await axios.get('/user/stats')
    setUserStats({
      user: usersStats.data.user,
      modo: usersStats.data.modo,
      admin: usersStats.data.admin,
      total: usersStats.data.total
    })
  }

  const fetchContentsGlobal = async () => {
    /*const contentData = await axios.get('/article')
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
    }*/
    
    const contentsStats = await axios.get('/article/stats/global')
    setTypeOfContentGlobal(
      {
        article: contentsStats.data.article,
        actuality: contentsStats.data.actuality,
        reference: contentsStats.data.reference,
        total: contentsStats.data.total
      }
    )
  }

  const fetchContentsMonthly = async () => {
    
    const contentsStats = await axios.get('/article/stats/this-month')
    setTypeOfContentGlobalMonthly(
      {
        article: contentsStats.data.article,
        actuality: contentsStats.data.actuality,
        reference: contentsStats.data.reference,
        total: contentsStats.data.total
      }
    )
  }

  const fetchForums = async () => {
    
    const forumsStats = await axios.get('/forum/stats/global')
    setForumsStats(
      {
        opened: forumsStats?.data.opened,
        closed: forumsStats?.data.closed,
        total: forumsStats?.data.total
      }
    )
  }


  useEffect(() => {
    fetchUsers();
    fetchContentsGlobal();
    fetchContentsMonthly();
    fetchForums();
  }, [])
  
  return (
    <>
      <div className={styles.container}>
        <ItemIndex link="user/list" title="Nombre d'utilisateurs au total" number={userStats?.total} text={`Dont ${userStats?.user} utilisateur${userStats?.user > 1 ? "s" : ""} / ${userStats?.modo} modérateur${userStats?.modo > 1 ? "s" : ""} / ${userStats?.admin} administateur${userStats?.admin > 1 ? "s" : ""}`}/>
        {/* <ItemIndex link="user/list" title="Nombre d'utilisateurs total" number="15" text="Roles: 10 utilisateurs / 3 modérateurs / 2 administateurs"/> */}
        {/* <ItemIndex link="user/list" title="Nombre d'utilisateurs total" number="15" text="Roles: 10 utilisateurs / 3 modérateurs / 2 administateurs"/> */}
        <ItemIndex link="content/list" title="Nombre de contenus ajoutés sur le site au total" number={typeOfContentGlobal?.total} text={`Dont: ${typeOfContentGlobal?.article} article${typeOfContentGlobal?.article > 1 ? "s" : ""} / ${typeOfContentGlobal?.actuality} actualité${typeOfContentGlobal?.actuality > 1 ? "s" : ""} / ${typeOfContentGlobal?.reference} contenu${typeOfContentGlobal?.reference > 1 ? "s" : ""} de références`}/>
        <ItemIndex link="content/list" title="Nombre de contenus ajoutés dans le mois" number={typeOfContentMonthly?.total} text={`Dont: ${typeOfContentMonthly?.article} article${typeOfContentMonthly?.article > 1 ? "s" : ""} / ${typeOfContentMonthly?.actuality} actualité${typeOfContentMonthly?.actuality > 1 ? "s" : ""} / ${typeOfContentMonthly?.reference} contenu${typeOfContentMonthly?.reference > 1 ? "s" : ""} de références`}/>
        <ItemIndex link="forum" title="Nombre de forum au total" number={forumsStats?.total} text={`Dont: ${forumsStats?.opened} ouvert${forumsStats?.opened > 1 ? "s" : ""} et ${forumsStats?.closed} fermé${forumsStats?.closed > 1 ? "s" : ""}`}/>
      </div>
    </>
  )
}

export default IndexAdmin