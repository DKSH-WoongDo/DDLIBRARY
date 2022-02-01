import { Cookies } from "react-cookie";

const cookies = new Cookies();

const cookieHandle = {
    set: (name, value, option) => {
        return cookies.set(name, value, { ...option })
    },
    get: (name) => {
        return cookies.get(name);
    },
    remove: (name) => {
        return cookies.remove(name);
    }
}

export default cookieHandle;