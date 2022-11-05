import {derived, writable} from "svelte/store";

export const currentChairId = writable(0);

export const userId = writable(null);

export const currentRoute = writable("/");

export const isAdmin = writable(false);

export const token = writable(null);

export const filters = writable('?');
