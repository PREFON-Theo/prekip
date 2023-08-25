import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext({})

export const UserContextProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState("waiting");

    useEffect(() => {
      if (!user) {
        axios.get('/user/profil')
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
      <UserContext.Provider value={{user, setUser, ready, setReady}}>
        {children}
      </UserContext.Provider>
    );
}