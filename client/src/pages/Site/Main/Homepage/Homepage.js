import React, { useContext, useEffect, useState } from 'react'
import styles from "./Homepage.module.scss"
import RecentArticle from './RecentArticle/RecentArticle';
import FeedActualities from './FeedActualities/FeedActualities'
import ArticlesCategories from './ArticlesCategories/ArticlesCategories';
import HomeLinks from './HomeLinks/HomeLinks';
import axios from 'axios';
import { UserContext } from '../../../../utils/Context/UserContext/UserContext';
import FeedArticles from './FeedArticles/FeedArticles';


const Homepage = () => {
  const {cookies} = useContext(UserContext)
  const [rubrique, setRubrique] = useState();
  
  const fetchRubriques = async () => {
    const rubriqueRaw = await axios.get('/rubrique-type/parents', {headers: {jwt: cookies.token}});
    let rubtriqueList = rubriqueRaw.data;
    for (let r = 0; r < rubriqueRaw.data?.length; r++) {
      const referenceRaw = await axios.get(`/article/type/reference/category/${rubriqueRaw.data[r]._id}`, {headers: {jwt: cookies.token}})
      const reference = referenceRaw.data
      rubtriqueList[r] = {
        ...rubtriqueList[r],
        reference
      }
    }
    setRubrique(rubtriqueList);
  }

  useEffect(() => {
    fetchRubriques();
  },[])

  return (
    <>
      <div className={styles.container}>
        
        <FeedActualities/>
        <div className={styles.wrapper_main_homepage}>
          <div className={styles.firstline}>
            <RecentArticle/>
            <HomeLinks/>
          </div>
          <FeedArticles/>
          <div className={styles.artcat}>
            <div className={styles.left}>
              {
                !!rubrique
                ?
                  rubrique.map((item, index) => (
                    <ArticlesCategories key={index} item={item}/>
                  ))
                :
                  <>rien</>
                }
            </div>
            <div className={styles.right}></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Homepage;