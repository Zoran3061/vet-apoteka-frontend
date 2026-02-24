import { ProductInt } from "../shared/models/ProductInt";
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface ProductGroup{
    product: ProductInt;
    count: number;
}


export const selectCountProducts = createSelector(
    createFeatureSelector('cartEntries'),
    (state: ProductInt[]) => {
        return state.length;
    }
);

export const selectTotalPrice = createSelector(
    createFeatureSelector('cartEntries'),
    (state: ProductInt[]) => {
        var totalPrice = 0;
        state.forEach(p => totalPrice += p.price);
        return totalPrice;
    }
);

export const selectGroupCartEntries = createSelector(
    createFeatureSelector('cartEntries'),
    (state: ProductInt[]) => {
        var map: Map<number, ProductGroup> = new Map;

        state.forEach(p => {
            if(map.get(p.id)) {
                (map.get(p.id) as ProductGroup).count++;
            }
            else{
                map.set(p.id, { product: p, count: 1});
            }
        })

        const sortedMap = new Map([...map.entries()].sort());
        return Array.from(sortedMap.values());
    }
);

