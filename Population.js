(function () {
	Population = function (mutation, breeding, size, max, values) {
		this.mutation = mutation;
		this.breeding = breeding;
		this.individuals = [];
		this.values = values;
		this.size = size;
		this.max = max;
	}

	/**
	 * generates a new random population with given size individuals
	 * @param {number} size the size of the population
	 * @param {number} chromossomes the number of chromossomes per individual
	 */
	Population.prototype.generate = function (size, chromossomes) {
		for (let i = 0; i < size; i++) {
			this.individuals[i] = new Individual().generate(chromossomes);
		}
		return this;
	}

	/**
	 * calculates the fitness of each individual in a given population,
	 * causing a mutation if its value exceeds the max
	 * @returns {*[]} the fitness of each member of the population
	 */
	Population.prototype.calculate = function () {
		this.individuals.forEach(individual => {
			while (individual.evaluate(this.values).value > this.max) {
				individual.mutate();
			}
			individual.fitness = individual.value / this.max;
		});
		return this;
	}

	/**
	 * test a population for a possible solution
	 * a solution is accepted if its standard deviation is within a given value
	 * @param {number} deviation the maximum standard deviation for a solution to be accepted
	 * @returns {boolean} returns whether the solution is accepted or not
	 */
	Population.prototype.test = function (deviation) {
		const mean = this.individuals.reduce(
			(mean, individual) => mean += individual.fitness / this.individuals.length, 0
		);
		const variance = this.individuals.map(element => {
			return Math.pow(element.fitness - mean, 2);
		}).reduce((variance, deviation) => {
			return variance += deviation / this.individuals.length;
		}, 0);
		const standardDeviation = Math.sqrt(variance);
		return standardDeviation <= deviation;
	}

	/**
	 * selects individuals for reproduction based on their fitness level
	 * @returns {*[]} the new population after recombination and mutation
	 */
	Population.prototype.crossover = function (pairs) {
		// select individuals for reproduction
		const fertile = [];
		const total = this.individuals.sort((a, b) => b.value - a.value)
			.reduce((total, individual) => total += individual.value, 0);
		for (let i = 0; i < pairs * 2; i++) {
			let index = Math.floor(Math.random() * total);
			this.individuals.reduce((index, individual) => {
				if (index > 0 && index - individual.value <= 0) {
					couples.push(individual);
				}
				return index -= individual.value;
			}, index);
		}
		// try to cross their chromossomes
		for (let i = 0; i < pairs; i++) {
			if (Math.random() < this.breeding) {

			}
		}
		// check for mutation on each individual
		this.individuals.forEach(individual => {
			const mutant = individual.checkMutation(this.mutation)
			while (mutant.evaluate(this.values).value > this.max) {
				mutant = individual.mutate();
			}
			individual.chromossomes = mutant.chromossomes;
		});
		return this;
	}
}());
