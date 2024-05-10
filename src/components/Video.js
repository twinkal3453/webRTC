import React, { useEffect, createRef } from "react";

const Video = ({ stream }) => {
  const localVideo = createRef();

  // localVideo.current is null on first render
  // localVideo.current.srcObject = stream;

  useEffect(() => {
    // Let's update the srcObject only after the ref has been set
    // and then every time the stream prop updates
    if (localVideo.current) localVideo.current.srcObject = stream;
  }, [stream, localVideo]);

  console.log("Line 17", stream);

  return (
    <video
      style={{ width: "100%", height: "100%" }}
      ref={localVideo}
      autoPlay
    />
  );
};
export default Video;
