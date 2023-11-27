import {post} from "../src/Networking";

export default function handler(req,res){
    const pts=JSON.parse(req.body);
    const latRange=pts.map((row)=>row[0]),
          lonRange=pts.map((row)=>row[1]);
    const minlon=Math.min(...lonRange),minlat=Math.min(...latRange),
          maxlon=Math.max(...lonRange),maxlat=Math.max(...latRange);
    const request_uri=`https://www.overpass-api.de/api/interpreter?data=[out:json];node[highway](${minlat},${minlon},${maxlat},${maxlon});out;`;
    const fetch_debug_response= fetch(request_uri).then((response)=>{
        return response.json();
    });
    fetch_debug_response.then((debug_response)=>{
        res.status(200).json({
            log: `Method: click\nArgs: ${pts}\nStatus: requested "${request_uri}", got response ${JSON.stringify(debug_response.elements)}`,
            multipolyline: JSON.stringify(pts),
        });
    }).catch(e=>{
        res.status(500);
    });

}