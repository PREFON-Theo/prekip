import React from 'react'
import styles from './NotFoundAdmin.module.scss';

const NotFoundAdmin = () => {
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

export default NotFoundAdmin;