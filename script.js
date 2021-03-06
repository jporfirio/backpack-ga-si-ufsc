

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var question = function(q) {
    return new Promise( (res, rej) => {
        rl.question( q, answer => {
            res(answer);
        })
    });
};

async function main() {
    var capacity;
    var size;
    var deviation;
    var generations;
    var populationSize;
     
    capacity = await question('Informe a capacidade da mochila: ');
	size = await question('Informe a quantidade de itens: ');
	deviation = await question('Informe o desvio padrão para função de convergência: ');
	populationSize = await question('Informe o tamanho da população inicial: ');
	generations = await question('Informe a quantidade de gerações: ');
    
    run(capacity, size, deviation, generations, populationSize);
};


main();

function run(capacity, size, deviation, generations, populationSize) {
	
	const breedingChance = 0.7;
	const mutationChance = 0.001;

    var initialPopulation = generate(generatItems(size), capacity, populationSize);

	for (let i = 0; i < generations ; i++) {
		var candidates;
		
		if(i==0){
			candidates = select(initialPopulation, 2);
		} else{
			candidates = select(candidates, 2);
		}
		 
		breed(candidates, breedingChance, capacity);
		mutate(candidates, mutationChance, 15);		
		evaluate(candidates);
        
	}
}

function generatItems(quantity) {
	let items = [];
	for (let i = 0; i < quantity; i++) {
		items.push({
			weight: Math.round(Math.random() * 50) + 1,
			value: Math.round(Math.random() * 50) + 1
		})
	}
	return items;
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

var generation = 0;
function evaluate(population) {

    generation++;
	
    let avgFitness = 0;
	population.forEach(individual => {
		individual = evaluateIndividual(individual);
		avgFitness += individual.fitness / population.length;
	});
	if (avgFitness !== population.avgFitness) {
		population.avgFitness = avgFitness;
	}
	
	
    
    console.log();
    console.log("Generation " + generation);
    population.forEach(individual => {
        var chromossome = ''
        individual.chromossomes.forEach(item => {
			chromossome += item.value ? '1' : '0';
	    });
		
		console.log(chromossome);		
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

function test(population, capacity, desiredDeviation) {
	const mean = populationMean(population);
	const stdDeviation = populationDeviation(population, mean);
	const proportionalDeviation = stdDeviation / mean;
	if (proportionalDeviation < desiredDeviation) {
		population.sort((a, b) => b.fitness - a.fitness);
		console.log('values converged: ', population[0]);
		return population[0];
	}
	return false;
}

function populationMean(population) {
	return population.reduce((mean, individual) => mean += individual.fitness / population.length, 0);
}

function populationDeviation(population, mean) {
	const variance = population.map(individual => Math.pow(individual.fitness - mean, 2))
		.reduce((variance, sample) => variance += sample / population.length, 0);
	return Math.sqrt(variance);
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

function validate(individual, ceiling) {
	individual = evaluateIndividual(individual);
	return individual.weight <= ceiling;
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

			candidates[i].chromossomes = firstChild.chromossomes;
			candidates[i + 1].chromossomes = secondChild.chromossomes;
		}
	}

}

function cross(prefix, suffix, index) {
		let child = {};
		prefix = JSON.parse(JSON.stringify(prefix.chromossomes.slice(0, index)));
		suffix = JSON.parse(JSON.stringify(suffix.chromossomes.slice(index)));
		child.chromossomes = prefix.concat(suffix);
		return child;
	}

function mutate(population, chance, capacity) {
	population.forEach(individual => {
		const dice = Math.random();
		if (dice < chance) {
			individual.chromossomes = mutateIndividual(individual).chromossomes;
		}
	});
}

function mutateIndividual(individual, capacity) {
	let mutant = JSON.parse(JSON.stringify(individual));
	do {
		const index = Math.floor(Math.random() * mutant.chromossomes.length);
		mutant.chromossomes[index].value = !mutant.chromossomes[index].value;
	} while (validate(mutant, capacity));
	return mutant;
}
