import {writable} from "svelte/store";

export const currentChairId = writable(0);

export const userId = writable(null);

export const userName = writable("");

export const currentRoute = writable("/");

export const colors = ["red", "purple", "yellow", "green", "blue", "pink", "cyan"]

export const isAdmin = writable(false);

export const token = writable(null);

export const filters = writable('?');
