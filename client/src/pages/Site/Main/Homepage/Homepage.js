import React from 'react'
import styles from "./Homepage.module.scss"
import RecentArticle from './RecentArticle/RecentArticle';
import Feed from './Feed/Feed'
import ArticlesCategories from './ArticlesCategories/ArticlesCategories';

const contentArticlesCategInfo = {
  title: "Informatique",
  itemImg : {
    title: "Qualifications EHF Euro 2022 France-Ukraine - Le Havre",
    img: "http://prekip.prefon.local/sites/default/files/styles/large/public/field/image/miniature_3.png?itok=_ZrmRwzc",
    alt: "Prefon img"
  },
  itemArticle: [
    {
      id: 1,
      title: "L'essor de l'intelligence artificielle : comment cette technologie révolutionne notre quotidien",
    },
    {
      id: 2,
      title: "Les enjeux de la cybersécurité : comment protéger vos données personnelles en ligne",
    },
    {
      id: 3,
      title: "L'avenir de l'informatique quantique : vers une nouvelle ère de calculs puissants",
    },
    {
      id: 4,
      title: "L'impact de la 5G sur l'industrie de l'informatique : une révolution de la connectivité",
    },
    {
      id: 5,
      title: "Les tendances émergentes de l'informatique en nuage : vers une transformation numérique complète",
    },
    {
      id: 6,
      title: "L'éthique dans l'intelligence artificielle : les défis et les solutions pour des décisions justes et transparentes",
    },
  ],

}

const contentArticlesCategRH = {
  title: "Ressources Humaines",
  itemImg : {
    title: "Accès Nouveau Service",
    img: "http://prekip.prefon.local/sites/default/files/styles/large/public/field/image/frame_411_002.png?itok=5beTcFSc",
    alt: "Prefon img RH"
  },
  itemArticle: [
    {
      id: 1,
      title: "L'importance de la communication interne : créer un environnement de travail collaboratif chez PREFON",
    },
    {
      id: 2,
      title: "Comment favoriser le bien-être des employés chez PREFON : les initiatives en matière de ressources humaines",
    },
    {
      id: 3,
      title: "Le développement professionnel chez PREFON : comment investir dans nos talents internes",
    },
    {
      id: 4,
      title: "La gestion du changement chez PREFON : impliquer les collaborateurs pour assurer une transition réussie",
    },
    {
      id: 5,
      title: "Promouvoir la diversité et l'inclusion chez PREFON : construire une culture d'entreprise respectueuse",
    },
    {
      id: 6,
      title: "Le leadership chez PREFON : les compétences essentielles pour guider nos équipes vers le succès",
    },
  ],

}


const Homepage = ({ handleOpenAlert, changeAlertValues }) => {
  return (
    <>
      <div className={styles.container}>

        <div className={styles.firstline}>

          <div className={styles.left}>
            <RecentArticle/>

            <div className={styles.artcat}>
              <ArticlesCategories title={contentArticlesCategInfo.title} itemImg={contentArticlesCategInfo.itemImg} itemArticle={contentArticlesCategInfo.itemArticle}/>
              <ArticlesCategories title={contentArticlesCategRH.title} itemImg={contentArticlesCategRH.itemImg} itemArticle={contentArticlesCategRH.itemArticle}/>
            </div>

          </div>


          <div className={styles.right}>
            <Feed/>

          </div>

        </div>

      </div>
    </>
  );
}

export default Homepage;