import type {MdDialog} from '@material/web/all.js';
import {withController} from '@snar/lit';
import {customElement} from 'custom-element-decorator';
import {html, LitElement} from 'lit';
import {withStyles} from 'lit-with-styles';
import {query, state} from 'lit/decorators.js';
import {FormBuilder} from '../forms/FormBuilder.js';
import '../material/dialog-patch.js';
import {store} from '../store.js';
import {themeStore} from '../styles/styles.js';
import {renderThemeElements} from '../styles/theme-elements.js';
import styles from './settings-dialog.css?inline';
import {SVG_GITHUB} from '../assets/assets.js';

let F = new FormBuilder(store);

@customElement({name: 'settings-dialog', inject: true})
@withStyles(styles)
@withController(themeStore)
@withController(store)
class SettingsDialog extends LitElement {
	@state() open = false;

	@query('md-dialog') dialog!: MdDialog;

	render() {
		return html`
			<md-dialog
				?open=${this.open}
				@closed=${() => (this.open = false)}
				style="max-width:min(100vw - 18px, 400px);width:100%"
			>
				<header slot="headline" class="select-none">
					<md-icon>settings</md-icon>
					Settings
				</header>

				<form
					slot="content"
					method="dialog"
					id="form"
					class="flex flex-col gap-9"
				>
					<md-list class="p-0 mt-6" style="--forms-switch-padding:initial">
						<!-- put the switches here -->
						${F.SLIDER('Speed', 'speedFactor', {min: 1, max: 20})}
					</md-list>

					<div class="mb-5">
						<p>Theme</p>
						${renderThemeElements()}
					</div>
				</form>

				<div slot="actions" class="justify-bteween">
					<md-filled-tonal-button
						href="https://github.com/vdegenne/words-aquarium"
						target="_blank"
					>
						<md-icon slot="icon">${SVG_GITHUB}</md-icon>
						Source
					</md-filled-tonal-button>
					<div class="flex-1"></div>
					<md-text-button form="form" autofocus>Close</md-text-button>
				</div>
			</md-dialog>
		`;
	}

	async show() {
		if (this.dialog.open) {
			const dialogClose = new Promise((resolve) => {
				const resolveCB = () => {
					resolve(null);
					this.dialog.removeEventListener('closed', resolveCB);
				};
				this.dialog.addEventListener('closed', resolveCB);
			});
			this.dialog.close();
			await dialogClose;
		}
		this.open = true;
	}

	close(returnValue?: string) {
		return this.dialog.close(returnValue);
	}
}

declare global {
	interface Window {
		settingsDialog: SettingsDialog;
	}
	interface HTMLElementTagNameMap {
		'settings-dialog': SettingsDialog;
	}
}

export const settingsDialog = (window.settingsDialog = new SettingsDialog());
