# Izzi-visio-conference

 Izzi Visio Conference is the easiest way to set up an audio & video live streaming conference

### Version
1.0

### Basic Usage Example

You can find a fully working exemple in the /example folder. To use it just clone this repo.
 
Use `npm install` then `node socket.js` 

To use Izzi Visio Conference you'll need to handle a bunch of events. You can find an exemple of the server side handle made with node & socket.io in socket.js

You can find an example of the client side event handlers in eventHandler.js

First, you'll need to init Izzi Visio Conference and send to the server your personnal pseudo.

```javascript
app.izziVisio = izziVisioConference({
    stun : {
        urls :'stun:stun.l.google.com:19302'
    },
    turn : {
        urls: 'turn:turn.bistri.com:80',
        credential: 'homeo',
        username: 'homeo'
    },
    audio : true/*default true*/,
    video : true/*default true*/,
    localVideoElement : '#id_video_local_element',
    localStreamInited : function(){
        /*CALLBACK STREAM INITED*/
        app.socket.emit("init_user_media", {pseudo:'my_pseudo'});
    }
});
```

Then there is 2 possibilities : 

- Make a call to an other logged user (app.idCaller) and received the accepted event : 
```javascript
app.socket.on("accepted_call_event",function(data){
    app.izziVisio.createLocalConnection({
            sendLocalCandidate : function(event){
                if(event.candidate){
                    app.global.socket.emit("add_remote_candidate", { data : event.candidate, id : app.idCaller});
                }
            },
            localDescription : function(description){
                app.global.socket.emit("set_remote_description", { data : description, id : app.idCaller});
            }
        });

app.izziVisio.createRemoteConnection({
    remoteVideoElement : '#id_video_remote_element',
    sendRemoteCandidate : function(event){
        if(event.candidate){
            app.global.socket.emit("add_local_candidate", { data : event.candidate, id : app.idCaller});
        }
    }
});
});
```

- Or receive a call and accept it from app.idCaller
```javascript
app.socket.emit("accept_call", { id : app.idCaller});

app.izziVisio.createLocalConnection({
    sendLocalCandidate : function(event){
        if(event.candidate){
            app.global.socket.emit("add_remote_candidate", { data : event.candidate, id : app.idCaller});
        }
    },
    localDescription : function(description){
        app.global.socket.emit("set_remote_description", { data : description, id : app.idCaller});
    }
});

app.izziVisio.createRemoteConnection({
    remoteVideoElement : '#id_video_remote_element',
    sendRemoteCandidate : function(event){
        if(event.candidate){
            app.global.socket.emit("add_local_candidate", { data : event.candidate, id : app.idCaller});
        }
    }
});
```