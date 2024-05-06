import * as React from "react";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const Meet = ({ socket, socketMessage }) => {
  const [open, setOpen] = React.useState(false);
  const [senderName, setSenderName] = useState("");
  const queryParams = new URLSearchParams(window.location.search);
  const name = queryParams.get("name");
  const room = queryParams.get("room");

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (socketMessage) {
      if (socketMessage.data.socket !== socketMessage.socketId) {
        socket.emit("sendMessage", {
          room: socketMessage.data.room,
          message: "This is the ice Candidates.",
          socketId: socket.id,
          name: name,
        });
      }
    }
  }, [socketMessage]);

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
        if (socket.id !== data.socketId) {
          setTimeout(() => {
            setSenderName(data.name);
            setOpen(true);
          }, 1000);
        }
      });
    }
  }, [socket]);

  return (
    <React.Fragment>
      <div>
        <h4>Welcomet to meet wait for approval</h4>
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
          <Button onClick={handleClose} autoFocus>
            Accept
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default Meet;
