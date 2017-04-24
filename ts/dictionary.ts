interface Achievement{
    description:string
    value:number
    blurb?:string
}

var achievements:Achievement[] = []
achievements.push({value: -1e9, description: 'Magnificent Desolation', blurb: 'Protect this fledgling planet from the onslaught of comets.'})
achievements.push({value: 200, description: 'A Day at the Beach', blurb: 'Mighty oceans have formed on this little world.'})
achievements.push({value: 400, description: 'Land Ho', blurb: 'Great continents have broken through the ocean surface.'})
achievements.push({value: 550, description: 'Sugar, Salt, and Fat', blurb: 'A promising brew of organic chemicals is forming.'})
achievements.push({value: 650, description: 'Montezuma\'s Revenge', blurb: 'In the primordial oceans, primitive cells have formed.'})
achievements.push({value: 800, description: 'Wriggly Worms', blurb: 'Early animal life has arisen on the tiny world.'})
achievements.push({value: 1000, description: 'Fishsticks', blurb: 'Time for a fish fry? These cramped oceans are teeming with life.'})
achievements.push({value: 1200, description: 'Creepy Crawlers', blurb: 'Little lifeforms have crawled onto the tiny shore.'})
achievements.push({value: 1500, description: 'Thunder Lizards', blurb: 'These tyrannical monsters seem oversized for this minuscule sphere.'})
achievements.push({value: 2250, description: 'Clever Monkeys', blurb: 'Ook! Ook! The inhabitants of this little rock are banging littler rocks together.'})
achievements.push({value: 2800, description: 'Prattling Philosophers', blurb: 'Latinate cogitators aduancing knouuledge across this diminutive orb.'})
achievements.push({value: 3400, description: 'Crazy Mad Scientists', blurb: 'Men in white lab coats burn Bunsen and coil Tesla in their zany experiments.'})
achievements.push({value: 3800, description: 'One Billion Cat Memes', blurb: 'Ceiling cat smiles upon ur teensy world. U can haz hugz.'})
achievements.push({value: 4500, description: 'Singularity Next Sunday', blurb: 'How will the technological apotheosis transfigure this pint-sized world?'})
achievements.push({value: 5500, description: 'It\'s the Apocalypse', blurb: 'It was a small world, after all.'})
achievements.reverse()