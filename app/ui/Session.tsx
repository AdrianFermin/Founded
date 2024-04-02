'use client'
import { createUserSession } from "../lib/actions/usuario"
import { checkCookie, setCookie } from "../lib/functions"
import { Usuario } from "../lib/types"

const Session = ({token}: {token:string}) => {

    setCookie(token)

    return <></>
}

export default Session