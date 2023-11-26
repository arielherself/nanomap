const __DEBUG__=1,
      __APP_VERSION__='v1.0a1',
      __APP_INTRO__='<list>\n' +
          '  <li>We can actively detect the connection status now!</li>\n' +
          '</list>';

export default function handler(req,res){
    res.status(200).json({
        log: 'Method: handshake\nStatus: responded handshake request',
        version: __APP_VERSION__,
        intro:   __APP_INTRO__,
    });
}