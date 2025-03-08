import {state, withController} from '@snar/lit';
import {LitElement, html} from 'lit';
import {unsafeSVG} from 'lit/directives/unsafe-svg.js';
import {withStyles} from 'lit-with-styles';
import {customElement, query} from 'lit/decorators.js';
import {materialShellLoadingOff} from 'material-shell';
import {store} from '../store.js';
import styles from './app-shell.css?inline';
import {type WordFish} from '../word-fish.js';
import {sleep} from '../utils.js';
import {openSettingsDialog} from '../imports.js';
import {SVG_LOGO} from '../assets/assets.js';

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
	@state() playing = false;

	async firstUpdated() {
		materialShellLoadingOff.call(this);

		await sleep(100);
		this.play();
	}

	play() {
		if (this.playing) {
			return;
		}
		this.playing = true;
		const animate = () => {
			this.fishes.forEach((fish) => fish.nextFrame()); // Appeler nextFrame pour chaque poisson
			if (this.playing) {
				requestAnimationFrame(animate); // Refaire l'animation
			}
		};
		animate();
	}

	stop() {
		if (this.playing) {
			this.playing = false;
		}
	}
	togglePlay() {
		if (this.playing) {
			this.stop();
		} else {
			this.play();
		}
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
			<header class="flex items-center gap-2 m-3 z-10">
				<md-icon-button inert>
					<md-icon>${unsafeSVG(SVG_LOGO)}</md-icon>
				</md-icon-button>
				<div class="flex-1"></div>
				<md-icon-button @click=${() => this.togglePlay()}>
					${this.playing
						? html` <md-icon>pause</md-icon> `
						: html` <md-icon>play_arrow</md-icon> `}
				</md-icon-button>
				<md-icon-button @click=${openSettingsDialog}>
					<md-icon>settings</md-icon>
				</md-icon-button>
			</header>
			<div id="aquarium" class="absolute inset-0 overflow-hidden">
				${this.fishes}
			</div>
			<div class="fixed bottom-4 right-4"></div>
		`;
	}
}

export const app = (window.app = new AppShell());
