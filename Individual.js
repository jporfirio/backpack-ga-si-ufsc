(function () {
	Individual = function () {
		this.chromossomes = [];
		this.fitness = 0;
	}

	Individual.prototype.generate = function (genes) {
		for (let i = 0; i < genes; i++) {
			this.chromossomes[i] = Math.round(Math.random()).toString();
		}
		return this;
	}

	Individual.prototype.checkMutation = function (chance) {
		if (Math.random() < chance) {
			return this.mutate();
		}
		return this;
	}

	Individual.prototype.breed = function (mate) {
		const child = new Individual();
		const index = Math.floor(Math.random() * this.chromossomes.length);
		child.chromossomes = this.chromossomes.slice(0, index).concat(mate.chromossomes.slice(index));
		return child;
	}

	Individual.prototype.mutate = function () {
		const mutant = new Individual();
		const randomGene = Math.floor(Math.random() * this.chromossomes.length);
		mutant.chromossomes[randomGene] = this.chromossomes[randomGene] === 0 ? 1 : 0;
		return mutant;
	}

	Individual.prototype.evaluate = function (values) {
		this.fitness = 0;
		for (let i = 0; i < this.chromossomes.length; i++) {
			this.fitness += this.chromossomes[i] === 1 ? values[i] : 0;
		}
		return this;
	}
})();
