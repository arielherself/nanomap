import {dijkstra, haversine_distance} from "../tools/ShortestPath";
import {sill, sill_unwrap, get_row, noexcept} from "../tools/Debug";

const __spa = dijkstra;

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

const shortest_path = noexcept((nodes, ways, start_point, end_point) => {
    const count = {};
    for(const way_id in ways) {
        sill(way_id);
        const [l, n] = get_row(ways, way_id);
        for(let i = 0; i < n; ++i) {
            if(count[l[i]]) {
                ++count[l[i]];
            } else {
                count[l[i]] = 1;
            }
        }
    }
    sill(count);
    const ch_dict = {};
    for (const way_id in ways) {
        const [l, n] = get_row(ways, way_id);
        for (let i = 0; i < n; ++i) {
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
    const clean_nodes = {};
    Object.keys(nodes).forEach((node_id) => {
        if (ch_dict[node_id]) clean_nodes[node_id] = nodes[node_id];
    });
    sill_unwrap(start_point);
    const actual_start_node_id = find_nearest_node_id(clean_nodes, start_point);
    const actual_end_node_id = find_nearest_node_id(clean_nodes, end_point);
    sill("calling __spa...");
    const seq = __spa(clean_nodes, ch_dict, actual_start_node_id, actual_end_node_id);
    const res = [end_point];
    seq.forEach((node_id) => {
        if (clean_nodes[node_id]) res.push(clean_nodes[node_id]);
    });
    res.push(start_point);
    return res;
});


export default function handler(req, res) {
    const pts = JSON.parse(req.body);
    const latRange = pts.map((row) => row[0]),
        lonRange = pts.map((row) => row[1]);
    const minlon = Math.min(...lonRange) - 0.01, minlat = Math.min(...latRange) - 0.01,
        maxlon = Math.max(...lonRange) + 0.01, maxlat = Math.max(...latRange) + 0.01;
    const request_uri = `https://www.overpass-api.de/api/interpreter?data=[out:json];way[highway](${minlat},${minlon},${maxlat},${maxlon});(._;>;);out body;`;
    sill(`Requesting ${request_uri}`);
    const fetch_debug_response = fetch(request_uri).then((response) => {
        return response.json();
    });
    fetch_debug_response.then((debug_response) => {
        sill(debug_response);
        let ps = {};
        let ws = {};
        debug_response.elements.forEach((it) => {
            if (it.type === "node") {
                ps[it.id] = [it.lat, it.lon];
            } else if (it.type === "way") {
                ws[it.id] = it.nodes;
            }
        });
        const path_found = shortest_path(ps, ws, pts[0], pts[pts.length - 1]);
        res.status(200).json({
            log: `Method: click\nArgs: ${pts}\nStatus: requested "${request_uri}", got response ${JSON.stringify(debug_response.elements)}`,
            multipolyline: JSON.stringify(path_found),
            // __debug_pts: ps
        });
    }).catch(e => {
        console.debug(e);
        res.status(500);
    });

}