const __DEBUG__=1,
      __APP_VERSION__='v0.1.3a',
      __APP_INTRO__=`
<b>Right way to follow.</b><br>
In this update you can find a shortest route for any given start and destination.<br>
`;

export default function handler(req,res){
    res.status(200).json({
        log: 'Method: handshake\nStatus: responded handshake request',
        version: __APP_VERSION__,
        intro:   __APP_INTRO__,
    });
}