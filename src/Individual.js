(function () {
	Individual = function () {
		this.chromossomes = [];
		this.weight = 0;
		this.value = 0;
	}

	Individual.prototype.generate = function (items, ceiling) {
		do {
			items.forEach((item, index) => {
				this.chromossomes[index] = Math.round(Math.random());
				if (this.chromossomes[index]) {
					this.value += item.value;
					this.weight += item.weight;
				}
			});
		} while (this.weight > ceiling);
		return this;
	}

	Individual.prototype.checkMutation = function (chance) {
		if (Math.random() < chance) {
			return this.mutate();
		}
		return this;
	}

	Individual.prototype.breed = function (mate) {
		if (!mate) {
			return;
		}
		const child = new Individual();
		const index = Math.floor(Math.random() * this.chromossomes.length);
		child.chromossomes = this.chromossomes.slice(0, index)
			.concat(mate.chromossomes.slice(index));
		return child;
	}

	Individual.prototype.mutate = function () {
		const mutant = new Individual();
		const randomGene = Math.floor(Math.random() * this.chromossomes.length);
		mutant.chromossomes[randomGene] = this.chromossomes[randomGene] === 0 ? 1 : 0;
		return mutant;
	}

	Individual.prototype.evaluate = function (items) {
		this.value = this.weight = 0;
		items.forEach((item, index) => {
			if (this.chromossomes[index]) {
				this.value += item.value;
				this.weight += item.weight;
			}
		});
		return this;
	}
})();
