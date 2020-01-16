<template>
    <div class="content">
        <div class="card login">
            <p class="title"><i class="zmdi zmdi-calendar-check"></i> Smart<span>Agenda</span></p>
            <p class="message" v-show="showMessage">Ops! Ocorreu um Erro</p>
            <div class="loginForm">
                <div>
                    <label>Login</label>
                    <input name="Login" v-model="form.username" v-validate="'required|max:100'"/>
                    <span class="errorMessage">{{ errors.first('Login') }}</span>
                    <br>
                </div>
                <div>
                    <label>Senha</label>
                    <input type="password" name="Password" v-model="form.password" v-validate="'required|max:20'" data-vv-as="Senha" />
                    <span class="errorMessage">{{ errors.first('Password') }}</span>
                    <br>
                </div>
                <button class="default" @click="submit" :disabled="wait">{{wait? "Aguarde...":"Entrar"}}</button>
            </div>
            <p id="registerLink">Não possui conta? <a href="#" @click="$router.push('/login/registrar')">Registre-se Aqui!</a></p>
        </div>
    </div>
</template>
<script>
import Vue from 'vue'
import {mapActions } from 'vuex'
import VeeValidate, { Validator }  from 'vee-validate';
import ptBr from 'vee-validate/dist/locale/pt_BR';
Vue.use(VeeValidate);
Validator.localize('pt_BR', ptBr);

export default {
    data: function (){
        return{
            form: {
                username: '',
                password: '',
            },
            wait: false,
            showMessage: false,
        }
    },
    methods: {
        ...mapActions(['login']),
        submit(){
            this.$validator.validate().then(async valid => {
                if(valid){
                    this.wait = true;

                    this.login(this.form).then(response => {
                        if(response == 200)
                            this.$router.push('/main/visaogeral');
                        else
                            this.showMessage = true;
                        this.wait = false;
                    }).catch(error => {
                        // eslint-disable-next-line no-console
                        console.log('Erro no Login: ', error);
                        this.wait = false;
                    })
                }
            });
            
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
    padding: 30px 40px;
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

button.default:disabled{
    cursor: not-allowed;
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
</style>