import { createContext } from "react";

const cityContext = createContext({
    city:"",
    setCity:()=>{}
});

export default cityContext;