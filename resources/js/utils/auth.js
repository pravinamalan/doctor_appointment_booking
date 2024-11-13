import Cookies from "js-cookie";

export function setToken(token) {
    return Cookies.set('token', token);
}

export function getToken(token) {
    return Cookies.get(token);
}

export function setRole(role) {
    return Cookies.set('role', role);
}

export function getRole(role) {
    return Cookies.get(role);
}

export function destroyToken(token) {
    return Cookies.remove(token);
}

export function setUser(user) {
    return Cookies.set('user', user);
}

export function getCookieUser(user) {
    return Cookies.get(user);
}

export function destroyUser(user) {
    return Cookies.remove(user);
}

export function destroyRole(role) {
    return Cookies.remove(role);
}
