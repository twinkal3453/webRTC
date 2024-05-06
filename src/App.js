import "./App.css";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import Room from "./components/Room";
import Meet from "./components/Meet";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./ErrorPage";

const socket = io.connect("http://localhost:4000");

const App = () => {
  const [socketMessage, setSocketMessage] = useState("");

  useEffect(() => {
    socket.on("receive_message", (data) => {
      const wsData = {
        data: data,
        socketId: socket.id,
      };
      setSocketMessage(wsData);
    });

    // Remove event listener on component unmount
    return () => socket.off("receive_message");
  }, [socket]);

  // all routers goes here
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Room socket={socket} />,
      errorElement: <ErrorPage />,
    },
    {
      path: "video",
      element: <Meet socket={socket} socketMessage={socketMessage} />,
      errorElement: <ErrorPage />,
    },
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
