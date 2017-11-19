(function () {
	Population = function (mutation, breeding, individuals) {
		this.individuals = individuals;
		this.mutation = mutation;
		this.breeding = breeding;
	}

	Population.prototype.test = function (deviation) {
		const mean = this.individuals.reduce(
			(mean, individual) => mean += individual.value / this.individuals.length, 0
		);
		const variance = this.individuals.map(element => {
			return Math.pow(element.value - mean, 2);
		}).reduce((variance, deviation) => {
			return variance += deviation / this.individuals.length;
		}, 0);
		const standardDeviation = Math.sqrt(variance);
		console.log(standardDeviation, deviation);
		return standardDeviation <= deviation;
	}

	Population.prototype.crossover = function (pairs) {
		const candidates = [];
		const breeders = [];
		const total = this.individuals.sort((a, b) => b.value - a.value)
			.reduce((total, individual) => total += individual.value, 0);
		for (let i = 0; i < pairs * 2; i++) {
			let index = Math.floor(Math.random() * total);
			this.individuals.reduce((index, individual) => {
				if (index > 0 && index - individual.value <= 0) {
					candidates.push(individual);
				}
				return index -= individual.value;
			}, index);
		}
		for (let i = 0; i < pairs; i++) {
			if (Math.random() < this.breeding) {
				breeders.push(this.individuals[i * 2], this.individuals[i * 2 + 1]);
			}
		}
		return breeders;
	}
}());
