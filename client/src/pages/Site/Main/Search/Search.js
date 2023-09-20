import React, { useContext, useEffect, useState } from 'react'
import style from "./Search.module.scss"
import { Link, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import Pagination from '@mui/material/Pagination';
import { FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material'
import DangerousRoundedIcon from '@mui/icons-material/DangerousRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { UserContext } from '../../../../utils/Context/UserContext/UserContext';


const typeData = [
  {
    _id: 1,
    title: "Article",
    value: "article"
  },
  {
    _id: 2,
    title: "Actualité",
    value: "actuality"
  },
  {
    _id: 3,
    title: "Référence",
    value: "reference"
  },
]

const Search = () => {
  const {cookies} = useContext(UserContext)
  const [ params, setParams ] = useSearchParams()
  const [articles, setArticles] = useState()
  //const [itemFocused, setItemFocused] = useState('')
  const [page, setPage] = useState(0);

  const [categorySelected, setCategorySelected] = useState('')
  const [authorSelected, setAuthorSelected] = useState('')
  const [typeSelected, setTypeSelected] = useState('')
  const [authorData, setAuthorData] = useState();

  const [rubrique, setRubrique] = useState();
  
  const fetchRubriques = async () => {
    const rubriqueRaw = await axios.get('/rubrique-type', {headers: {jwt: cookies.token}});
    setRubrique(rubriqueRaw.data);
  }

  useEffect(() => {
    fetchRubriques();
  },[])
  

  const fetchArticles = async () => {
    try {

      let query = ''
      const dateParam = params.get('date') !== undefined && params.get('date') !== null ? `date=${params.get('date')}` : '';
      const categoryParam = params.get('category') !== undefined && params.get('category') !== null ? `category=${params.get('category')}` : '';
      const authorParam = params.get('author') !== undefined && params.get('author') !== null ? `author=${params.get('author')}` : '';
      const typeParam = params.get('type') !== undefined && params.get('type') !== null ? `type=${params.get('type')}` : '';
      query = dateParam !== '' ? `?${dateParam}` : '';
      query = categoryParam === '' ? query : query === '' ? `?${categoryParam}` : `${query}&${categoryParam}`
      query = authorParam === '' ? query : query === '' ? `?${authorParam}` : `${query}&${authorParam}`
      query = typeParam === '' ? query : query === '' ? `?${typeParam}` : `${query}&${typeParam}`

      const authorRaw = await axios.get('/user', {headers: {jwt: cookies.token}});
      setAuthorData(authorRaw.data)
      const articlesRaw = await axios.get(`/article/search/${params.get('q')}${query}`, {headers: {jwt: cookies.token}})
      setArticles(articlesRaw.data)
      setPage(articlesRaw.data?.length > 0 ? 1 : 0)
    }
    catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchArticles()
  }, [params])

  const handleChangePage = (event, value) => {
    setPage(value)
  }

  useEffect(() => {
    setParams({
      "q": params.get('q'),
      "category": categorySelected,
      "author": authorSelected,
      "type": typeSelected,
    })
  }, [categorySelected, authorSelected, typeSelected])


  const changeFilter = async (t, value) => {
    if(t === "Category"){
      setCategorySelected(value)
    }
    else if (t === 'Author'){
      setAuthorSelected(value)
    }
    else if (t === "Type"){
      setTypeSelected(value)
    }
  }
  

  const resetFilters = () => {
    setCategorySelected('')
    setAuthorSelected('')
    setTypeSelected('')
  }

  return (
    <>
      <div className={style.container}>
        <h2>Résultat(s) pour la recherche "{params.get('q')}":</h2>
        <div className={style.filters}>


          <FormControl sx={{width: '250px', marginRight: "50px"}}>
            <InputLabel id="demo-simple-select-label">Filtre des rubriques</InputLabel>
            <Select
              id="demo-simple-select"
              value={categorySelected}
              label="Filtre des rubriques"
              onChange={e => changeFilter("Category", e.target.value)}
            >
              {
                !!rubrique
                ?
                rubrique?.map((item, index) => (
                  <MenuItem key={index} value={item._id} sx={{textAlign: 'left'}}>{item.title}</MenuItem>
                ))
                :
                <MenuItem disabled sx={{textAlign: 'left'}}>Aucune rubrique disponible...</MenuItem>
              }
            </Select>
          </FormControl>

          <FormControl sx={{width: '250px', marginRight: "50px"}}>
            <InputLabel id="demo-simple-select-label">Filtre des auteurs</InputLabel>
            <Select
              id="demo-simple-select"
              value={authorSelected}
              label="Filtre des auteurs"
              onChange={e => changeFilter("Author", e.target.value)}
            >
              {
                !!authorData
                ?
                authorData?.map((item, index) => (
                  <MenuItem key={index} value={item._id} sx={{textAlign: 'left'}}>{item.firstname} {item.lastname}</MenuItem>
                ))
                :
                <MenuItem disabled sx={{textAlign: 'left'}}>Aucun utilisateur disponible...</MenuItem>
              }
            </Select>
          </FormControl>

          <FormControl sx={{width: '250px', marginRight: "50px"}}>
            <InputLabel id="demo-simple-select-label">Filtre des type de contenu</InputLabel>
            <Select
              id="demo-simple-select"
              value={typeSelected}
              label="Filtre des type de contenu"
              onChange={e => changeFilter("Type", e.target.value)}
            >
              {
                !!typeData
                ?
                typeData.map((item, index) => (
                  <MenuItem key={index} value={item.value} sx={{textAlign: 'left'}}>{item.title}</MenuItem>
                ))
                :
                <MenuItem disabled sx={{textAlign: 'left'}}>Aucun type de contenu disponible...</MenuItem>
              }
            </Select>
          </FormControl>

          <Button color="error" size='small' variant='contained' onClick={resetFilters}><DeleteRoundedIcon/></Button>
          
        </div>

        <div className={style.list_results}>
          {articles === undefined ?
            <>Chargement</>
          : articles?.length === 0 ?
          <div 
            className={style.no_result}
          >
            <>Aucun résultat...</>
          </div>
          :
          articles?.slice(((page-1)*5) , (page*5)).map((item, index) => (
            <div 
              key={index}
              className={style.item_result}
            >
              <Link style={{textDecoration: "none"}} to={`/${item.type}/${item._id}`}>
                <div className={style.item_title}>{item.title}</div>
                <div className={style.item_preview}>{item.preview?.length > 100 ? `${item.preview.substring(0, 100)}...` : item.preview}</div>
                <div className={style.item_type}>
                  {typeData.filter((t) => t.value === item.type)[0].title} par {authorData?.filter((auth) => auth._id === item.author)[0]?.firstname === undefined
                    ? <span style={{fontStyle:"italic"}}>utilisateur inconnu</span> 
                    : `${authorData?.filter((auth) => auth._id === item.author)[0].firstname} ${authorData?.filter((auth) => auth._id === item.author)[0].lastname}`
                  }
                </div>
              </Link>
            </div>
          ))}
          <Pagination count={articles?.length/5 | 0} page={page} onChange={handleChangePage}/>
        </div>

      </div>
    </>
  )
}

export default Search