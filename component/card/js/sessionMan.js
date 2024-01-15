// import { Session, SessionState, Web } from "sip.js";

// // A Session state change handler which assigns media streams to HTML media elements.
// export function handleStateChanges(
//     session,
//     localVideoElement,
//     remoteVideoElement,
//     localAudioElement,
//     remoteAudioElement
// ) {
//     // Track session state changes and set media tracks to HTML elements when they become available.
//     session.stateChange.addListener((state) => {
//         switch (state) {
//             case SessionState.Initial:
//                 break;
//             case SessionState.Establishing:
//                 break;
//             case SessionState.Established:
//                 const sessionDescriptionHandler = session.sessionDescriptionHandler;
//                 if (
//                     !sessionDescriptionHandler ||
//                     !(sessionDescriptionHandler instanceof Web.SessionDescriptionHandler)
//                 ) {
//                     throw new Error("Invalid session description handler.");
//                 }

//                 if (localVideoElement) {
//                     const localVideoStream = new MediaStream([sessionDescriptionHandler.localMediaStream.getVideoTracks()[0]]);
//                     assignStream(localVideoStream, localVideoElement);
//                 }

//                 if (remoteVideoElement) {
//                     assignStream(
//                         sessionDescriptionHandler.remoteMediaStream, remoteVideoElement
//                     );
//                 }

//                 if (localAudioElement) {
//                     const localAudioStream = new MediaStream([sessionDescriptionHandler.localMediaStream.getAudioTracks()[0]]);
//                     assignStream(localAudioStream, localAudioElement);
//                 }

//                 if (remoteAudioElement) {
//                     assignStream(
//                         sessionDescriptionHandler.remoteMediaStream, remoteAudioElement
//                     );
//                 }
//                 break;
//             case SessionState.Terminating:
//                 break;
//             case SessionState.Terminated:
//                 break;
//             default:
//                 throw new Error("Unknown session state.");
//         }
//     });
// }

// // Assign a MediaStream to an HTMLMediaElement and update if tracks change.
// export function assignStream(stream, element) {
//     if (!(element instanceof HTMLMediaElement)) {
//         throw new Error('The element is not an instance of HTMLMediaElement');
//     }
    
//     element.srcObject = stream;

//     // Load and start playback of media.
//     element.autoplay = true; // Safari does not allow calling .play() from a non-user action
//     element.play().catch((error) => {
//         console.error("Failed to play media");
//         console.error(error);
//     });

//     // If a track is added or removed, restart playback of media.
//     stream.onaddtrack = stream.onremovetrack = () => {
//         element.load(); // Safari does not work otherwise
//         element.play().catch((error) => {
//             console.error("Failed to play media on track change");
//             console.error(error);
//         });
//     };
// }

import { SessionState, Web } from "sip.js";

export function handleStateChanges(
    session,
    localVideoElement,
    remoteVideoElement,
    localAudioElement,
    remoteAudioElement
) {
    session.stateChange.addListener((state) => {
        switch (state) {
            case SessionState.Initial:
            case SessionState.Terminating:
            case SessionState.Terminated:
                break;
            case SessionState.Establishing:
                break;
            case SessionState.Established:
                const sessionDescriptionHandler = session.sessionDescriptionHandler;
                if (!sessionDescriptionHandler || !(sessionDescriptionHandler instanceof Web.SessionDescriptionHandler)) {
                    throw new Error("Invalid session description handler.");
                }

                if (localVideoElement) {
                    const localVideoTracks = sessionDescriptionHandler.localMediaStream.getVideoTracks();
                    if (localVideoTracks.length > 0) {
                        assignStream(sessionDescriptionHandler.localMediaStream, localVideoElement);
                    }
                }

                if (remoteVideoElement) {
                    assignStream(sessionDescriptionHandler.remoteMediaStream, remoteVideoElement);
                }

                if (localAudioElement) {
                    const localAudioTracks = sessionDescriptionHandler.localMediaStream.getAudioTracks();
                    if (localAudioTracks.length > 0) {
                        assignStream(sessionDescriptionHandler.localMediaStream, localAudioElement);
                    }
                }

                if (remoteAudioElement) {
                    assignStream(sessionDescriptionHandler.remoteMediaStream, remoteAudioElement);
                }
                break;
            default:
                throw new Error("Unknown session state.");
        }
    });
}

export function assignStream(stream, element) {
    if (!(element instanceof HTMLMediaElement)) {
        throw new Error('The element is not an instance of HTMLMediaElement');
    }

    if (!stream) {
        console.error("Stream is null or undefined");
        return;
    }

    element.srcObject = stream;

    element.autoplay = true;

    element.play().catch((error) => {
        console.error("Failed to play media");
        console.error(error);
    });

    stream.onaddtrack = stream.onremovetrack = () => {
        element.load();
        element.play().catch((error) => {
            console.error("Failed to play media on track change");
            console.error(error);
        });
    };
}
