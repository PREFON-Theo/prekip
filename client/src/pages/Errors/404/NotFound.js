import React from 'react'
import styles from './NotFound.module.scss';

const NotFound = () => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.text}>
          Erreur 404, cette page n'existe pas...
        </div>
      </div>
    </>
  );
}

export default NotFound;