var webSocket   = null;
var ws_protocol = null;
var ws_hostname = null;
var ws_port     = null;
/**
 * Event handler for clicking on button "Connect"
 */
function onConnectClick() {
    var ws_protocol = document.getElementById("protocol").value;
    var ws_hostname = document.getElementById("hostname").value;
    var ws_port     = document.getElementById("port").value;
    openWSConnection(ws_protocol, ws_hostname, ws_port);
}
/**
 * Event handler for clicking on button "Disconnect"
 */
function onDisconnectClick() {
    webSocket.close();
}
/**
 * Open a new WebSocket connection using the given parameters
 */
function openWSConnection(protocol, hostname, port) {
    var webSocketURL = null;
    webSocketURL = protocol + "://" + hostname + ":" + port;
    console.log("openWSConnection::Connecting to: " + webSocketURL);
    try {
        webSocket = new WebSocket(webSocketURL);
        webSocket.onopen = function(openEvent) {
            console.log("WebSocket OPEN: " + JSON.stringify(openEvent, null, 4));
            document.getElementById("btnSend").disabled       = false;
            document.getElementById("btnRec").disabled     = false;
            document.getElementById("btnStart").disabled      = false;
            document.getElementById("btnStop").disabled       = false;
            document.getElementById("btnStat").disabled       = false;
            document.getElementById("btnConnect").disabled    = true;
            document.getElementById("btnDisconnect").disabled = false;
        };
        webSocket.onclose = function (closeEvent) {
            console.log("WebSocket CLOSE: " + JSON.stringify(closeEvent, null, 4));
            document.getElementById("btnSend").disabled       = true;
            document.getElementById("btnRec").disabled     = true;
            document.getElementById("btnStart").disabled      = true;
            document.getElementById("btnStop").disabled       = true;
            document.getElementById("btnStat").disabled       = true;            
            document.getElementById("btnConnect").disabled    = false;
            document.getElementById("btnDisconnect").disabled = true;
        };
        webSocket.onerror = function (errorEvent) {
            console.log("err: " + JSON.stringify(errorEvent, null, 4));
        };
        webSocket.onmessage = function (messageEvent) {
            var wsMsg = messageEvent.data;
            //console.log("rcv: " + wsMsg);
            if (wsMsg.indexOf("error") > 0) {
                document.getElementById("incomingMsgOutput").value += "error: " + wsMsg.error + "\r\n";
            } else {
                document.getElementById("incomingMsgOutput").value += "message: " + wsMsg + "\r\n";
            }
        };
    } catch (exception) {
        console.error(exception);
    }
}
/**
 * Send a message to the WebSocket server
 */
function onSendClick() {
    if (webSocket.readyState != WebSocket.OPEN) {
        console.error("webSocket is not open: " + webSocket.readyState);
        return;
    }
    var msg = document.getElementById("message").value;
    webSocket.send(msg);
}

function onStartClick() {
    if (webSocket.readyState != WebSocket.OPEN) {
        console.error("webSocket is not open: " + webSocket.readyState);
        return;
    }
    webSocket.send("R");
}

function onRecordClick() {
    if (webSocket.readyState != WebSocket.OPEN) {
        console.error("webSocket is not open: " + webSocket.readyState);
        return;
    }
    webSocket.send("C");
}

function onStopClick() {
    if (webSocket.readyState != WebSocket.OPEN) {
        console.error("webSocket is not open: " + webSocket.readyState);
        return;
    }
    webSocket.send("A");
}

function onStatusClick() {
    if (webSocket.readyState != WebSocket.OPEN) {
        console.error("webSocket is not open: " + webSocket.readyState);
        return;
    }
    webSocket.send("S");
}