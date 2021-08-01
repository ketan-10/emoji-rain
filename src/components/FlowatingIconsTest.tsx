import React, { useState } from 'react'
import { Icon, IconButton } from '@material-ui/core';
import { Emoji } from '../types/Emoji';
import { useTransition, animated } from 'react-spring';
import {useEffect} from 'react'


interface Props {
  emoji: Emoji;
  // onEmojiRemove: (emoji: Emoji) => void;
  onEmojiRemove: any;
}


const FlowtingIcons: React.FC<Props> = ({emoji, onEmojiRemove}) => {


  /*

  // Read from bottom up
  useEffect(() => {

    // This Will still not work as expected,
    // because even though we put onEmojiRemove dependecncy, 
    // so at least will not have the old onEmojiRemove function (with old closure)
    // But when onEmojiRemove changes timeout will reset, 
    // so it will take more time..
    const timeout = setTimeout(() => {
      // console.log(onEmojiRemove)
      onEmojiRemove(emoji);
    }, 500000);

    // Even after added onEmojiRemove dependency,
    // it will still call old fuction as timeout is havent removed
    // so we remove it here
    return () => {
      clearTimeout(timeout);
    }
  }
  // If we dont put dependency here, it will be evaluated only once
  // and old onEmojiRemove will be called.
  ,[onEmojiRemove, emoji])

*/

  // another solution to 
  // change onEmojiRemove by refrence.
  useEffect(() => {
    setTimeout(() => {
      onEmojiRemove(emoji);
    }, 5000);
  },[])


  return (
    <div>
      {JSON.stringify(emoji)}
      <button onClick={() => onEmojiRemove(emoji)}>Child Button</button>
    </div>
  )
}

export default FlowtingIcons
