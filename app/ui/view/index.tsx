import React from "react";
 
export function RenderIf({render=true, children}:{render:boolean, children:React.ReactNode}){
    return render? children : null;
}