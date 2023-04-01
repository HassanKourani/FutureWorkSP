import { useEffect } from "react";

const Meetings = () => {
  let meeting;
  let config;
  useEffect(() => {
    meeting = new VideoSDKMeeting();

    config = {
      name: "Meeting 1",
      apiKey: "8769e4f2-f266-4bf6-b0d3-275024b10e0b",
      meetingId: "MEETING_1",

      redirectOnLeave: "https://www.videosdk.live/",

      micEnabled: true,
      webcamEnabled: true,
      participantCanToggleSelfWebcam: true,
      participantCanToggleSelfMic: true,

      joinScreen: {
        visible: true, // Show the join screen ?
        title: "Meeting 1", // Meeting title
        meetingUrl: window.location.href, // Meeting joining url
      },
      screenShareEnabled: true,
    };
  }, []);

  const handleJoinMeeting = () => {
    console.log("clicked");
    meeting.init(config);
  };

  return (
    <>
      <button onClick={handleJoinMeeting}>Meeting</button>
    </>
  );
};

export default Meetings;
