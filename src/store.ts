import {ReactiveController, state} from '@snar/lit';
import {saveToLocalStorage} from 'snar-save-to-local-storage';
import {WordFish} from './word-fish.js';

@saveToLocalStorage('words-aquarium:store')
export class AppStore extends ReactiveController {
	@state() words: string[] = [];
	@state() speedFactor = 2;

	protected firstUpdated() {
		const hash = decodeURIComponent(window.location.hash.slice(1));
		if (hash) {
			const values = hash.split(',');
			if (values.length) {
				this.words = values;
			}
		}
		for (const word of this.words) {
			new WordFish(word); // fish is automatically added to the aquarium
		}
	}
}

export const store = new AppStore();
