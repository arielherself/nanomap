import {MinPriorityQueue} from "@datastructures-js/priority-queue";

function haversine_distance(p1,p2) {
    const toRadians = (degrees) => {
        return degrees * Math.PI / 180;
    };
    const [lat1, lon1] = p1;
    const [lat2, lon2] = p2;
    const R = 6371;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    if (R * c < 0) console.log("WARNING!!!");
    return R * c;
}

function find_nearest_node_id(nodes, point) {
    const [lat, lon] = point;
    let min_distance = 1e100;
    let res = 0;
    for (let node_id in nodes) {
        const curr_distance = haversine_distance(nodes[node_id], point);
        if (curr_distance < min_distance) {
            min_distance = curr_distance;
            res = node_id;
        }
    }
    return res;
}

function __spa(nodes, ch, u, p) {
    console.log(`node count: ${Object.keys(nodes).length}`);
    const weight_cache = {};
    try {
        const get_weight = (n1, n2) => {
            const tup = [n1, n2];
            if (weight_cache[tup]) {
                return weight_cache[[n1, n2]];
            }
            // console.log("21");
            // console.log(`${nodes[n1]} ${nodes[n2]}`);
            weight_cache[tup] = haversine_distance(nodes[n1], nodes[n2]);
            return weight_cache[tup];
        };
        const dis = {};
        const fa = {};
        const vis = new Set();
        const pq = new MinPriorityQueue();
        // console.log(`nodes: ${JSON.stringify(nodes)}`);
        dis[u] = 0;
        pq.push([0, u]);
        while (!pq.isEmpty()) {
            const [d, v] = pq.pop();
            if (vis.has(v) || !ch[v]) continue;
            vis.add(v);
            const t = ch[v].length;
            for (let j = 0; j < t; ++j) {
                const c = ch[v][j];
                if (!nodes[c]) continue;
                const w = get_weight(v, c);
                if (!dis[c] || d + w < dis[c]) {
                    dis[c] = d + w;
                    pq.push([dis[c], c]);
                    fa[c] = v;
                }
            }
        }
        // console.log(`fa = ${JSON.stringify(fa)}`);
        let curr = p;
        const res = [p];
        // console.log(JSON.stringify(p));
        vis.clear();
        while (fa[curr]) {
            // console.log(JSON.stringify(curr));
            curr = fa[curr].toString();
            if(vis.has(curr)) {
                console.log(`Cycle at ${curr}`);
                break;
            }
            vis.add(curr);
            res.push(curr);
        }
        console.log("finished __spa.");
        // console.log(JSON.stringify(res));
        return res;
    } catch (e) {
        console.log(e);
    }
}

function shortest_path(nodes, ways, start_point, end_point){
    try { // console.log(`Calling shortest_path(${nodes},${ways},${start_point},${end_point})`);
        const ch_dict = {};
        for (const way_id in ways) {
            const l = ways[way_id];
            const n = l.length;
            for (let i = 1; i < n; ++i) {
                if (ch_dict[l[i]]) {
                    ch_dict[l[i]].push(l[i - 1]);
                } else {
                    ch_dict[l[i]] = [l[i - 1]];
                }
                if (ch_dict[l[i - 1]]) {
                    ch_dict[l[i - 1]].push(l[i]);
                } else {
                    ch_dict[l[i - 1]] = [l[i]];
                }
            }
        }
        // console.log(ch_dict);
        const clean_nodes = {};
        Object.keys(nodes).forEach((node_id) => {
            if (ch_dict[node_id]) clean_nodes[node_id] = nodes[node_id];
        });
        const actual_start_node_id = find_nearest_node_id(clean_nodes, start_point);
        const actual_end_node_id = find_nearest_node_id(clean_nodes, end_point);
        console.log("calling __spa...");
        const seq = __spa(clean_nodes, ch_dict, actual_start_node_id, actual_end_node_id);
        const res = [end_point];
        seq.forEach((node_id) => {
            if (clean_nodes[node_id]) res.push(clean_nodes[node_id]);
        });
        res.push(start_point);
        return res;
    } catch (e) {
        console.log(e);
    }
}


export default function handler(req,res){
    const pts=JSON.parse(req.body);
    const latRange=pts.map((row)=>row[0]),
          lonRange=pts.map((row)=>row[1]);
    const minlon=Math.min(...lonRange) - 0.01,minlat=Math.min(...latRange) - 0.01,
          maxlon=Math.max(...lonRange) + 0.01,maxlat=Math.max(...latRange) + 0.01;
    // console.log(`1+1`);
    const request_uri=`https://www.overpass-api.de/api/interpreter?data=[out:json];way[highway](${minlat},${minlon},${maxlat},${maxlon});(._;>;);out body;`;
    console.log(`Requesting ${request_uri}`);
    const fetch_debug_response= fetch(request_uri).then((response)=>{
        return response.json();
    });
    fetch_debug_response.then((debug_response)=>{
        console.log(debug_response);
        let ps = {};
        let ws = {};
        debug_response.elements.forEach((it)=> {
            if (it.type === "node") {
                ps[it.id] = [it.lat,it.lon];
            } else if (it.type === "way") {
                ws[it.id] = it.nodes;
            }
        });
        // console.log(`pts[0]: ${pts[0]}`);
        const path_found = shortest_path(ps,ws,pts[0],pts[pts.length - 1]);
        // const path_found = [];
        // console.log(JSON.stringify(path_found));
        res.status(200).json({
            log: `Method: click\nArgs: ${pts}\nStatus: requested "${request_uri}", got response ${JSON.stringify(debug_response.elements)}`,
            multipolyline: JSON.stringify(path_found),
            // __debug_pts: ps
        });
    }).catch(e=>{
        res.status(500);
    });

}