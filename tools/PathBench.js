import * as SP from "./ShortestPath";
import {sill} from "./Debug";
import {get_row} from "./Misc";

export default function benchmark(nodes, clean_nodes, ways, location, ch_dict, ch_dict_bench, count, aff, actual_start_node_id, actual_end_node_id) {
    sill(`==========PathBench==========`);
    let start_time, end_time;
    let res;
    //benchmark Obvious-Dijkstra
    start_time = performance.now();
    res = SP.obvious_dijkstra(clean_nodes, ways, location, ch_dict, count, aff, actual_start_node_id, actual_end_node_id);
    end_time = performance.now();
    sill(`Obvious-Dijkstra run-time: ${end_time - start_time} ms`);
    // benchmark Dijkstra
    start_time = performance.now();
    const _ = SP.dijkstra(nodes, ways, location, ch_dict_bench, count, aff, actual_start_node_id, actual_end_node_id);
    end_time = performance.now();
    sill(`Dijkstra run-time: ${end_time - start_time} ms`);
    sill(`==============================`);
    return res;
}