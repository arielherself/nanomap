const __DEBUG__=1,
      __APP_VERSION__='v0.1.1a',
      __APP_INTRO__='We can display a real-looking polyline when you select locations on the map!';

export default function handler(req,res){
    res.status(200).json({
        log: 'Method: handshake\nStatus: responded handshake request',
        version: __APP_VERSION__,
        intro:   __APP_INTRO__,
    });
}