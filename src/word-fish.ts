import {html, LitElement, type PropertyValues} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import {app} from './app-shell/app-shell.js';
import {random} from './utils.js';

@customElement('word-fish')
export class WordFish extends LitElement {
	@state() value = '';

	/** [width, height] */
	#dimensions = [0, 0];
	/** [stepX, stepY] */
	#trajectory = [0, 0]; // default: not moving

	constructor(value: string, addInAquarium = true) {
		super();
		this.value = value;
		this.style.position = 'absolute';
		this.style.left = '0';
		this.style.top = '0';
		if (addInAquarium) {
			app.addWordInAquarium(this);
			this.updateComplete.then(() => {
				this.updateDimensions();
				this.center();
			});
		}
		this.newRandomTrajectory();
	}

	render() {
		return html`${this.value}`;
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

	newRandomTrajectory() {
		this.#trajectory = [random(-2, 2, 1), random(-2, 2, 1)];
	}
	freeze() {
		this.#trajectory = [0, 0];
	}

	center() {
		const [width, height] = app.aquariumDimensions;
		const x = width / 2 - this.#dimensions[0] / 2;
		const y = height / 2 - this.#dimensions[1] / 2;
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
		const newX = parseFloat(this.style.left) + this.#trajectory[0];
		const newY = parseFloat(this.style.top) + this.#trajectory[1];

		// Collisions!
		if (newX <= 0 || newX + this.#dimensions[0] >= width) {
			this.#trajectory[0] *= -1;
		}
		if (newY <= 0 || newY + this.#dimensions[1] >= height) {
			this.#trajectory[1] *= -1;
		}

		// New pos
		this.setPosition(newX, newY);
	}
}
