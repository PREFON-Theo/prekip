import React from 'react'
import styles from "./Homepage.module.scss"
import RecentArticle from './RecentArticle/RecentArticle';
import Feed from './Feed/Feed'
import ArticlesCategories from './ArticlesCategories/ArticlesCategories';
import HomeLinks from './HomeLinks/HomeLinks';
import axios from 'axios';


const rubriqueRaw = await axios.get('/rubrique-type/parents');
const rubriqueData = rubriqueRaw.data;

rubriqueData.map((item, index) => {
  axios
    .get(`/article/type/reference/category/${item._id}`)
    .then((res) => {
      rubriqueData[index] = {
        ...item,
        reference: res.data
      }
    })
})



const Homepage = () => {
  return (
    <>
      <div className={styles.container}>

        <Feed/>
        <div className={styles.wrapper_main_homepage}>
          <RecentArticle/>
        </div>

        {/* <div className={styles.firstline}>

          <div className={styles.left}>
            <RecentArticle/>

            <div className={styles.artcat}>
              {rubriqueData?.map((item, index) => (
                <ArticlesCategories key={index} title={item.title} itemArticle={item.reference}/>
              ))}
            </div>

          </div>


          <div className={styles.right}>
            <Feed/>
            <HomeLinks/>

          </div>

        </div> */}

      </div>
    </>
  );
}

export default Homepage;