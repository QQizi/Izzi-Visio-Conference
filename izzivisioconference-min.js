window.izziVisioConference=function(e){var n=this;return n.params={},n.params.localStreamOptions=e,n.RTCPeerConnection=window.mozRTCPeerConnection||window.webkitRTCPeerConnection,n.servers={iceServers:[n.params.localStreamOptions.stun,n.params.localStreamOptions.turn]},n.izziInitLocalStream=function(){n.params.localVideoElement=document.querySelector(n.params.localStreamOptions.localVideoElement);var e={audio:void 0==n.params.localStreamOptions.audio?!0:n.params.localStreamOptions.audio,video:void 0==n.params.localStreamOptions.video?!0:n.params.localStreamOptions.video};navigator.getUserMedia=navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia,navigator.getUserMedia(e,n.izziInitLocalStreamSuccess,n.izziInitLocalStreamError)},n.izziInitLocalStreamSuccess=function(e){n.params.localStreamOptions.localStreamInited(),n.params.localVideoElement.src=URL.createObjectURL(e),n.params.localStream=e,n.params.localVideoElement.play()},n.izziInitLocalStreamError=function(){},n.createLocalConnection=function(e){n.params.localConnectionOptions=e,n.params.localConnection=new n.RTCPeerConnection(n.servers),n.params.localConnection.onicecandidate=n.sendLocalCandidate,n.params.localConnection.addStream(n.params.localStream),n.params.localConnection.createOffer(n.localDescription,n.signalError,{})},n.sendLocalCandidate=function(e){n.params.localConnectionOptions.sendLocalCandidate(e)},n.localDescription=function(e){n.params.localConnection.setLocalDescription(e,function(){n.params.localConnectionOptions.localDescription(e)},function(){})},n.createRemoteConnection=function(e){n.params.remoteConnectionOptions=e,n.params.remoteConnection=new n.RTCPeerConnection(n.servers),n.params.remoteConnection.onicecandidate=n.sendRemoteCandidate,n.params.remoteConnection.onaddstream=n.remoteStream},n.sendRemoteCandidate=function(e){n.params.remoteConnectionOptions.sendRemoteCandidate(e)},n.remoteStream=function(e){n.params.remoteVideoElement=document.querySelector(n.params.remoteConnectionOptions.remoteVideoElement),n.params.remoteVideoElement.src=URL.createObjectURL(e.stream),n.params.remoteVideoElement.play()},n.setRemoteDescription=function(e){n.params.remoteConnection.setLocalDescription(e,function(){},function(){}),n.params.remoteConnection.set_local_description(e)},n.signalError=function(e){console.log("SIGNA ERROR"),console.log(JSON.stringify(e))},n.izziInitLocalStream(),{createLocalConnection:function(e){n.createLocalConnection(e)},setLocalDescription:function(e){n.params.localConnection.setRemoteDescription(new RTCSessionDescription(e.description),function(){},function(){})},setLocalCandidate:function(e){var o=new RTCIceCandidate({sdpMLineIndex:e.candidate.label,candidate:e.candidate.candidate});n.params.localConnection.addIceCandidate(o,function(){},function(){})},createRemoteConnection:function(e){n.createRemoteConnection(e)},remoteDescription:function(e){n.params.remoteConnection.set_local_description=e.set_local_description,n.params.remoteConnection.setRemoteDescription(new RTCSessionDescription(e.description),function(){n.params.remoteConnection.createAnswer(n.setRemoteDescription,n.signalError,{})},function(e){})},setRemoteCandidate:function(e){var o=new RTCIceCandidate({sdpMLineIndex:e.candidate.label,candidate:e.candidate.candidate});n.params.remoteConnection.addIceCandidate(o,function(){},function(){})}}};