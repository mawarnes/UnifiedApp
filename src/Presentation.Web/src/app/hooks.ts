import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import { type ThunkDispatch,type UnknownAction } from "@reduxjs/toolkit";
import { type RootState } from "./store";

export type AppThunkDispatch = ThunkDispatch<RootState, unknown, UnknownAction>;
// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppThunkDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;