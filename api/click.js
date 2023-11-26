const getArgs=(s)=>s.split('@@')

export default function handler(req,res){
    res.status(200).json({
        log: `Method: click\nArgs: ${getArgs(req.query.query)}\nStatus: test service, nothing done`,
    });
}