import {createAction, props} from '@ngrx/store';
import { ProductInt } from '../shared/models/ProductInt';

export const addProduct = createAction('Add Product', props<ProductInt>());
export const removeProduct = createAction('Remove Product', props<ProductInt>());
export const clearCart = createAction('Clear Cart');