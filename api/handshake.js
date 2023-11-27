const __DEBUG__=1,
      __APP_VERSION__='v0.1.2a',
      __APP_INTRO__=`
<b>Relocating Support</b>
Can't find where you are from? We now memorize the last location you visited. Tap the "Relocate" button to find your way home.<br>
<b>Nearby Search</b>
You can first locate a general area and schedule detailed travel plan later. Tap the magnifier/gear icon to toggle between Nearby Search mode and Global Search mode.
<i>This update also includes several stability and UI improvements.</i>
`;

export default function handler(req,res){
    res.status(200).json({
        log: 'Method: handshake\nStatus: responded handshake request',
        version: __APP_VERSION__,
        intro:   __APP_INTRO__,
    });
}