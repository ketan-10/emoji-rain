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


  const transition = useTransition(emoji,{
    from: { x: 0, y: 0, opacity: 0.5 },
    enter: { x: -100, y: 200,  opacity: 0.5 },
    // leave: { x: 100, y: 800, opacity: 0.5 },
    config: {
      duration: 2000,
    },
    // onRest: () => onEmojiRemove(),
  });


  useEffect(() => {
    setTimeout(() => {
      // console.log(onEmojiRemove)
      onEmojiRemove(emoji);
    }, 2000);
  },[])

  return (
    <>
    {
      transition((style, item) => {
        return item ?
        <animated.div style={style} className="floting-icon">
          {emoji.value}
         </animated.div>
        : ""
      })
    }
    </>
  )
}

export default FlowtingIcons
