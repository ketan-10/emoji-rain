import React, {} from 'react'
import EmojiButtons from './components/EmojiButtons';
import {TransitionArray} from './components/Tansition';



const App : React.FC = () =>  {
  return (
    <div className="App">
        <EmojiButtons emojis="😀😁😂🤣🤪"/>
        {/* <TransitionArray/> */}
    </div>
  )
}

export default App
