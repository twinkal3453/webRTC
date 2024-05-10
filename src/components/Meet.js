import * as React from "react";
import { useState, useEffect, useRef } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Snackbar } from "@mui/material";
import "./Meet.css";
import Video from "./Video";

let servers = {
  iceServers: [
    {
      urls: ["stun:stun1.1.google.com:19302", "stun:stun2.1.google.com:19302"],
    },
  ],
};

const Meet = ({ socket, socketMessage }) => {
  const peerConnection = useRef();
  const [state, setState] = React.useState({
    SnackBarOpen: false,
    vertical: "top",
    horizontal: "right",
    message: "",
  });
  const { vertical, horizontal, SnackBarOpen, message } = state;
  const [open, setOpen] = React.useState(false);
  const [senderName, setSenderName] = useState("");
  const queryParams = new URLSearchParams(window.location.search);
  const name = queryParams.get("name");
  const room = queryParams.get("room");

  //   WebRTC states
  const [localStream, setLocalStream] = useState();
  const [remoteStream, setRemoteStream] = useState();

  const handleClose = () => {
    setOpen(false);
  };

  const handlePeerConnection = async () => {
    peerConnection.current = new RTCPeerConnection(servers);
  };

  useEffect(() => {
    handlePeerConnection();
    if (socketMessage) {
      if (socketMessage.data.socket !== socketMessage.socketId) {
        socket.emit("sendMessage", {
          room: socketMessage.data.room,
          message: "This is the ice Candidates.",
          socketId: socket.id,
          name: name,
          type: "request",
        });
      }
    }
  }, [socketMessage]);

  console.log("Line 51", peerConnection.current);

  /* This `useEffect` hook is setting up a listener for the "message" event on the `socket` object.
  When a "message" event is received, it checks if the `socket.id` of the current socket is not
  equal to the `socketId` received in the data. If they are not equal, it logs the message received
  from the data object to the console with the message "Line 22 receiving". This allows the
  component to listen for incoming messages from other clients via the socket connection. The
  `socket` dependency in the dependency array ensures that this effect runs whenever the `socket`
  object changes. */
  useEffect(() => {
    if (socket) {
      socket.on("message", (data) => {
        if (data.type === "request") {
          if (socket.id !== data.socketId) {
            setTimeout(() => {
              setSenderName(data.name);
              setOpen(true);
            }, 1000);
          }
        } else {
          if (socket.id !== data.socketId) {
            console.log("Line 54", data);
            setState({
              ...state,
              SnackBarOpen: true,
              message: `${data.name} accepted and joined.`,
            });
          }
        }
      });
    }
  }, [socket]);

  //   Accept the approval request.
  const handleApprove = () => {
    socket.emit("sendMessage", {
      room: socketMessage.data.room,
      message: "Ice Candidates received and sent the another one.",
      socketId: socket.id,
      name: name,
      type: "accept",
    });
    handleClose();
  };

  const handleCloseSnackbar = () => {
    setState({ ...state, SnackBarOpen: false });
  };

  useEffect(() => {
    // This shouldn't run on every render either
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        setRemoteStream(stream);
      });
  }, []);

  console.log("Line 106", remoteStream && remoteStream);

  return (
    <React.Fragment>
      <div>
        <div className="videos_list" id="videos">
          <div className="video-player">
            <Video stream={localStream ? localStream : remoteStream} />
          </div>
          {localStream && (
            <div className="video-player1">
              <Video stream={remoteStream} />
            </div>
          )}
        </div>
      </div>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`${senderName} wants to have a Video call.`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please Press Accept to continue.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Deny</Button>
          <Button onClick={handleApprove} autoFocus>
            Accept
          </Button>
        </DialogActions>
      </Dialog>

      {/** Snackbar component */}
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={SnackBarOpen}
        message={message}
        key={vertical + horizontal}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      />
    </React.Fragment>
  );
};

export default Meet;
