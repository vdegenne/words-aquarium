import {css, html, LitElement, type PropertyValues} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import {app} from './app-shell/app-shell.js';
import {random} from './utils.js';
import {hasSomeJapanese} from 'asian-regexps';
import {store} from './store.js';
import {withStyles} from 'lit-with-styles';

@customElement('word-fish')
@withStyles(css`
	:host {
		display: block;
		position: absolute !important;
		white-space: nowrap;
	}
`)
export class WordFish extends LitElement {
	@state() value = '';

	/** [width, height] */
	#dimensions = [0, 0];
	/** [stepX, stepY] */
	#trajectory = [0, 0]; // default: not moving

	constructor(value: string, addInAquarium = true) {
		super();
		this.value = value;
		this.style.left = '0';
		this.style.top = '0';
		this.style.fontSize = '2.75rem';
		if (hasSomeJapanese(value)) {
			this.setAttribute('jp', '');
		}
		if (addInAquarium) {
			app.addWordInAquarium(this);
		}
		this.newRandomTrajectory();
	}

	render() {
		return html`${this.value}`;
	}
	protected firstUpdated(_changedProperties: PropertyValues): void {
		this.updateDimensions();
		this.center();
	}

	updateDimensions() {
		if (!this.isConnected) {
			console.warn("Can't calculate dimensions of disconnected elements.");
			return;
		}
		const styles = window.getComputedStyle(this);
		this.#dimensions = [
			parseFloat(styles.width), // width
			parseFloat(styles.height), // height
		];
	}

	getDimensions() {
		if (!this.isConnected) {
			console.warn("Can't calculate dimensions of disconnected elements.");
			return [0, 0];
		}
		const styles = window.getComputedStyle(this);
		return [
			parseFloat(styles.width), // width
			parseFloat(styles.height), // height
		];
	}

	newRandomTrajectory() {
		this.#trajectory = [random(-1, 1, 2), random(-1, 1, 2)];
	}
	freeze() {
		this.#trajectory = [0, 0];
	}

	center() {
		const [width, height] = app.aquariumDimensions;
		const dimensions = this.getDimensions();
		const x = width / 2 - dimensions[0] / 2;
		const y = height / 2 - dimensions[1] / 2;
		this.setPosition(x, y);
	}

	protected updated(_changedProperties: PropertyValues<this>): void {
		if (_changedProperties.has('value')) {
			this.updateDimensions();
		}
	}

	setPosition(x: number, y: number) {
		this.style.left = `${x}px`;
		this.style.top = `${y}px`;
	}

	nextFrame() {
		const [width, height] = app.aquariumDimensions;
		const newX =
			parseFloat(this.style.left) + this.#trajectory[0] * store.speedFactor;
		const newY =
			parseFloat(this.style.top) + this.#trajectory[1] * store.speedFactor;

		const dimensions = this.getDimensions();

		// Collisions!
		if (newX <= 0 || newX + dimensions[0] >= width) {
			this.#trajectory[0] *= -1;
		}
		if (newY <= 0 || newY + dimensions[1] >= height) {
			this.#trajectory[1] *= -1;
		}

		// New pos
		this.setPosition(newX, newY);
	}
}
