(function () {
	const generations = 3000;
	const deviation = 0.9;
	const mutation = 0.001;
	const breeding = 0.6;
	const pairs = 5;

	Knapsack = function (ceiling, items, size) {
		this.ceiling = ceiling;
		this.items = items;
		this.size = size;
	}

	Knapsack.prototype.generate = function () {
		individuals = this.generateIndividuals(this.items, this.ceiling);
		this.population = this.generatePopulation(individuals);
		return this;
	}

	Knapsack.prototype.run = function () {
		for (let i = 0; i < generations; i++) {
			if (this.population.test(deviation)) {
				console.log('Solution found: ', this.population);
				return;
			}
			this.breed(this.population.crossover(pairs));
			this.population.individuals.forEach(individual => {
				let mutant;
				do {
					mutant = individual.checkMutation(this.mutation).evaluate(this.items);
				} while (mutant.weight > this.ceiling);
			});
		}
		console.log('Solution not found, generations exhausted', this.population);
	}

	Knapsack.prototype.breed = function (breeders) {
		if (!breeders) return;
		for (let i = 0; i < breeders.length / 2; i++) {
			let firstChild;
			do {
				firstChild = breeders[i * 2].breed(breeders[i * 2 + 1]).evaluate(this.items);
			} while (firstChild.weight > this.ceiling);
			let secondChild;
			do {
				secondChild = breeders[i * 2 + 1].breed(breeders[i * 2]).evaluate(this.items);
			} while (secondChild.weight > this.ceiling);
			breeders[i] = firstChild;
			breeders[i + 1] = secondChild;
		}
	}

	Knapsack.prototype.generateIndividuals = function () {
		const individuals = [];
		for (let i = 0; i < this.size; i++) {
			individuals.push(new Individual().generate(this.items, this.ceiling));
		}
		return individuals;
	}

	Knapsack.prototype.generatePopulation = function (individuals) {
		return new Population(mutation, breeding, individuals)
	}

}());
