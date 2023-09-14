import React from 'react'
import styles from "./Homepage.module.scss"
import RecentArticle from './RecentArticle/RecentArticle';
import Feed from './Feed/Feed'
import ArticlesCategories from './ArticlesCategories/ArticlesCategories';
import HomeLinks from './HomeLinks/HomeLinks';
import axios from 'axios';

const cookies = document.cookie.split(';').map(v => v.split('=')).reduce((acc, v) => {
  acc[decodeURIComponent(v[0]?.trim())] = decodeURIComponent(v[1]?.trim() || '');
  return acc;
}, {})

const rubriqueRaw = await axios.get('/rubrique-type/parents', {headers: {jwt: cookies.token}});
const rubriqueData = rubriqueRaw.data;

rubriqueData?.map((item, index) => {
  axios
    .get(`/article/type/reference/category/${item._id}`, {headers: {jwt: cookies.token}})
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
          <div className={styles.firstline}>
            <RecentArticle/>
            <HomeLinks/>
          </div>
          <div className={styles.artcat}>
            <div className={styles.left}>
              {rubriqueData?.map((item, index) => (
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