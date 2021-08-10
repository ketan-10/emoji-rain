import React, {} from 'react'
import EmojiButtons from './components/EmojiButtons';
import { EMOJIES } from './types/Emoji';

const App : React.FC = () =>  {
  return (
    <div className="App">
        <EmojiButtons emojis={EMOJIES}/>
    </div>
  )
}

export default App
