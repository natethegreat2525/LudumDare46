import { generatePlanet } from "./terrain";

export const level_configs = [
    {
        gen: () => generatePlanet(600, "test" + Math.random(), 150, 4, .8, 50, 0),
        outerRadius: 180,
        waterSupply: 2000,
        goal: 1000,
        diggers: false,
        eaters: false,
    },
    {
        gen: () => generatePlanet(600, "test" + Math.random(), 180, 4, .7, 50, 1),
        outerRadius: 210,
        waterSupply: 3000,
        goal: 2000,
        diggers: false,
        eaters: false,
    },
    {
        gen: () => generatePlanet(600, "test" + Math.random(), 200, 4, .5, 50, 1),
        outerRadius: 230,
        waterSupply: 3000,
        goal: 4000,
        diggers: false,
        eaters: false,
    },
    {
        gen: () => generatePlanet(600, "test" + Math.random(), 250, 4, .5, 50, 2),
        outerRadius: 280,
        waterSupply: 4000,
        goal: 8000,
        diggers: true,
        eaters: false,
    },
    {
        gen: () => generatePlanet(600, "test" + Math.random(), 270, 4, .5, 50, 2),
        outerRadius: 300,
        waterSupply: 4000,
        goal: 16000,
        diggers: true,
        eaters: true,
    },
];