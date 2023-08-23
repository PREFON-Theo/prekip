
import React from 'react'
import styles from "./StatsPrefon.module.scss"
import { Link } from "react-router-dom"
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';

const statsInfo = [
  {
    value: 3052,
    text: "Nombre d'affiliation retraite en 2023",
    link: "https://app.serenytics.com/viewer/login",
    currency: "",
    type: "Tous contrats"
  },
  {
    value: 102470267,
    text: "Chiffre d'affaire de PREFON en 2023",
    link: "https://app.serenytics.com/viewer/login",
    currency: "€",
    type: "Versements"
  },
  {
    value: 23054,
    text: "Nombre de prospect créé en 2023",
    link: "https://app.serenytics.com/viewer/login",
    currency: "",
    type: "Particuliers"
  },
]


const StatsPrefon = () => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.title}>Chiffres importants de PREFON</div>

        <div className={styles.stats}>
          {statsInfo.map((item, index) => (
              <div key={index} className={styles.stat_item}>
                <div className={styles.item_number}>{item.value.toLocaleString("fr-FR")  }{item.currency}</div>
                <div className={styles.item_text}>{item.text}</div>
                <div className={styles.more}>
                  <Link to={item.link}>
                    En savoir plus <ArrowForwardRoundedIcon sx={{verticalAlign: 'middle'}}/>
                  </Link>
                </div>
              </div>
          ))}
        </div>

      </div>
    </>
  );
}

export default StatsPrefon;