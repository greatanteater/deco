import { writable } from "svelte/store";

export const currentView = writable("main");
export const characterNumber = writable(0);