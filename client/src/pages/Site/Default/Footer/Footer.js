import React, { useState } from 'react'
import styles from "./Footer.module.scss"
import { Link } from 'react-router-dom';

import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';

const Footer = () => {

const links1 = [
    {
      icon: `${<TwitterIcon/>}`,
      title: "Twitter",
      link: "https://www.twitter.com/Prefon_Asso",
    },
    {
      icon: `${<FacebookIcon/>}`,
      title: "Facebook",
      link: "https://www.facebook.com/PrefonAsso/",
    },
    {
      icon: `${<InstagramIcon/>}`,
      title: "Instagram",
      link: "https://www.instagram.com/prefonhandball",
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
                  <li>
                    <Link to="https://www.twitter.com/Prefon_Asso" target='_blank'><TwitterIcon sx={{verticalAlign:"bottom"}} fontSize='small'/> Twitter</Link>
                  </li>

                  <li>
                    <Link to="https://www.facebook.com/PrefonAsso/" target='_blank'><FacebookIcon sx={{verticalAlign:"bottom"}} fontSize='small'/> Facebook</Link>
                  </li>

                  <li>
                    <Link to="https://www.instagram.com/prefonhandball" target='_blank'><InstagramIcon sx={{verticalAlign:"bottom"}} fontSize='small'/> Instagram</Link>
                  </li>
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
            <div className={styles.fb_right}>© {new Date().getFullYear()} PREFON</div>

          </div>

        </footer>
      </>
    );
}

export default Footer;