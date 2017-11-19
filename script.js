function run(capacity, size, deviation, generations) {
	const population = generate(items, capacity, size);
	const breedingChance = 0.6;
	const mutationChance = 0.01;
	console.log(population);
	let generation = 0;
	//while (!test(population, capacity, deviation)) {
	for (let i = 0; i < generations && !test(population, capacity, deviation); i++) {
		const candidates = select(population, 2);
		breed(candidates, breedingChance, capacity);
		mutate(population);
		evaluate(population);
	}
}

function generate(items, capacity, size) {
	let population = [];
	population.avgFitness = 0;
	for (let i = 0; i < size; i++) {
		let individual = {};
		do {
			individual.chromossomes = [];
			individual.fitness = 0;
			individual.weight = 0;
			items.forEach((item, index) => {
				individual.chromossomes[index] = {
					value: !!Math.round(Math.random()),
					item
				};
				if (individual.chromossomes[index].value) {
					individual.fitness += item.value;
					individual.weight += item.weight;
				}
			});
		} while (individual.weight > capacity);
		population.push(individual);
	}
	return population;
}

function evaluate(population) {
	population.avgFitness = 0;
	population.forEach(individual => {
		individual = evaluateIndividual(individual);
		population.avgFitness += individual.fitness / population.length;
	});
	console.log('Average fitness: ', population.avgFitness);
	return population;
}

function evaluateIndividual(individual) {
	individual.fitness = 0;
	individual.weight = 0;
	individual.chromossomes.forEach(gene => {
		if (gene.value) {
			individual.weight += gene.item.weight;
			individual.fitness += gene.item.value;
		}
	});
	return individual;
}

function test(population, capacity, deviation) {
	const mean = population.reduce((mean, individual) => {
		return mean += individual.fitness / population.length;
	}, 0);
	const variance = population.map(individual => Math.pow(individual.fitness - mean, 2))
		.reduce((mean, value) => mean += value / population.length, 0);
	deviation = mean * deviation;
	if (Math.sqrt(variance) < deviation) {
		population.sort((a, b) => b.fitness - a.fitness);
		console.log('values converged: ', population[0]);
		return population[0];
	}
	return false;
}

function select(population, pairs) {
	const total = population.reduce((total, individual) => total += individual.fitness, 0);
	population = population.sort((a, b) => b.fitness - a.fitness);
	const candidate = [];
	for (let i = 0; i < pairs * 2; i++) {
		pickCandidate(total, candidate);
	}
	return candidate;

	function pickCandidate(total, candidate) {
		let sum = 0;
		let random = Math.round(Math.random() * total);
		for (let j = 0; j < population.length; j++) {
			sum += population[j].fitness;
			if (sum - random >= 0) {
				candidate.push(population[j]);
				return;
			}
		}
	}
}

function breed(candidates, chance, ceiling) {
	for (let i = 0; i < candidates.length; i += 2) {
		if (Math.random() < chance) {
			let pivot, firstChild, secondChild;
			do {
				pivot = Math.floor(Math.random() * candidates[i].chromossomes.length);
				firstChild = cross(candidates[i], candidates[i + 1], pivot);
				secondChild = cross(candidates[i + 1], candidates[i], pivot);
			} while (!validate(firstChild, ceiling) || !validate(secondChild, ceiling));
			console.log(
				candidates[i].chromossomes == secondChild.chromossomes,
				candidates[i + 1].chromossomes == firstChild.chromossomes
			)
			candidates[i].chromossomes = evaluateIndividual(firstChild).chromossomes;
			candidates[i + 1].chromossomes = evaluateIndividual(secondChild).chromossomes;
		}
	}

	function cross(prefix, suffix, index) {
		let child = {};
		prefix = JSON.parse(JSON.stringify(prefix.chromossomes.slice(0, index)));
		suffix = JSON.parse(JSON.stringify(suffix.chromossomes.slice(index)));
		child.chromossomes = prefix.concat(suffix);
		return child;
	}
}

function mutate(population, chance, capacity) {
	console.log('mutating population');
	population.forEach(individual => {
		if (Math.random() < chance) {
			mutateIndividual(individual);
		}
	});
}

function mutateIndividual(individual, capacity) {
	let mutant = JSON.parse(JSON.stringify(individual));
	do {
		const index = Math.floor(Math.random() * mutant.chromossomes.length - 1);
		mutant.chromossomes[index].value = !mutant.chromossomes[index].value;
	} while (validate(mutant, capacity));
	return mutant;
}

function validate(individual, ceiling) {
	individual = evaluateIndividual(individual);
	return individual.weight <= ceiling;
}

const backpack = {
	capacity: 15
};

const items = (function () {
	let items = [];
	for (let i = 0; i < 20; i++) {
		items.push({
			weight: Math.round(Math.random() * 15) + 1,
			value: Math.round(Math.random() * 5) + 1
		})
	}
	return items;
})()
