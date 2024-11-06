---
slug: case-study-custom-react-hooks-in-a-push-to-talk-web-application
title: 'Case Study: Custom React Hooks in a Push-to-Talk (PTT) Web Application'
date: 2024-11-02
updated: 2024-11-06
authors:
  - Richard Dominick
---

Recently, I had a school project. In the project, we are supposed to create a push-to-talk web application. The sender will stream their audio via a WebSockets connection to a server, which will relay the audio to the listener. Not only that, we had to use the [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) to process the audio data on the sender and listener's devices. This meant that there was a high chance of coupling, not only between the UI component and application logic, but especially between the audio processing logic and the WebSocket streaming logic. Thus, in order to make it reusable, I wanted to enforce some separation of concerns from the get-go. It was decided: they will become custom React hooks.

## What is Coupling

Coupling is a term used in software engineering to describe how much one part of a system relies on another part. In general, the less coupling there is between different parts of a system, the easier it is to maintain and extend that system. You can find more information about coupling in [this SE-EDU textbook](https://se-education.org/se-book/designFundamentals/coupling/index.html#coupling). In practice, I often find its most common symptom: functions or components that are "doing more than one thing".

## Coupling in a Push-to-Talk Web Application

We are using React for our project. Generally, using React already enforces some kind of separation of concerns. In most tutorials or examples, you will see that the UI logic is separated from the application logic. This is usually done by separating the application logic like data fetching, or state management, into functions or [hooks](https://react.dev/reference/react/hooks).

The problem comes when the application logic itself involves multiple components that are not necessarily related to each other. For example, in our push-to-talk application, the audio processing logic and the WebSocket streaming logic are always used together in the same component. Moreover, being native browser JavaScript APIs, there is not much flexibility in fitting the code to suit React's declarative-style programming.

These make it tempting to combine the two logics into one function or hook. In fact, I must say, it is much easier to do so. Just for fun, I tried feeding the requirements into various LLMs and they are not able to come up with a working solution, even after a lot of hinting.

### Premature Optimization: A Design Decision

> _But wait, why is it bad to combine the two logics into one function or hook? Aren't we always using the two together? Premature optimization is bad, right?_

I agree that premature optimization is not always the best thing to do, and it really depends on the context of your use case. Arguably, with the age of LLMs that can (most of the time) write code as instructed, the ability to design and architect software and write good code is becoming more important. It involves analyzing your use case and making decisions like these, that may not always have a clear answer.

In our case, we had to implement a collision-control mechanism as part of the project requirements. This means only one person can speak at a time, similar to how conference room microphones work.

We handle this by using a centralized server to manage clients, and RTS/CTS (Request to Send/Clear to Send) messages. Naturally, the audio processing logic does not need to know about this. It only needs to know when to start and stop processing audio data; only the WebSocket streaming logic needs to know about the collision-control mechanism that is in-play.

That was a sign to me to start to enforce the abstraction early. As the project grew, the collision control mechanism was not the only WebSocket-specific logic that was added. We also added metadata messages like sender information, and a way to send messages to the server. Luckily, our abstraction was already in place, so implementing these were relatively simple.

## React Hooks Implementation

It might be best to jump straight to the code and see it in action. Our custom `useStreaming` hook is as follows:

```tsx
import { useCallback, useEffect, useState } from 'react';

type StreamingState = 'off' | 'on' | 'waiting';

export const useStreaming = (wsEndpoint: string) => {
  const [state, setState] = useState<StreamingState>('off');

  const [wsClient, setWsClient] = useState<WebSocket | null>(null);
  useEffect(() => {
    const client = new WebSocket(wsEndpoint);

    // Add more event listeners here as needed...
    // client.onopen = ...
    // client.onclose = ...

    client.onmessage = ({ data }) => {
      if (data == 'CTS') {
        setState(() => 'on');
      }
    };

    setWsClient(client);

    return () => {
      client.close();
      setWsClient(null);
    };
  }, [wsEndpoint]);

  const rawSend = useCallback(
    (data: string | Blob) => {
      if (wsClient?.readyState === WebSocket.OPEN) {
        wsClient.send(data);
      }
    },
    [wsClient],
  );

  const send = useCallback(
    (data: Blob) => {
      if (state !== 'on') {
        // Don't send packets before CTS is received
        return;
      }
      rawSend(data);
    },
    [rawSend, state],
  );

  const beginStream = useCallback(() => {
    setState(() => 'waiting');
    rawSend(`RTS$`);
  }, [rawSend]);

  const endStream = useCallback(() => {
    rawSend('STOP');
    setState(() => 'off');
  }, [rawSend]);

  return { state, send, beginStream, endStream };
};
```

Meanwhile, our custom `useAudioRecording` hook is as follows:

```tsx
import { useCallback, useEffect, useState } from 'react';

const MIMETYPE = 'audio/webm; codecs=opus';
const getAudioStream = () =>
  navigator.mediaDevices.getUserMedia({ audio: true });

type AudioRecordingOptions = {
  onData: (data: Blob) => void;
};

export const useAudioRecording = ({ onData }: AudioRecordingOptions) => {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );

  useEffect(() => {
    if (!mediaRecorder) {
      return;
    }

    const handleData = (event: BlobEvent) => {
      if (event.data.size > 0) {
        onData(event.data);
      }
    };
    mediaRecorder.ondataavailable = handleData;
  }, [mediaRecorder, onData]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await getAudioStream();
      const recorder = new MediaRecorder(stream, { mimeType: MIMETYPE });
      setMediaRecorder(recorder);
      recorder.start(100); // Send data every 100ms
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorder?.state === 'recording') {
      mediaRecorder.stop();
    }
    mediaRecorder?.stream.getTracks().forEach((t) => t.stop());
  }, [mediaRecorder]);

  return { start: startRecording, stop: stopRecording };
};
```

_Phew, those were quite some long hooks! Credit goes to [this blog post](https://www.cybrosys.com/blog/how-to-implement-audio-recording-in-a-react-application) for the initial setup on getting Web Audio API to work in a React application, which I heavily adapted into a custom hook for better separation of concerns from the actual UI component._

## Usage

Now that we have our custom hooks, we can use them in our components like so:

```tsx
const wsEndpoint = 'ws://your-ws-server-endpoint';

const Room: React.FC = () => {
  const { state, send, beginStream, endStream } = useStreaming(wsEndpoint);
  const { start, stop } = useAudioRecording({ onData: send });

  const [transmitting, setTransmitting] = useState(false);
  useEffect(() => {
    if (transmitting && state === 'on') {
      start();
    } else {
      stop();
    }
  }, [state, transmitting]);

  return (
    <div>
      <button
        onClick={() => {
          beginStream();
          setTransmitting(true);
        }}
      >
        Start Transmission
      </button>
      <button
        onClick={() => {
          endStream();
          setTransmitting(false);
        }}
      >
        Stop Transmission
      </button>
      <p
        className={clsx(
          state === 'on' && 'bg-green-500',
          state === 'waiting' && 'bg-orange-500',
          state === 'off' && 'bg-blue-500',
        )}
      >
        Status: {state}
      </p>
    </div>
  );
};
```

Now, the UI component only needs to know about the `useStreaming` and `useAudioRecording` hooks. It does not need to know about the WebSocket or Web Audio API at all. This makes it easier to test and maintain the UI component, as well as the hooks themselves. Not only does it become easier to read, but we can change the internals of the hooks without having to worry about the UI component at all!

## Conclusion

In this article, we use a case study of a push-to=talk web application to discuss the importance of separation of concerns in software engineering. We saw we can enforce such principles in React using custom hooks in our application. By creating custom hooks for the WebSocket and Web Audio API logic, we were able to keep our UI component clean and maintainable, and make our application more flexible and reusable. Of course, this is just one case study, and there are many other ways to enforce separation of concerns in your applications, each with its own trade-offs. What works best for you will depend on your use case and your team's preferences. But I hope this article has given you some ideas on how you can use custom hooks to enforce separation of concerns in your own applications.

---

_Stay tuned for more writeups on tech!_
