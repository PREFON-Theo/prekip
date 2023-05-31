import React, { useContext } from 'react'
import styles from "./Account.module.scss"
import { UserContext } from '../../../../utils/Context/UserContext/UserContext';
import { Navigate, Link } from 'react-router-dom';
import MenuFct from '../../Default/Menu/Menu';

const Account = () => {
  const {user, ready} = useContext(UserContext)

  if(!ready) {
    return 'Chargement...';
  }

    

  return (
    <>
    <MenuFct/>
      Account page de {user.username}
      <Link to={'/compte'}>page</Link>
      <Link to={'/compte/user'}>user</Link>
      <Link to={'/compte/admin'}>admin</Link>
    </>
  );
}

export default Account;