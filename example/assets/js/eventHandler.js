var eventHandler = {
	socketEventList : function(){
		/*GENERAL*/
		app.global.socket.on("send_liste_users",function(data){
			app.setUsersListe(data);
		});

		app.global.socket.on("send_user_id",function(data){
			app.global.localID = data.socketID;
		});

		/*LOCAL EVENT HANDLER*/
		app.global.socket.on("set_local_description_event",function(data){
			app.izziVisio.setLocalDescription({
				description : data.data
			});
		});

		app.global.socket.on("add_local_candidate_event",function(data){
			app.izziVisio.setLocalCandidate({
				candidate : data.data
			});
		});

		app.global.socket.on("accepted_call_event",function(data){
			app.acceptedCall();
		});

		/*REMOTE EVENT HANDLER*/
		app.global.socket.on("get_call_event",function(data){
			app.global.pseudoCaller = data.pseudo;
			app.global.idCaller     = data.id;

			$("#popin-call").css("display","block");
			$("#popin-call").find("p").html(app.global.pseudoCaller + " is calling you.");
		});

		app.global.socket.on("set_remote_description_event",function(data){
			app.izziVisio.remoteDescription({
				description : data.data,
				set_local_description : function(description){
					app.global.socket.emit("set_local_description", { data : description, id : app.global.idCaller});
				}
			});
		});

		app.global.socket.on("add_remote_candidate_event",function(data){
			app.izziVisio.setRemoteCandidate({
				candidate : data.data
			});
		});

		app.global.socket.on("end_call_event",function(data){
			app.endCallEvent();
		});
	}
};
