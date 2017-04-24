interface achievement{
    description:string
    value:number
}

var achievements:achievement[] = []
achievements.push({value: -1e9, description: 'Magnificent Desolation'})
achievements.push({value: 100, description: 'A Day at the Beach'})
achievements.push({value: 200, description: 'Land Ho'})
achievements.push({value: 300, description: 'Sugar, Salt, and Fat'})
achievements.push({value: 500, description: 'Montezuma\'s Revenge'})
achievements.push({value: 800, description: 'Wriggly Worms'})
achievements.push({value: 1300, description: 'Fishsticks'})
achievements.push({value: 2100, description: 'Creepy Crawlers'})
achievements.push({value: 3400, description: 'Thunder Lizards'})
achievements.push({value: 5500, description: 'Clever Monkeys'})
achievements.push({value: 8900, description: 'Prattling Philosophers'})
achievements.push({value: 14400, description: 'Crazy Mad Scientists'})
achievements.push({value: 23300, description: 'One Billion Cat Memes'})
achievements.push({value: 37700, description: 'Singularity Next Sunday'})
achievements.push({value: 61000, description: 'It\'s the Apocalypse'})
achievements.reverse()