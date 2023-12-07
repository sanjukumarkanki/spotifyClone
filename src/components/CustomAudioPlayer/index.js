import AudioPlayer from 'react-h5-audio-player'
import 'react-h5-audio-player/lib/styles.css'

import './index.css'

const CustomAudioPlayer = props => {
  const {audioTrack} = props

  return (
    <div className="container-fl">
      <AudioPlayer
        src={audioTrack}
        style={{backgroundColor: 'black', width: '100%'}}
        customAdditionalControls={[]}
        layout="stacked-reverse"
        loop
        onCanPlayThrough
        autoPlay
      />
    </div>
  )
}

export default CustomAudioPlayer
