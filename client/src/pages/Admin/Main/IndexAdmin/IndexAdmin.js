import React, { useEffect, useState, useContext } from 'react'
import styles from "./IndexAdmin.module.scss"
import ItemIndex from './ItemIndex/ItemIndex'
import axios from 'axios'
import { UserContext } from '../../../../utils/Context/UserContext/UserContext'

const IndexAdmin = () => {
  const {cookies} = useContext(UserContext)
  const [userStats, setUserStats] = useState();
  const [typeOfContentGlobal, setTypeOfContentGlobal] = useState();
  const [typeOfContentMonthly, setTypeOfContentGlobalMonthly] = useState();
  const [forumsStats, setForumsStats] = useState();

  const fetchUsers = async () => {

    const usersStats = await axios.get('/user/stats', {headers: {jwt: cookies.token}})
    setUserStats({
      user: usersStats.data?.user,
      modo: usersStats.data?.modo,
      admin: usersStats.data?.admin,
      total: usersStats.data?.total
    })
  }

  const fetchContentsGlobal = async () => {
    
    const contentsStats = await axios.get('/article/stats/global', {headers: {jwt: cookies.token}})
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
    
    const contentsStats = await axios.get('/article/stats/this-month', {headers: {jwt: cookies.token}})
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
    
    const forumsStats = await axios.get('/forum/stats/global', {headers: {jwt: cookies.token}})
    setForumsStats(
      {
        opened: forumsStats?.data?.opened,
        closed: forumsStats?.data?.closed,
        total: forumsStats?.data?.total
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