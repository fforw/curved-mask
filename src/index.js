import domready from "domready"
// noinspection ES6UnusedImports
import STYLE from "./style.css"
import SimplexNoise from "simplex-noise"


const PHI = (1 + Math.sqrt(5)) / 2;
const TAU = Math.PI * 2;
const DEG2RAD_FACTOR = TAU / 360;

const config = {
    width: 0,
    height: 0
};

let ctx, canvas;

const noise = new SimplexNoise();


function paint()
{
    console.log("paint")

    const { width, height } = config;

    const rnd = Math.random() * 100;

    const imageData = ctx.getImageData(0, 0, width, height);

    const {data} = imageData;

    const cx = width / 2;
    const cy = height / 2;

    let off = 0;
    for (let y = 0; y < height; y++)
    {
        for (let x = 0; x < width; x++)
        {
            const dx = cx - x;
            const dy = cy - y;

            const d = Math.sqrt(dx * dx + dy * dy);

            const f = 1;
            const angle = Math.atan2(dy, dx) * 10 * f

            const v = noise.noise3D(rnd + d * 0.25 * f, Math.cos(angle), Math.sin(angle)) < 0 ? 0 : 255;

            data[off] = v;
            data[off + 1] = v;
            data[off + 2] = v;
            data[off + 3] = 255;

            off += 4;
        }
    }

    ctx.putImageData(imageData, 0, 0);
}


domready(
    () => {

        canvas = document.getElementById("screen");
        ctx = canvas.getContext("2d");

        // const width = (window.innerWidth) | 0;
        // const height = (window.innerHeight) | 0;
        const width = 1920;
        const height = 1920;

        config.width = width;
        config.height = height;

        canvas.width = width;
        canvas.height = height;

        paint();

        canvas.addEventListener("click", paint, true);

        const downloadLink = document.getElementById("dl");

        downloadLink.addEventListener("click",  ev => {
            downloadLink.download="image-" + new Date().toISOString()
            downloadLink.href = canvas.toDataURL()
            downloadLink.click();
        }, true)

    }
);
