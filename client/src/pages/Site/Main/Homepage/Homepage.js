import React, { useContext, useEffect, useState } from 'react'
import styles from "./Homepage.module.scss"
import RecentArticle from './RecentArticle/RecentArticle';
import Feed from './Feed/Feed'
import ArticlesCategories from './ArticlesCategories/ArticlesCategories';
import HomeLinks from './HomeLinks/HomeLinks';
import axios from 'axios';
import { UserContext } from '../../../../utils/Context/UserContext/UserContext';


const Homepage = () => {
  const {cookies} = useContext(UserContext)
  const [rubrique, setRubrique] = useState();
  
  const fetchRubriques = async () => {
    const rubriqueRaw = await axios.get('/rubrique-type/parents', {headers: {jwt: cookies.token}});
    setRubrique(rubriqueRaw.data);

    rubriqueRaw.data?.map((item, index) => {
      axios
        .get(`/article/type/reference/category/${item._id}`, {headers: {jwt: cookies.token}})
        .then((res) => {
          rubriqueRaw.data[index] = {
            ...item,
            reference: res.data
          }
        })
    })
  }

  useEffect(() => {
    fetchRubriques();
  },[])

  return (
    <>
      <div className={styles.container}>
        
        <Feed/>
        <div className={styles.wrapper_main_homepage}>
          <div className={styles.firstline}>
            <RecentArticle/>
            <HomeLinks/>
          </div>
          <div className={styles.artcat}>
            <div className={styles.left}>
              {rubrique?.map((item, index) => (
                <ArticlesCategories key={index} item={item}/>
              ))}
            </div>
            <div className={styles.right}></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Homepage;