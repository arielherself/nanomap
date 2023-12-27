// no dependencies
import {__DEBUG__} from "../PublicProperty";

export function noexcept(f) {
    /**
     * No exceptions.
     * @returns {*}
     * @private
     */
    function _wrap() {
        try {
            return f.apply(this, arguments);
        } catch (e) {
            console.debug(e);
        }
    }
    return _wrap;
}

export const sill = noexcept((x) => {
    if(__DEBUG__) {
        console.log(x);
    }
});

export const sill_unwrap = noexcept((x) => {
    sill(JSON.stringify(x));
});

export const get_row = noexcept((a,i) => {
    const row = a[i];
    return [row, row.length];
});