import { generatePlanet } from "./terrain";

export const level_configs = [
    {
        gen: () => generatePlanet(600, "test" + Math.random(), 150, 4, .8, 50, 0),
        outerRadius: 180,
        waterSupply: 2000,
        goal: 500,
        diggers: false,
        eaters: false,
        message: "LEVEL 1\n\nWelcome!\nHelp us take over these planets with a purple plant. It just needs water to grow!\nOnce it reaches critical mass, the mission is successful!"
    },
    {
        gen: () => {
            let grid = generatePlanet(600, "test" + Math.random(), 180, 4, .5, 50, 1);
            for (let x = -60; x <= 60; x++) {
                for (let y = -30; y <= 30; y++) {
                    let d = x*x/4 + y*y;
                    if (d < 25*25) {
                        grid[x + 300 + (y + 170)*600] = 6;
                    } else if (d < 29*29) {
                        grid[x + 300 + (y + 170)*600] = 2;
                    }
                }
            }
            return grid;
        },
        outerRadius: 210,
        waterSupply: 3000,
        goal: 2000,
        diggers: false,
        eaters: false,
        message: "LEVEL 2\n\nWatch out for lava on this planet!\nPlants are flammable!"
    },
    {
        gen: () => generatePlanet(600, "test" + Math.random(), 200, 4, .7, 50, 1),
        outerRadius: 230,
        waterSupply: 3000,
        goal: 4000,
        diggers: false,
        eaters: true,
        eaterCount: 5,
        message: "LEVEL 3\n\nWhoa! This planet appears to have some inhabitants.\nI wonder if they are friendly?"
    },
    {
        gen: () => generatePlanet(600, "test" + Math.random(), 250, 4, .5, 50, 2),
        outerRadius: 280,
        waterSupply: 4000,
        goal: 8000,
        diggers: true,
        eaters: true,
        eaterCount: 5,
        message: "LEVEL 4\n\nRumor has it this planet also has worms\nthat may hatch if you disturb them!"
    },
    {
        gen: () => generatePlanet(600, "test" + Math.random(), 270, 4, .5, 50, 2),
        outerRadius: 300,
        waterSupply: 4000,
        goal: 25000,
        diggers: true,
        eaters: true,
        eaterCount: 5,
        message: "LEVEL 5\n\nWe are going to need a lot to reach critical mass here."
    },
    {
        gen: () => generatePlanet(600, "test" + Math.random(), 100, 4, .8, 50, 0),
        outerRadius: 180,
        waterSupply: 4000,
        goal: 25000,
        diggers: false,
        eaters: false,
        message: "Thanks For Playing!"
    },
];