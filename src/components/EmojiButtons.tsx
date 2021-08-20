import React, { useState, useRef, useEffect } from 'react'
import { IconButton } from '@material-ui/core';
import FloatingIcons from './FloatingIcons';
import { ANIMATION_TIME, Emoji, SKEW_MEAN, SKEW_VARIANCE, URL } from '../types/Emoji';
import { v4 as uuidv4 } from 'uuid'
import gaussian from 'gaussian'
import ReconnectingWebSocket from 'reconnecting-websocket';

interface Props {
  emojis: string;
}

const distribution = gaussian(SKEW_MEAN, SKEW_VARIANCE);

// https://stackoverflow.com/questions/24531751/how-can-i-split-a-string-containing-emoji-into-an-array
const EmojiButtons: React.FC<Props> = ({emojis:[...emojis]}) => {
  const emojisUnique = [...new Set(emojis)];

  const [floatingEmojis, setFloatingEmojis] = useState<Array<Emoji>>([]);

  const addFloatingEmoji = (emoji: string) => {
    const uuid = uuidv4();
    const skew = distribution.random(1)[0];
    // as this function is called in latter time,(in webscocket)
    // it will use old floatingEmojis value. so we are using 'setState' with callabck not using floatingEmojis.concat(new) as it will be closured.
    setFloatingEmojis((latest) => latest.concat({
      value: emoji,
      id: uuid, 
      skew,
    }));
    // remove the emoji from the list
    setTimeout(() => {
      setFloatingEmojis((latest) => latest.filter(e => e.id !== uuid));
    }, ANIMATION_TIME)
  }

  // websocket
  const socket = useRef<ReconnectingWebSocket | null>(null);

  useEffect(() => {
    if(socket.current?.readyState !== WebSocket.OPEN){
      socket.current = new ReconnectingWebSocket(URL);
      socket.current.addEventListener('message', (messageEvent) => {
        const {myEmoji} = JSON.parse(messageEvent.data);
        if(emojisUnique.includes(myEmoji)) addFloatingEmoji(myEmoji);
      });
    }
    return () => {
      socket.current?.close();
    }
  }, []);

  const sendMessageToSocket = (e: string) => {
    const sendingMessage = JSON.stringify({action:"sendEmoji", myEmoji: e});
    socket.current?.send(sendingMessage);
  }
  
  return (
    <>
      <div className="emoji-buttons-container">
        {emojisUnique.map((emoji) => {
          return (
            <div key={emoji}>
              {floatingEmojis.filter(x=> x.value===emoji).map(emoji => 
                <FloatingIcons 
                key={emoji.id} 
                emoji={emoji} 
                />
              )}
              <IconButton
                color="primary"
                onClick={(e: any) => {
                    const emojiClicked = e.target.innerText;
                    sendMessageToSocket(emojiClicked);
                    addFloatingEmoji(emojiClicked);
                  }}>
                  {emoji}
              </IconButton>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default EmojiButtons

