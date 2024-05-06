import * as React from "react";
import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";

const Room = ({ socket }) => {
  const navigate = useNavigate();
  const value = {
    name: "",
    room: "",
  };
  const [userData, setUserData] = useState(value);
  const { name, room } = userData;

  const handleChange = (name) => (event) => {
    const value = event.target.value;

    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = () => {
    setUserData(value);
    if (room !== "" && name !== "") {
      socket.emit("join_room", { name, room });
      navigate(`/video?name=${name}&room=${room}`);
    }
  };

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Enter Room to Connect
        </Typography>
        <Box
          component="form"
          sx={{
            "& > :not(style)": { my: 1 },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            fullWidth
            id="outlined-basic"
            label="Name"
            variant="outlined"
            value={name}
            onChange={handleChange("name")}
          />
          <TextField
            fullWidth
            id="outlined-basic"
            label="Room"
            variant="outlined"
            value={room}
            onChange={handleChange("room")}
          />
        </Box>
        <div>
          <Button
            fullWidth
            onClick={handleSubmit}
            variant="contained"
            size="small"
          >
            Connect
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Room;
