import {dijkstra, haversine_distance, obvious_dijkstra} from "../tools/ShortestPath";
import {sill, sill_unwrap, noexcept} from "../tools/Debug";
import {get_row} from "../tools/Misc";
import benchmark from "../tools/PathBench";

const __spa = obvious_dijkstra;

function find_nearest_node_id(nodes, point) {
    const [lat, lon] = point;
    let min_distance = 1e100;
    let res = '';
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
    // const clean_nodes = nodes;
    const count = {};
    const aff = {};
    const location = {};
    const clean_nodes = {};
    // TODO: delete this
    let count1 = 0, tot = 0;
    for (const way_id in ways) {
        // sill_unwrap(way_id);
        const st = new Set();
        const [l, n] = get_row(ways, way_id);
        for (let i = 0; i < n; ++i) {
            l[i] = l[i].toString();  // critical
            const curr = l[i];
            if (st.has(curr)) continue;
            st.add(curr);
            if (location[curr]) {
                location[curr][way_id] = i;
            } else {
                location[curr] = {[way_id]: i};
            }
            clean_nodes[curr] = nodes[curr];
            if (count[curr]) {
                if (count[curr] === 1) {
                    count1 -= 1;
                }
                ++count[curr];
            } else {
                count[curr] = 1;
                count1 += 1;
                tot += 1;
            }
            if (aff[curr]) {
                aff[curr][way_id] = true;
            } else {
                aff[curr] = {[way_id]: true};
            }
        }
    }
    sill(`One ratio: ${count1} / ${tot}`);
    // sill_unwrap(aff);
    const actual_start_node_id = find_nearest_node_id(clean_nodes, start_point);
    const actual_end_node_id = find_nearest_node_id(clean_nodes, end_point);
    // sill_unwrap(typeof (actual_start_node_id));
    // sill(count);
    const ch_dict = {};
    const ch_dict_bench = {};
    let f = 1;
    for (const t in ways) {
        // if (t === ways[aff[actual_start_node_id]]) sill('yes');
        const [l, n] = get_row(ways, t);
        // // TODO: delete this
        // for (let i = 1; i < n; ++i) {
        //     const curr = l[i];
        //     const prev = l[i-1];
        //     const distance = haversine_distance(nodes[curr], nodes[prev]);
        //     if (ch_dict_bench[curr]) {
        //         ch_dict_bench[curr].push([prev, distance]);
        //     } else {
        //         ch_dict_bench[curr] = [[prev, distance]];
        //     }
        //     if (ch_dict_bench[prev]) {
        //         ch_dict_bench[prev].push([curr, distance]);
        //     } else {
        //         ch_dict_bench[prev] = [[curr, distance]];
        //     }
        // }
        let prev = '';
        let distance = 0;
        for (let i = 0; i < n; ++i) {
            const curr = l[i];
            if (i) distance += haversine_distance(nodes[curr], nodes[l[i-1]]);
            // if(true) {
            if (count[curr] > 1 || curr === actual_end_node_id || curr === actual_start_node_id) {
                // if (curr === actual_start_node_id) sill(curr === actual_start_node_id);
                if (prev !== '') {
                    if (ch_dict[curr]) {
                        ch_dict[curr].push([prev, distance]);
                    } else {
                        ch_dict[curr] = [[prev, distance]];
                    }
                    if (ch_dict[prev]) {
                        ch_dict[prev].push([curr, distance]);
                    } else {
                        ch_dict[prev] = [[curr, distance]];
                    }
                }
                prev = curr;
                distance = 0;
            }
        }
    }
    // const clean_nodes = {};
    // Object.keys(nodes).forEach((node_id) => {
    //     if (ch_dict[node_id]) clean_nodes[node_id] = nodes[node_id];
    // });
    sill(`start distance: ${haversine_distance(nodes[actual_start_node_id], start_point)}`);
    sill(`dest distance: ${haversine_distance(nodes[actual_end_node_id], end_point)}`);
    sill("calling __spa...");
    // // TODO: delete this
    // const seq = __spa(nodes, clean_nodes, ways, location, ch_dict, ch_dict_bench, count, aff, actual_start_node_id, actual_end_node_id);
    const seq = __spa(clean_nodes, ways, location, ch_dict, count, aff, actual_start_node_id, actual_end_node_id);
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
    if (haversine_distance([minlat, minlon], [maxlat, maxlon]) > 100) {
        res.status(500);
        sill('rejected');
        return;
    }
    const request_uri = `https://www.overpass-api.de/api/interpreter?data=[out:json];way[highway](${minlat},${minlon},${maxlat},${maxlon});(._;>;);out body;`;
    sill(`Requesting ${request_uri}`);
    const fetch_debug_response = fetch(request_uri).then((response) => {
        return response.json();
    });
    fetch_debug_response.then((debug_response) => {
        // sill(debug_response);
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