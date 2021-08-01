import React, { useState, useRef } from 'react'
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
    }, 4000000)

  }

  const removeFlowtingEmoji = (x: Emoji) => {
    setValue(value.filter(e => e.id !== x.id));
  };

  // useRef will update the refrerence of the removeFlowtingEmoji function
  // on Each render => so clouser of {value} array inside function 'removeFlowtingEmoji' will be up to date
  // ( Also, as we are using 'useRef' component will not re-render on removeFlowtingEmoji function change,
  // But, it already re-render anyways, so this functinality is not used here. )
  const test = useRef(removeFlowtingEmoji);
  // 'useRef' is like creating a class with 'current' as a pointer to the current object.
  test.current = removeFlowtingEmoji;

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

          // Does Not Work: (as this will directly send the current function at the time of the render)
          //                (and in child component we are using useEffect with [] dependency, 
          //                 so it will only use first version of function)
          //                ( it's like sending the function as string or current snapshot of the function without access of 'test' ref)  
          // onEmojiRemove={test.current}/>
          // Works:         (as this contains the 'test' ref, so it will use the latest current function pointer)
          onEmojiRemove={(e: Emoji) => test.current(e)}/>
        )}
            
    </>
  )
}

export default EmojiButtons
