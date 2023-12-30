import {noexcept, sill, sill_unwrap} from "./Debug";

export const get_row = noexcept((_a,_i) => {
    const row = _a[_i];
    return [row, row.length];
});

export const find_common = noexcept((_iterable_1, _iterable_2) => {
    for(const [k,_] of Object.entries(_iterable_2)) {
        if (_iterable_1[k] === true) {
            return k;
        }
    }
});
