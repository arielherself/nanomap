const getArgs=(s)=>s.split('@@')

export default function handler(req,res){
    const {body}=req;
    res.status(200).json({
        log: `Method: click\nArgs: ${body}\nStatus: returned the raw polylines`,
        multipolyline: body,
    });
}