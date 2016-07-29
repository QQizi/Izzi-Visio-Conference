var app = {
    global: {
        _WW             : window.innerWidth,
        _WH             : window.innerHeight,

        containerPseudo : $(".form-pseudo"),
        inputPseudo     : $("#pseudo"),
        valuePseudo     : null,

        localVideoPlayer: document.getElementById('localVideo'),
        remoteVid       : document.getElementById('remoteVid'),

        socket          : null
    },
    init: function () {
        app.global.socket = io.connect("http://127.0.0.1:1199");

        eventHandler.socketEventList();
        app.bind();
    },
    acceptedCall : function(){

        app.izziVisio.createLocalConnection({
            sendLocalCandidate : function(event){
                if(event.candidate){
                    app.global.socket.emit("add_remote_candidate", { data : event.candidate, id : app.global.idCaller});
                }
            },
            localDescription : function(description){
                app.global.socket.emit("set_remote_description", { data : description, id : app.global.idCaller});
            }
        });

        app.izziVisio.createRemoteConnection({
            remoteVideoElement : '#remoteVid',
            sendRemoteCandidate : function(event){
                if(event.candidate){
                    app.global.socket.emit("add_local_candidate", { data : event.candidate, id : app.global.idCaller});
                }
            }
        });

    },
    acceptCall : function(){
        app.global.socket.emit("accept_call", { id : app.global.idCaller});

        /*
         *
         * IZZI VISO
         *
         * */

        app.izziVisio.createLocalConnection({
            sendLocalCandidate : function(event){
                if(event.candidate){
                    app.global.socket.emit("add_remote_candidate", { data : event.candidate, id : app.global.idCaller});
                }
            },
            localDescription : function(description){
                app.global.socket.emit("set_remote_description", { data : description, id : app.global.idCaller});
            }
        });

        app.izziVisio.createRemoteConnection({
            remoteVideoElement : '#remoteVid',
            sendRemoteCandidate : function(event){
                if(event.candidate){
                    app.global.socket.emit("add_local_candidate", { data : event.candidate, id : app.global.idCaller});
                }
            }
        });
    },
    setUsersListe : function(data){
        $(".collection").empty();
        $.each(data.users, function(index, value) {

            if(app.global.valuePseudo && value.pseudo != app.global.valuePseudo){
                $(".collection").append('<li data-target="'+value.id+'" class="collection-item">'+value.pseudo+'</li>');
            }

        });
    },
    validatePseudo : function(e){
        if(app.global.inputPseudo.val().length > 0){
            app.global.valuePseudo = app.global.inputPseudo.val();

            app.izziVisio = izziVisioConference({
                stun : {
                    urls :'stun:stun.l.google.com:19302'
                },
                turn : {
                    urls: 'turn:turn.bistri.com:80',
                    credential: 'homeo',
                    username: 'homeo'
                },
                audio : true,
                video : true,
                localVideoElement : '#localVideo',
                localStreamInited : function(){
                    app.global.socket.emit("init_user_media", {'pseudo':app.global.valuePseudo});
                }
            });
        }
    },
    callUser : function(idRemote){

        app.global.socket.emit("make_call", { message : 'make_call', id : idRemote, pseudo : app.global.valuePseudo});

        app.global.idCaller     = idRemote;
    },
    endCall : function(){
        app.global.localConnection.close();
        app.global.remoteConnection.close();

        app.global.socket.emit("end_call", {id : app.global.idRemote});

        app.global.remoteVid.src = '';

        $("#endCall").css("display","none");
    },
    endCallEvent : function(){
        app.global.localConnection.close();
        app.global.remoteConnection.close();

        app.global.remoteVid.src = '';

        $("#endCall").css("display","none");
    },
    bind : function(){
        $(window).bind("resize", function () {
            app.resize();
        });

        $(document).on( 'click', '.collection-item', function(e){
            app.callUser($(this).attr("data-target"));
        });

        $(document).on( 'click', '#endCall', function(e){
            app.endCall();
        });

        $(document).on( 'click', '#accept-call', function(e){
            $("#popin-call").css("display","none");
            app.acceptCall();
        });
    }
};


function addListener(obj, eventName, listener) {
    if(obj.addEventListener) {
        obj.addEventListener(eventName, listener, false);
    } else {
        obj.attachEvent("on" + eventName, listener);
    }
}

addListener(window, "load", app.init);