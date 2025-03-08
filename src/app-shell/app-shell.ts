import {state, withController} from '@snar/lit';
import {LitElement, html} from 'lit';
import {withStyles} from 'lit-with-styles';
import {customElement, query} from 'lit/decorators.js';
import {materialShellLoadingOff} from 'material-shell';
import {store} from '../store.js';
import styles from './app-shell.css?inline';
import {type WordFish} from '../word-fish.js';

declare global {
	interface Window {
		app: AppShell;
	}
	interface HTMLElementTagNameMap {
		'app-shell': AppShell;
	}
}

@customElement('app-shell')
@withStyles(styles)
@withController(store)
export class AppShell extends LitElement {
	@query('#aquarium') aquarium?: HTMLElement;

	@state() fishes: WordFish[] = [];

	firstUpdated() {
		materialShellLoadingOff.call(this);

		const animate = () => {
			this.fishes.forEach((fish) => fish.nextFrame()); // Appeler nextFrame pour chaque poisson
			requestAnimationFrame(animate); // Refaire l'animation
		};
		animate();
	}

	get aquariumDimensions() {
		return [window.innerWidth, window.innerHeight];
	}

	addWordInAquarium(word: WordFish) {
		this.fishes = [...this.fishes, word];
	}

	render() {
		console.log('plooploo');
		return html`
			<div id="aquarium" class="absolute inset-0">${this.fishes}</div>
		`;
	}
}

export const app = (window.app = new AppShell());
