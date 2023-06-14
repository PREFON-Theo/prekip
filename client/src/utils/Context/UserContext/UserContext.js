import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext({})

export const UserContextProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);
    useEffect(() => {

        if (!user) {
            axios.get('/profil').then(({data}) => {
                setUser(data);
                setReady(true)
            })
        }
    })
    return (
        <UserContext.Provider value={{user, setUser, ready}}>
            {children}
        </UserContext.Provider>
    );
}