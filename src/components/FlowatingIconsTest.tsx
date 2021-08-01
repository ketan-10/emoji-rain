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



  useEffect(() => {
    setTimeout(() => {
      // console.log(onEmojiRemove)
      onEmojiRemove(emoji);
    }, 5000);
  },[])

  return (
    <>
      {JSON.stringify(emoji)}
    </>
  )
}

export default FlowtingIcons
