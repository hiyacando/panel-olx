import { combineReducers } from '@reduxjs/toolkit';
import navItemsReducer from './models/navItems';

const rootReducer = combineReducers({
    navItems: navItemsReducer,
});

export default rootReducer;
