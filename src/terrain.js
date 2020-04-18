import Simplex from 'simplex-noise';

// width - grid width and height (blocks)
// seed - generate same world with the same seed
// radius - planet radius (blocks)
// surfaceVariance - number of blocks the surface radius varies by
// interiorFill - (0 to 1) percentage of interior of the planet that is filled
// coreRadius - radius of planet core
export function generatePlanet(width, seed, radius, surfaceVariance, interiorFill, coreRadius) {
    let surfaceSimplex = new Simplex(seed);
    let interiorSimplex = new Simplex(seed + "a");
    let interiorSimplex2 = new Simplex(seed + "a");
    let arr = new Int8Array(width*width);
    const fillValueThreshold = interiorFill * 2 - 1;
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < width; y++) {
            let dx = x - width/2;
            let dy = y - width/2;
            let selfRad = Math.sqrt(dx*dx + dy*dy);
            if (selfRad < coreRadius) {
                //core of planet
                arr[x + y*width] = 3;
                continue;
            }
            let bumpyRadius = selfRad + surfaceSimplex.noise2D(x/(surfaceVariance*10), y/(surfaceVariance*10))*surfaceVariance;
            if (bumpyRadius < radius) {
                arr[x+y*width] = 1; //interior of the planet
                //this block is interior to the planet
                if (interiorSimplex.noise2D(x/64, y/64) * .66 + interiorSimplex2.noise2D(x/32, y/32) * .34 < fillValueThreshold) {
                    if (bumpyRadius < radius - 5) {
                        arr[x + y*width] = 2;
                    } else {
                        arr[x + y*width] = 4;
                    }
                }
            }
        }
    }
    return arr;
}