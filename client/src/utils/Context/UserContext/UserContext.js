import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext({})

export const UserContextProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState("waiting");
    
    const cookies = document.cookie.split(';').map(v => v.split('=')).reduce((acc, v) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      return acc;
    }, {})

    useEffect(() => {
      if (!user) {
        axios.get('/user/profil', {headers: {jwt: cookies.token}})
        .then(({data}) => {
          if(data === null) {
            setReady("no")
          }
          else {
            setUser(data);
            setReady("yes")
          }
        })
      }
    })
    return (
      <UserContext.Provider value={{user, setUser, ready, setReady, cookies}}>
        {children}
      </UserContext.Provider>
    );
}