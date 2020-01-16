import lifx from '../services/lifx';
import LifxLanColor from 'node-lifx-lan/lib/lifx-lan-color';

export const TILE_PIXELS = 8;

function getColorIndicesForCoord(x: number, y: number, width: number) {
    var red = y * (width * 4) + x * 4;
    return [red, red + 1, red + 2, red + 3];
}

// TODO: This could diff to determine if this is nessecary.
export default function canvasSync(ctx: CanvasRenderingContext2D) {
    const leftColors: any[][] = [[], [], [], [], []];
    const rightColors: any[][] = [[], [], [], [], []];

    const { data } = ctx.getImageData(0, 0, 2 * TILE_PIXELS, 5 * TILE_PIXELS);

    for (let j = 0; j < TILE_PIXELS * 5; j++) {
        for (let i = 0; i < TILE_PIXELS * 2; i++) {
            const indices = getColorIndicesForCoord(i, j, TILE_PIXELS * 2);
            const red = data[indices[0]] / 255;
            const green = data[indices[1]] / 255;
            const blue = data[indices[2]] / 255;
            // const alpha = data[indices[3]] / 255;
            const { hsb } = LifxLanColor.rgbToHsb({
                red,
                blue,
                green,
                brightness: 0.1,
            });

            if (i < TILE_PIXELS) {
                leftColors[Math.floor(j / TILE_PIXELS)].push(hsb);
            } else {
                rightColors[Math.floor(j / TILE_PIXELS)].push(hsb);
            }
        }
    }

    // TODO: Move into service?
    leftColors.forEach((colors, i) => {
        lifx.connection.left.tileSetTileState64({
            tile_index: 4 - i,
            colors: colors,
        });
    });

    rightColors.forEach((colors, i) => {
        lifx.connection.right.tileSetTileState64({
            tile_index: 4 - i,
            colors: colors,
        });
    });
}
