import React, { useState } from 'react'
import { IconButton } from '@material-ui/core';
import FlowtingIcons from './FlowatingIcons';
import { ANIMATION_TIME, Emoji, SKEW_MEAN, SKEW_VARIANCE  } from '../types/Emoji';
import { v4 as uuidv4 } from 'uuid'
import gaussian from 'gaussian'

interface Props {
  emojis: string;
}

const distribution = gaussian(SKEW_MEAN, SKEW_VARIANCE);

// https://stackoverflow.com/questions/24531751/how-can-i-split-a-string-containing-emoji-into-an-array
const EmojiButtons: React.FC<Props> = ({emojis:[...emojis]}) => {

 const [flowtingEmojis, setFlowtingEmojis] = useState<Array<Emoji>>([]);

  const handleClick= (event: any) => {
    const emoji = event.target.innerText as string; 
    const uuid = uuidv4();
    const skew = distribution.random(1)[0];
    setFlowtingEmojis(flowtingEmojis.concat({
      value: emoji,
      id: uuid, 
      skew,
    }));

    setTimeout(() => {
      setFlowtingEmojis((lattest) => lattest.filter(e => e.id !== uuid));
    }, ANIMATION_TIME)
  }

  const emojisUnique = [...new Set(emojis)];
  return (
    <>
      <div className="emoji-buttons-container">
        {emojisUnique.map((emoji) => {
          return (
            <div key={emoji}>
              {flowtingEmojis.filter(x=> x.value===emoji).map(emoji => 
                <FlowtingIcons 
                key={emoji.id} 
                emoji={emoji} 
                />
              )}
              <IconButton
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
