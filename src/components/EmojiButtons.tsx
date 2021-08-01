import React, { useState, useMemo,useCallback, useRef} from 'react'
import { Icon, IconButton } from '@material-ui/core';
import FlowtingIcons from './FlowatingIconsTest';
import { Emoji } from '../types/Emoji';
import { v4 as uuidv4 } from 'uuid'

const styles = {
  largeIcon: {
    // fontSize: '1.5rem',
  },
  // decreseOpacity: {
  //   opacity: 0.5,
  // }
};


interface Props {
  emojis: string;
}


// https://stackoverflow.com/questions/24531751/how-can-i-split-a-string-containing-emoji-into-an-array

const EmojiButtons: React.FC<Props> = ({emojis:[...emojis]}) => {


 const [flowtingEmojis, setFlowtingEmojis] = useState<Array<Emoji>>([]);

  const handleClick= (event: any) => {
    const emoji = event.target.innerText as string; 
    setFlowtingEmojis(flowtingEmojis.concat({
      value: emoji,
      id: uuidv4(), 
    }));
  }

  const removeFlowtingEmoji = (emoji: Emoji) => {
    // setFlowtingEmojis(flowtingEmojis.filter(e => e.id !== emoji.id));
    console.log(emoji, " Pre: ",flowtingEmojis);
    const newEmojies = flowtingEmojis.filter(e => e.id !== emoji.id);
    console.log(emoji, " Post: ", newEmojies);
    setFlowtingEmojis(newEmojies);
  };

  // const test = useRef(removeFlowtingEmoji);
  // test.current = removeFlowtingEmoji;

  const emojisUnique = [...new Set(emojis)];
  return (
    <>
      <button onClick={() => {removeFlowtingEmoji(flowtingEmojis[flowtingEmojis.length -1])}}> Re-render</button>
      <div className="emoji-buttons-container">
        {emojisUnique.map((emoji) => {
          return (
            <div key={emoji} className="emoji-icon-container">
              {flowtingEmojis.filter(x=> x.value===emoji).map(emoji => 
                <FlowtingIcons 
                key={emoji.id} 
                emoji={emoji} 
                onEmojiRemove={(e: Emoji) => removeFlowtingEmoji(e)}/>
              )}
              <IconButton
                style={styles.largeIcon}
                color="primary"
                onClick={handleClick}>
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
