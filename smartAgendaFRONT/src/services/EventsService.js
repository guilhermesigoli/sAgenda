const axios = require('axios');

export default class EventsService{

    async GetEvents(token){
        return await axios.get('http://localhost:8080/events',   {headers: {
            Authorization: token
          }}).then(response => {
            return response
        }).catch(error => {
            return error
        })
    }

    async SaveEvent(event, token){
        // eslint-disable-next-line no-console
        //console.log("event", event, token);
        //if(event.id == 0)
            return await axios.post('http://localhost:8080/events', event, {headers: {
                Authorization: token,
              }}).then(response => {
                return response
            }).catch(error => {
                return error
            });
        //else
            // return await axios.post('http://localhost:8080/events',{headers: {
            //     Authorization: token
            //   }}, event).then(response => {
            //       return response
            // }).catch(error => {
            //     return error
            // })
    }

    async DeleteEvent(id, token){
        return await axios.delete(`http://localhost:8080/events/${encodeURIComponent(id)}`,{headers: {
            Authorization:token
          }}).then(() => {
        }).catch(error => {
            return error
        });
        
    }
}