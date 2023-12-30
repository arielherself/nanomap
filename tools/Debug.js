// no dependencies
import {__DEBUG__} from "../PublicProperty";

export function noexcept(_f) {
    /**
     * No exceptions.
     * @returns {*}
     * @private
     */
    function _wrap() {
        try {
            return _f.apply(this, arguments);
        } catch (e) {
            console.debug(e);
        }
    }
    return _wrap;
}

export const sill = noexcept((_x) => {
    if(__DEBUG__) {
        console.log(_x);
    }
});

export const sill_unwrap = noexcept((_x) => {
    sill(JSON.stringify(_x));
});