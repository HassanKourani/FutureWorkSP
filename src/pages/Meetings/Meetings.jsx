import React, { useEffect } from "react";

const Meetings = () => {
  const onMeeting1Click = () => {
    const meeting = new VideoSDKMeeting();
    const config = {
      name: "Meeting 1",
      apiKey: "8769e4f2-f266-4bf6-b0d3-275024b10e0b",
      meetingId: "MEETING_1",
      redirectOnLeave: "https://www.videosdk.live/",
      micEnabled: true,
      webcamEnabled: true,
      participantCanToggleSelfWebcam: true,
      participantCanToggleSelfMic: true,
      joinScreen: {
        visible: true,
        title: "Meeting 1",
        meetingUrl: `${window.location.href}/meeting1`,
      },
      screenShareEnabled: true,
    };
    meeting.init(config);
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.addEventListener("load", () => {
      // SDK loaded
    });
    script.src =
      "https://sdk.videosdk.live/rtc-js-prebuilt/0.3.23/rtc-js-prebuilt.js";
    document.getElementsByTagName("head")[0].appendChild(script);

    // Clean up
    return () => {
      document.getElementsByTagName("head")[0].removeChild(script);
    };
  }, []);

  return (
    <div>
      <button onClick={onMeeting1Click}>Open Meeting 1</button>
    </div>
  );
};

export default Meetings;
