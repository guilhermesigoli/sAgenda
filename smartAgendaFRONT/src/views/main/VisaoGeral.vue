<template>
    <div class="content">
        <div class="card">
            <div v-show="!addNewEvent && edit == -1">
                <div class="header">
                    <p>Eventos</p>
                    <button @click="addNewEvent = true"><i class="zmdi zmdi-plus"></i></button>
                </div>
                <div class="cBody">
                    <div>
                        <p class="noEvents" v-if="events.length == 0">{{wait? 'Carregando...' : 'Nenhum evento encontrado'}}</p>
                    <perfect-scrollbar class="scroll">
                    <div class="eventCard" v-for="(e,index) in events" :key="index+'e'" @click="editEvent(index)">
                        <div class="eventInfo">
                            <p class="eventName">{{e.name}}</p>
                            <p class="eventDate">{{e.date}} - {{e.startHour}}{{e.endHour != ""? " até "+e.endHour : ""}}</p>
                            
                        </div>
                        <div class="edit">
                            <img src="../../assets/edit.png"/>
                        </div>
                    </div>
                    </perfect-scrollbar>
                    </div>
                </div>
            </div>
            <div v-show="addNewEvent || edit != -1">
                <div class="header">
                    <p>Novo Evento</p>
                    <button @click="clear()" class="exit"><i class="zmdi zmdi-plus"></i></button>
                </div>
                <div class="cBody event">
                    <div>
                        <label>Nome do Evento</label>
                        <input v-model="event.name" 
                        placeholder="Nome do evento"
                        v-validate="'required|max:30'"
                        data-vv-as="Nome"
                        name="eventName"/>
                        <span class="errorMessage">{{ errors.first('eventName') }}</span>
                        <br>
                    </div>
                    <div>
                        <label>Data</label>
                        <date-picker
                        v-model="event.date"
                        value-type="format"
                        format="DD/MM/YYYY"
                        v-validate="'required'"
                        data-vv-as="Data"
                        name="Date"
                        :disabled-date="notBeforeToday"
                        placeholder="Selecione o dia"></date-picker>
                        <span class="errorMessage">{{ errors.first('Date') }}</span>
                        <br>
                    </div>
                    <div>
                        <label>Hora de Início</label>
                        <date-picker 
                            v-model="event.startHour"
                            format="HH:mm"
                            value-type="format"
                            type="time"
                            placeholder="Selecione a hora">
                        </date-picker>
                        <br>
                    </div>
                    <div>
                        <label>Hora de Término</label>
                        <date-picker 
                            v-model="event.endHour"
                            format="HH:mm"
                            value-type="format"
                            type="time"
                            placeholder="Selecione a hora">
                        </date-picker>
                        <span class="errorMessage" v-show="timeError">O horário de término deve pertencer ao mesmo dia do evento.</span>
                        <br>
                    </div>
                    <div class="foot">
                        <button class="deleteButton" @click="deleteEvent" v-show="edit != -1" :disabled="wait">{{wait? 'Aguarde...' : 'Excluir'}}</button>
                        <button class="eventButton" @click="saveEvent" v-show="edit != -1" :disabled="wait">{{wait? 'Aguarde...':'Salvar'}}</button>
                        <button class="eventButton" @click="saveEvent" v-show="edit == -1" :disabled="wait">{{wait? 'Aguarde...':'Criar Evento'}}</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Vue from 'vue'
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import EventsService from '@/services/EventsService.js';
const EService = new EventsService();
import VeeValidate, { Validator }  from 'vee-validate';
import ptBr from 'vee-validate/dist/locale/pt_BR';
Vue.use(VeeValidate);
Validator.localize('pt_BR', ptBr);
const today= new Date();
today.setHours(0, 0, 0, 0);
export default {
    components: {
        DatePicker: DatePicker
    },
    data: function(){
        return{
            edit: -1,
            addNewEvent: false,
            event:{
                id: 0,
                name: "",
                date: "",
                startHour: "",
                endHour: "",
            },
            events: [],
            wait: false,
            timeError: false,
        }
    },
    methods: {
        clear(){
            this.event.id = "";
            this.event.name = "";
            this.event.date = "";
            this.event.startHour = "";
            this.event.endHour = "";
            this.addNewEvent = false;
            this.edit = -1;
            this.$validator.reset();
            this.timeError = false;
        },
        notBeforeToday(date) {
            return date < today;
        },
        calDate(){
            
            
        },
        async saveEvent(){
            this.$validator.validate().then(async valid => {
                if(valid){
                    if (this.event.endHour != "" && this.event.endHour <= this.event.startHour){
                        this.timeError = true;
                        return
                    }
                    this.wait = true;
                    var event = JSON.parse(JSON.stringify(this.event));
                    await EService.SaveEvent(event, this.$store.state.token).then(response => {
                        if(this.edit != -1)
                            this.events.forEach((e, i)=>{
                                if(e.id == this.event.id)
                                    this.events[i] = JSON.parse(JSON.stringify(this.event));
                            });
                        else
                            this.events.push(response.data);
                        this.clear();
                    }).catch(error=>{
                        // eslint-disable-next-line no-console
                        console.log(error);
                        
                    })
                    // .finally(() =>{
                    //     this.clear();
                    // })
                    this.wait = false;
                }
            });
            
        },

        editEvent(index){
            let event = this.events[index];
            this.event.name = event.name;
            this.event.id = event.id;
            this.event.date = event.date;
            this.event.startHour = event.startHour;
            this.event.endHour = event.endHour;
            this.edit = index;
        },

        async deleteEvent(){
            this.wait = true;
            await EService.DeleteEvent(this.events[this.edit].id, this.$store.state.token).then(response => {
                if(response == 200){
                    this.events.splice(this.edit, 1);
                    this.clear();
                }
            }).catch(error => {
                // eslint-disable-next-line no-console
                console.log(error);
            })
            this.wait = false;
        },
        async GetEvents(){
            this.wait = true;
            await EService.GetEvents(this.$store.state.token).then(response=>{
                if(response.status == 200)
                    this.events = response.data;
            }).catch(error => {
                // eslint-disable-next-line no-console
                console.log(error);
            })
            this.wait = false;
        }
    },
    async mounted () {
        if(this.$store.state.token == ""){
            this.$router.push("/login/acessar");
            return;
        }
        await this.GetEvents();
    }
}
</script>
<style scoped>
.header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-content: center;
    padding: 20px 15px;
}
.header>p{
    color: #83B7FF;
    font-size: 24px;
    margin: 0;
    font-weight: bold
}
.header>button{
    width: 35px;
    height: 35px;
    border-radius: 50px;
    border: none;
    background-color: #50FF7E;
    color: white;
    font-size: 25px;
    cursor: pointer;
    transition: all 0.5s ease;
}

.header>button:hover{
    background-color: #3edc68;
}

.cBody{
    padding: 5px 10px;
    margin-bottom: 10px;
}

.cBody.event{
    padding: 5px 15px;
}

.cBody.event>div:not(.foot){
    display: flex;
    flex-direction: column;
}

.eventCard{
    display: flex;
    justify-content: space-between;
    align-content: center;
    align-items: center;
    border: 1px solid #F2F2F2;
    border-radius: 5px;
    box-shadow: 2px 3px 4px #d2d2d2;
    padding: 10px;
    transition: all 0.5s ease;
    cursor: pointer;
    margin-bottom: 15px;
}
.eventCard:hover{
    box-shadow: 2px 3px 4px #b1b1b1;
}
.eventInfo>p{
    margin: 0px;
}

.eventName{
    color: #818181;
    font-size: 18px;
    margin-bottom: 2px;
}

.eventDate{
    color: #818181;
    font-size: 12px;
}

.filter{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin: 0px 0px 20px 10px;
}

img{
    width: 20px;
}

.filter>input{
    margin: 0px 0px 0px 10px;
}

.exit{
    transform: rotate(45deg);
    background-color: #ea5353 !important;
}

.eventButton{
    height: 35px;
    color: white;
    border: none;
    border-radius: 3px;
    background-color: #4be474;
    width: 100%;
    cursor: pointer;
    transition: all 0.5s ease;
}

.eventButton:hover{
    background-color: #42c365
}

.eventButton:disabled{
    background-color: #80bf91;
    cursor: not-allowed
}

.foot{
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
}

.deleteButton{
    height: 35px;
    color: #ea5353;
    cursor: pointer;
    width: 100%;
    border: none;
    background-color: transparent;
}

.noEvents{
        text-align: center;
    color: gray;
    background-color: #f7f7f7;
    padding: 10px;
    border: none;
    border-radius: 10px;
}
</style>