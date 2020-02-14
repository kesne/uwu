<script>
    import { onMount } from 'svelte';

    let canvas;

    function initShaderProgram(gl, vsSource, fsSource) {
        const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
        const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert(
                'Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram),
            );
            return null;
        }

        return shaderProgram;
    }

    function loadShader(gl, type, source) {
        const shader = gl.createShader(type);

        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    onMount(() => {
        const gl = canvas.getContext('webgl');

        if (gl === null) {
            alert('Unable to initialize WebGL. Your browser or machine may not support it.');
            return;
        }

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        const vsSource = `
        attribute vec4 position;

        varying mediump vec4 fPosition;

        void main() {
        gl_Position = position;
        fPosition = position;
        }
        `;

        const fsSource = `
        precision highp float;

        uniform float time;

        varying mediump vec4 fPosition;

        vec3 calculate(vec3 c1, vec3 c2, vec3 c3, vec3 c4, float w1, float w2, float w3, float w4, float time) {
            float total = w1 + w2 + w3 + w4;
            float current = mod(time, total);
            if (current < w1) {
                return mix(c1, c2, current / w1);
            } else if (current < w1 + w2) {
                return mix(c2, c3, (current - w1) / (w2));
            } else if (current < w1 + w2 + w3) {
                return mix(c3, c4, (current - (w1 + w2)) / ( w3));
            } else {
                return mix(c4, c1, (current - (w1 + w2 + w3)) / (w4));
            }
        }

        float curve(float b, float x) {
            return 1.0 / (1.0 + pow(x / (1.0 - x), -b));
        }

        bool nearby(float i, float x) {
          return abs(i - x) < 0.02;
        }

        void main() {
            // PROBABLY KEEP THESE LOWER THAN ABOUT 4.0
            float TOP_OFFSET_WEIGHT = 3.0;
            float BOTTOM_OFFSET_WEIGHT = 3.0;
            float FINAL_OFFSET_WEIGHT = 2.0;
            vec3 d = vec3(255.0, 255.0, 255.0);
            /*
            vec3 c1 = vec3(204.0, 133.0, 230.0) / d;
            vec3 c2 = vec3(131.0, 192.0, 230.0) / d;
            vec3 c3 = vec3(129.0, 113.0, 227.0) / d;
            vec3 c4 = vec3(237.0, 133.0, 135.0) / d;
            */
            vec3 c1 = vec3(255.0, 90.0, 95.0) / d;
            vec3 c2 = vec3(123.0, 0.0, 81.0) / d;
            vec3 c3 = vec3(0.0, 127.0, 135.0) / d;
            vec3 c4 = vec3(255.0, 170.0, 145.0) / d;
            /*
            vec3 c1 = vec3(255.0, 0.0, 0.0) / d;
            vec3 c2 = vec3(0.0, 255.0, 0.0) / d;
            vec3 c3 = vec3(0.0, 0.0, 255.0) / d;
            vec3 c4 = vec3(0.0, 0.0, 0.0) / d;
            */
            vec2 uv = ((fPosition + vec4(1.0, 1.0, 0.0, 0.0)) / vec4(2.0)).xy;
            uv.y = 1.0 - uv.y;
            float t = time / 1.5;
            vec3 topLeft = calculate(c1, c2, c3, c4, 2.0, 3.0, 2.0, 4.0, t);
            vec3 bottomLeft = calculate(c2, c4, c1, c3, 3.0, 3.5, 2.5, 3.0, t);
            vec3 topRight = calculate(c4, c2, c3, c2, 2.5, 3.0, 4.0, 3.25, t);
            vec3 bottomRight = calculate(c3, c1, c2, c4, 2.0, 3.0, 2.5, 2.0, t);
            float topMix = (sin(t * 1.6 + uv.y * TOP_OFFSET_WEIGHT) / 2.0) + 1.0;
            vec3 top = mix(topLeft, topRight, curve(topMix, uv.x));
            float bottomMix = (sin(t * 1.5 + 0.5 + uv.y * BOTTOM_OFFSET_WEIGHT) / 2.0) + 1.0;
            vec3 bottom = mix(bottomLeft, bottomRight, curve(bottomMix, uv.x));
            float finalMix = (sin(t * 1.4 - 0.5 + uv.x * FINAL_OFFSET_WEIGHT) / 2.0) + 1.0;
            vec3 final = mix(top, bottom, curve(finalMix, uv.y));
            gl_FragColor = vec4(final,1.0);
        }
        `;

        const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

        const programInfo = {
            program: shaderProgram,
            attribLocations: {
                vertexPosition: gl.getAttribLocation(shaderProgram, 'position'),
            },
            uniformLocations: {
                time: gl.getUniformLocation(shaderProgram, 'time'),
            },
        };

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        const d = t => {
            draw(gl, programInfo, { position: positionBuffer }, t / 1000.0);
            window.requestAnimationFrame(d);
        };

        window.requestAnimationFrame(d);
    });

    function draw(gl, programInfo, buffers, t) {
        gl.uniform1f(programInfo.uniformLocations.time, t);

        {
            const numComponents = 2;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset,
            );
            gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
        }

        gl.useProgram(programInfo.program);

        {
            const offset = 0;
            const vertexCount = 4;
            gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
        }
    }
</script>

<style>
    canvas {
        position: absolute;
        top: 0;
        left: 0;
    }
</style>

<canvas bind:this={canvas} width="1920" height="1080" />
