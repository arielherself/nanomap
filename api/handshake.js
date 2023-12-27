import {__APP_VERSION__, __APP_INTRO__} from "../PublicProperty";

export default function handler(req,res){
    res.status(200).json({
        log: 'Method: handshake\nStatus: responded handshake request',
        version: __APP_VERSION__,
        intro:   __APP_INTRO__,
    });
}