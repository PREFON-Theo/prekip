import React, { useContext } from 'react'
import styles from "./Account.module.scss"
import { UserContext } from '../../../../utils/Context/UserContext/UserContext';
import { Navigate, Link, Routes, Route } from 'react-router-dom';
import Second from "../Second/Second"

const Account = () => {
  const {user, ready} = useContext(UserContext)

  if(!ready) {
    return 'Chargement...';
  }

    

  return (
    <>
      Account page de {user.username}
    </>
  );
}

export default Account;