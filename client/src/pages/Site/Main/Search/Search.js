import React, { useEffect, useState } from 'react'
import style from "./Search.module.scss"
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'

const Search = () => {
  const [ params ] = useSearchParams()
  const [articles, setArticles] = useState()
  const [itemFocused, setItemFocused] = useState('')

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


      const articlesRaw = await axios.get(`/article/search/${params.get('q')}${query}`)
      setArticles(articlesRaw.data)
    }
    catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchArticles()
  }, [params])

  return (
    <>
      <div className={style.container}>
        <h2>Résultat pour la rechercher "{params.get('q')}":</h2>

        {articles === undefined ?
          <>Chargement</>
        : 
        
        articles.length === 0 ?

          <>Rien</>
        :
          <div className={style.list_results}>
            {articles?.map((item, index) => (
              <div 
                key={index}
                className={style.item_result}
                onMouseEnter={() => setItemFocused(item._id)}
                onMouseLeave={() => setItemFocused('')}
                style={{filter: itemFocused !== item._id && itemFocused !== '' ? 'blur(4px)' : 'blur(0)'}}
              >
                <div className={style.item_title}>{item.title}</div>
                <div className={style.item_preview}>{item.preview?.length > 100 ? `${item.preview.substring(0, 100)}...` : item.preview}</div>
                <div className={style.item_type}>{item.type}</div>
              </div>
            ))}
          </div>
          
        }

        

      </div>
    </>
  )
}

export default Search