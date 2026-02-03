import React from "react";
import Header from "./Header";
import Fotter from "./Fotter";

const Layout = ({children}) => {
    return (
        <>  
        <Header/>
        {children}
        <Fotter/>   
        </>
        
    )
};

export default Layout;