import { writable } from "svelte/store";

export const activityState = writable({
  currentView: "main",
  charNumber: 0,
});