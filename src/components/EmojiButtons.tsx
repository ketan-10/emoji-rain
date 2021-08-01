import React, { useState} from 'react'
import FlowtingIcons from './FlowatingIconsTest';
import { Emoji } from '../types/Emoji';
import { v4 as uuidv4 } from 'uuid'

// https://stackoverflow.com/questions/24531751/how-can-i-split-a-string-containing-emoji-into-an-array

function EmojiButtons() {

 const [value, setValue] = useState<Array<Emoji>>([]);

  const handleClick= (event: any) => {
    const myValue = event.target.innerText as string; 

    const myUuid = uuidv4();  
    setValue(value.concat({
      value: myValue,
      id: myUuid, 
    }));

    // immitivly after adding the value,
    // we shoud write logic to remove it from the array

    setTimeout(() => {
      
      // setValue(value.filter(item => item.value !== myValue));
      
      // The above solution will not work, 
      // because the array {value} will modified, but here setTimeout will use Old {value} 
      // stored in it's closure,
      
      setValue(v => v.filter(item => item.id !== myUuid));
    }, 4000)

  }

  const removeFlowtingEmoji = (x: Emoji) => {
    setValue(value.filter(e => e.id !== x.id));
  };

  // const test = useRef(removeFlowtingEmoji);
  // test.current = removeFlowtingEmoji;

  return (
    <>
        <button
          onClick={(e) => handleClick(e)}>
            😀
        </button>
        
        {value.map(v => 
          <FlowtingIcons 
          key={v.id} 
          emoji={v} 
          onEmojiRemove={removeFlowtingEmoji}/>
        )}
            
    </>
  )
}

export default EmojiButtons
