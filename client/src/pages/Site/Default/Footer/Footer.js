import React, { useState } from 'react'
import styles from "./Footer.module.scss"
import { Link } from 'react-router-dom';

const Footer = () => {

const links1 = [
    {
      title: "Twitter",
      link: "https://www.twitter.com",
    },
    {
      title: "Facebook",
      link: "https://www.facebook.com",
    },
    {
      title: "Instagram",
      link: "https://www.instagram.com",
    },
  ];
  
  const links2 = [
    {
      title: "Mon compte",
      link: "/compte",
    },
    {
      title: "Autre",
      link: "/",
    },
    {
      title: "Autre",
      link: "/",
    },
  ];

    return (
        <>
        <footer className={styles.container}>
            <div className={styles.f_top_container}>

            <div className={styles.c_left}>
                <div className={styles.item_footer}>
                    <ul className={styles.fl_ul}>
                        {links1.map((item, index) => (
                            <li key={index}>
                                <Link to={item.link}>{item.title}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className={styles.item_footer}>
                    <ul className={styles.fl_ul}>
                        {links2.map((item, index) => (
                            <li key={index}>
                                <Link to={item.link}>{item.title}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className={styles.c_right}>
                <div className={styles.item_container_right}></div>
            </div>

            </div>

            <div className={styles.f_bottom_container}>

            <div className={styles.fb_left}>PREKIP</div>
            <div className={styles.fb_right}>© {new Date().getFullYear()} PREFON, Inc.</div>

            </div>

        </footer>
        </>
    );
}

export default Footer;