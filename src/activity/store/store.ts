import { writable } from "svelte/store";

export const currentView = writable("main");
export const characterNumber = writable(0);
export const eyesAttachedStatus = writable([false, false, false, false]);

// eyesAttachedStatus.update(status => {
//     status[characterIndex] = true;
//     return status;
//   });