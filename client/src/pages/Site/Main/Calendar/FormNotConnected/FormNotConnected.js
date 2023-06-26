import React, { useEffect, useState } from 'react'
import styles from "./FormNotConnected.module.scss"

import Button from '@mui/material/Button';



const FormNotConnected = ({handleCloseForm, handleOpenLoginForm}) => {
  
  const handleClick = () => {
    handleCloseForm()
    handleOpenLoginForm()
  }

  return (
    <>
      <div className={styles.container}>
        <h1>
          Vous n'êtes pas connecté, vous ne pouvez pas créer d'évènement
        </h1>
        <div className={styles.container_inputs}>
          <Button variant='contained' color='success' onClick={() => handleClick()}>Connectez-vous</Button>
        </div>
      </div>
    </>
  )
}

export default FormNotConnected