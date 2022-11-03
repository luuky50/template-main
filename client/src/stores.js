import {writable} from "svelte/store";

export const currentChairId = writable(0);

export const currentRoute = writable("/");
