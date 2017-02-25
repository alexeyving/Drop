import './vendor.js'
import '../scss/index.scss';
import {Services} from './services/Services'
import {Components} from './components/Components'

let app = null;

export class App {
	constructor() {
		if(!app) {
			app = this
		}
		return app;
	}

	initialize() {
		this.services = new Services();
		this.components = new Components();
	}

}