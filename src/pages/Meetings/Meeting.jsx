import React, { useEffect } from "react";

const Meeting = ({ meeting }) => {
  console.log(meeting);
  const onMeeting1Click = () => {
    const meeting = new VideoSDKMeeting();
    const config = {
      name: `${meeting.name}`,
      apiKey: "8769e4f2-f266-4bf6-b0d3-275024b10e0b",
      meetingId: `${meeting.id}`,
      redirectOnLeave: "https://www.videosdk.live/",
      micEnabled: true,
      webcamEnabled: true,
      participantCanToggleSelfWebcam: true,
      participantCanToggleSelfMic: true,
      joinScreen: {
        visible: true,
        title: `${meeting.name}`,
        meetingUrl: `${window.location.href}/${meeting.id}`,
        target: "_blank",
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
    <div className="bg-gray-500/50 p-12 flex flex-col items-center hover:bg-gray-400/50 cursor-pointer">
      <span>
        Title: <b className="text-blue-200">{meeting.name}</b>
      </span>
      <button
        onClick={onMeeting1Click}
        className="bg-blue-500 px-4 py-2 hover:bg-blue-700"
      >
        Join
      </button>
    </div>
  );
};

export default Meeting;
