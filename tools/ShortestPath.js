import {MinPriorityQueue} from "@datastructures-js/priority-queue";
import {sill, noexcept, sill_unwrap} from "./Debug";
import {find_common} from "./Misc";

function __haversine_distance(p1, p2) {
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
    if (R * c < 0) console.warn("WARNING!!!");
    return R * c;
}


/**
 * Use Dijkstra algorithm to find the shortest path.
 * @param nodes node index list
 * @param ways  unused in this implementation
 * @param ch    adjacent table
 * @param count unused in this implementation
 * @param aff   unused in this implementation
 * @param u     start node id
 * @param p     destination node id
 */
function __dijkstra(nodes, ways, ch, count, aff, u, p) {
    // sill(`node count: ${Object.keys(nodes).length}`);
    const weight_cache = {};
    const get_weight = (n1, n2) => {
        const tup = [n1, n2];
        if (weight_cache[tup]) {
            return weight_cache[tup];
        }
        weight_cache[tup] = __haversine_distance(nodes[n1], nodes[n2]);
        return weight_cache[tup];
    };
    const dis = {};
    const fa = {};
    const vis = new Set();
    const pq = new MinPriorityQueue();
    dis[u] = 0;
    pq.push([0, u]);
    while (!pq.isEmpty()) {
        const [d, v] = pq.pop();
        if (vis.has(v) || !ch[v]) continue;
        if (v === p) {
            break;
        }
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
    let curr = p;
    const res = [p];
    vis.clear();
    while (fa[curr]) {
        curr = fa[curr].toString();
        if (vis.has(curr)) {
            sill(`Cycle at ${curr}`);
            break;
        }
        vis.add(curr);
        res.push(curr);
    }
    // sill("finished Dijkstra.");
    return res;
}

/**
 * Use Dijkstra algorithm with Obvious optimization to find the shortest path.
 * @param nodes node index list
 * @param ways  node list for each way
 * @param ch    adjacent table
 * @param count determine isolated nodes
 * @param aff   affiliation of isolated nodes
 * @param u     start node id
 * @param p     destination node id
 */
function __obvious_dijkstra(nodes, ways, ch, count, aff, u, p) {
    // sill(`node count: ${Object.keys(nodes).length}`);
    const weight_cache = {};
    const get_weight_along = (way, n1, n2) => {
        const tup = [n1, n2];
        if (weight_cache[tup]) {
            return weight_cache[tup];
        }
        let res = 0;
        const n = way.length;
        let prev = '';
        let state = 0;
        for (let i = 0; i < n; ++i) {
            const curr = way[i].toString();
            if (curr === n1 || curr === n2) {
                if (state) {
                    res += (__haversine_distance(nodes[prev], nodes[curr]));
                    break;
                } else {
                    state = 1;
                    prev = curr;
                }
            } else if (state) {
                res += (__haversine_distance(nodes[prev], nodes[curr]));
                prev = curr;
            }
        }
        weight_cache[tup] = res;
        return res;
    };
    const dis = {};
    const fa = {};
    const vis = new Map();
    const pq = new MinPriorityQueue();
    dis[u] = 0;
    pq.push([0, u]);
    while (!pq.isEmpty()) {
        const [d, v] = pq.pop();
        if (vis.has(v) || !ch[v]) {
            // sill(!ch[v]);
            continue;
        }
        if (v === p) {
            // sill('break');
            break;
        }
        // sill('loop');
        vis.set(v,true);
        dis[v] = d;
        const t = ch[v].length;
        for (let j = 0; j < t; ++j) {
            const c = ch[v][j];
            if (!nodes[c]) continue;
            const way_id = find_common(aff[c], aff[v]);
            if (!way_id) sill("FATAL: NO COMMON WAY");
            const way = ways[way_id];
            const w = get_weight_along(way, v, c);
            // sill(w);
            if (w > 0 && (!dis[c] || d + w < dis[c])) {
                dis[c] = d + w;
                pq.push([dis[c], c]);
                const v_oc = way.indexOf(parseInt(v));
                const c_oc = way.indexOf(parseInt(c));
                let prev = c;
                if (v_oc < c_oc) {
                    for (let _p = c_oc - 1; _p >= v_oc; --_p) {
                        const node = way[_p].toString();
                        fa[prev] = node;
                        if (vis.has(node)) break;
                        prev = node;
                    }
                } else {
                    for (let _p = c_oc + 1; _p <= v_oc; ++_p) {
                        const node = way[_p].toString();
                        fa[prev] = node;
                        if (vis.has(node)) break;
                        prev = node;
                    }
                }
            }
        }
    }
    // sill_unwrap(fa);
    let curr = p;
    const res = [p];
    vis.clear();
    while (fa[curr]) {
        curr = fa[curr].toString();
        if (vis.has(curr)) {
            sill(`Cycle at ${curr}`);
            // sill(res);
            break;
        }
        vis.set(curr,true);
        res.push(curr);
    }
    // sill("finished Obvious Dijkstra.");
    return res;
}

export const haversine_distance = noexcept(__haversine_distance);
export const dijkstra = noexcept(__dijkstra);
export const obvious_dijkstra = noexcept(__obvious_dijkstra);