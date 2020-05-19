import * as ActionTypes from './ActionTypes';

export const favorites = (state = [], action) => {
    switch(action.type){
        case ActionTypes.ADD_FAVORITE:
            if (state.some(el => el === action.payload))        // if the dish is already added to the favorite then it return it ....It will simply check
                return state;
            else
                return state.concat(action.payload);                // concat will add the dish into the favorite
        default:
            return state;
    }
}