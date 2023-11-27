const __DEBUG__=1,
      __APP_VERSION__='v0.1.2a',
      __APP_INTRO__=`
<b>Relocating Support</b><br>
Can't find where you are from? We now memorize the last location you visited. Tap the "Relocate" button to find your way home.<br><br>
<i>This update also include several stability and UI improvements.</i>
`;

export default function handler(req,res){
    res.status(200).json({
        log: 'Method: handshake\nStatus: responded handshake request',
        version: __APP_VERSION__,
        intro:   __APP_INTRO__,
    });
}