<template>
    <div class="content">
        <div class="card login">
            <p class="title"><i class="zmdi zmdi-calendar-check"></i> Smart<span>Agenda</span></p>
            <p class="message" :class="success? 'success':''" v-show="showMessage">{{success? "Cadastro Efetuado!" : "Ops! Ocorreu um Erro"}}</p>
            <div class="loginForm">
                <div>
                    <label>Login</label>
                    <input name="Login" v-model="user.username" 
                    v-validate="'required|max:100'"/>
                    <span class="errorMessage">{{ errors.first('Login') }}</span>
                    <br>
                </div>
                <div>
                    <label>Senha</label>
                    <input type="password" name="Password" v-model="user.password" 
                    v-validate="'required|max:20|min:6'" data-vv-as="Senha" ref="password"/>
                    <span class="errorMessage">{{ errors.first('Password') }}</span>
                    <br>
                </div>
                <div>
                    <label>Confirmar Senha</label>
                    <input type="password" name="ConfirmPassword" v-model="user.confirmPassword" 
                    v-validate="'required|confirmed:password'" data-vv-as="Confirmar Senha"/>
                    <span class="errorMessage">{{ errors.first('ConfirmPassword') }}</span>
                </div>
                <button class="default" @click="register()" :disabled="wait">{{wait? 'Aguarde...' : "Cadastrar"}}</button>
            </div>
            <p id="registerLink">Já possui conta? <a href="#" @click="$router.push('/login/acessar')">Entrar</a></p>
        </div>
    </div>
</template>
<script>
import Vue from 'vue'
import LoginService from "@/services/LoginService.js"
const loginService = new LoginService();
import VeeValidate, { Validator }  from 'vee-validate';
import ptBr from 'vee-validate/dist/locale/pt_BR';
Vue.use(VeeValidate);
Validator.localize('pt_BR', ptBr);
export default {
    data: function(){
        return{
            user:{
                username: "",
                password: "",
                confirmPassword: "",
            },
            success: false,
            showMessage: false,
            wait: false,
        }
    },
    methods: {
        clear(){
            this.user.username = "";
            this.user.password = "";
            this.user.confirmPassword = "";
            this.$validator.reset();
        },
        async register(){
            this.wait = true;
            await this.$validator.validate().then(async valid => {
                if(valid){
                    await loginService.register(this.user).then(response => {
                        if(response.status == 200){
                            this.success = true;
                            this.clear();
                        }
                    }).catch(error => {
                        // eslint-disable-next-line no-console
                        console.log(error);
                    })
                }
            });
            this.showMessage = true;
            this.wait = false;
        }
    }
}
</script>
<style scoped>
.title{
    font-size: 22px;
    text-align: center;
    color: #3E76C2
}
.title>span{
    font-weight: bold;
}

.loginForm{
    padding: 10px 40px;
}
.loginForm>div{
    display: flex;
    flex-direction: column
}

button.default{
    height: 35px;
    width: 100%;
    border-radius: 3px;
    color: white;
    background-color: #3962a7;
    border: 1px solid #3962a7;
    cursor: pointer;
    margin-top: 20px;
    transition: all 0.5s ease;
}

button.default:hover{
    background-color: #32548e;
    border: 1px solid #32548e;
}

#registerLink{
    text-align: center;
    font-size: 14px;
    color: #3f3f3f;
}

#registerLink>a{
    color: #3962a7;
    cursor: pointer;
    text-decoration: none;
}

.default:disabled{
    cursor: not-allowed;
}

.message{
    background-color: #ea5353;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    margin: 10px;
    color: white;
}

.message.success{
    background-color: #50FF7E;
}
</style>