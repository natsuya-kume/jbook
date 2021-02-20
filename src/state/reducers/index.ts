import { combineReducers } from "redux";
import cellsReducer from "./cellsReducer";

const reducers = combineReducers({
  cells: cellsReducer,
});

export default reducers;

// redux内の全体的な構造を定義
export type RootState = ReturnType<typeof reducers>;
