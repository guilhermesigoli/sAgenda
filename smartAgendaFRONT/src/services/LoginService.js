const axios = require('axios');

export default class LoginService{
    async login(user){
        return await axios.post('http://localhost:8080/login', user).then(response => {
            return response
        }).catch(error => {
            return error
        })
    }
    
    async register(user){
        return await axios.post('http://localhost:8080/user', user).then(response => {
            return response
        }).catch(error => {
            return error
        })
    }
}