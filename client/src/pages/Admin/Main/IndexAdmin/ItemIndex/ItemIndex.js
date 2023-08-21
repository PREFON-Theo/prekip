import React from 'react'
import styles from "./ItemIndex.module.scss"
import { Link } from 'react-router-dom'

const ItemIndex = ({title, number, text, link}) => {
  return (
    <>
    <div className={styles.container}>
      <Link to={link}>
        <div className={styles.item}>
          <div className={styles.title}>{title}</div>
          <div className={styles.number}>{number}</div>
          <div className={styles.text}>{text}</div>
        </div>
      </Link>
    </div>
    </>
  )
}

export default ItemIndex