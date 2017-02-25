let services = null;
export class Services {
	constructor() {
		if (!services) {
			services = this;
		}
		return services;
	}
}