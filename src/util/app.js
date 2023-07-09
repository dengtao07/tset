import cookie from "cookie_js";
import { getUrlKey } from '../plugins/urlGet'


export function getToken() {
    return sessionStorage.getItem('admin_token')
    // return cookie.get("admin_token")
}

export function setToken(token){
    return sessionStorage.setItem('admin_token', token)
    // return cookie.set("admin_token",token)

}

export function removeToken() {
    return cookie.remove("admin_token")
}
