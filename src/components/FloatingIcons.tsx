import React from 'react'
import { ANIMATION_TIME, BOTTOM_ANIMATION_LEN, Emoji} from '../types/Emoji';
import { useTransition, animated } from 'react-spring';

interface Props {
  emoji: Emoji;
}

const FloatingIcons: React.FC<Props> = ({emoji}) => {

  const transition = useTransition(emoji,{
    from: { x: 0, y: 0, opacity: 1 },
    enter: { x: emoji.skew, y: BOTTOM_ANIMATION_LEN,  opacity: 0 },
    config: {
      duration: ANIMATION_TIME,
    },
  });

  return (
    <>{
      transition((style, item) => {
        return item ?
          <animated.div style={style} className="floting-icon">
            {emoji.value}
          </animated.div>
        : ""
      })
    }</>
  )
}

export default FloatingIcons
