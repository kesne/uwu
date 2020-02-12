<script>
    import { onMount } from 'svelte';

    let canvas;

    const shader = `
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
            vec2 uv = fragCoord / iResolution.xy;
            uv.y = 1.0 - uv.y;
            float t = iTime / 1.5;
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

    onMount(() => {
        const gl = canvas.getContext('webgl');
        console.log(gl);

        /*======== Defining and storing the geometry ===========*/

        var vertices = [
            -0.5, 0.5, 0,
            0.5, 0.5, 0,
            -0.5, -0.5, 0,
            0.5, -0.5, 0
        ];

        var indices = [0, 1, 2, 3];

        // Create an empty buffer object to store vertex buffer
        var vertex_buffer = gl.createBuffer();

        // Bind appropriate array buffer to it
        gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

        // Pass the vertex data to the buffer
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        // Unbind the buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        // Create an empty buffer object to store Index buffer
        var Index_Buffer = gl.createBuffer();

        // Bind appropriate array buffer to it
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);

        // Pass the vertex data to the buffer
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

        // Unbind the buffer
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

        /*================ Shaders ====================*/

        // Vertex shader source code
        var vertCode =
            'attribute vec3 coordinates;' +
            'void main(void) {' +
            ' gl_Position = vec4(coordinates, 1.0);' +
            '}';

        // Create a vertex shader object
        var vertShader = gl.createShader(gl.VERTEX_SHADER);

        // Attach vertex shader source code
        gl.shaderSource(vertShader, vertCode);

        // Compile the vertex shader
        gl.compileShader(vertShader);

        //fragment shader source code
        var fragCode = 'void main(void) {' + ' gl_FragColor = vec4(0.0, 0.0, 0.0, 0.1);' + '}';

        // Create fragment shader object
        var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

        // Attach fragment shader source code
        gl.shaderSource(fragShader, shader);

        // Compile the fragmentt shader
        gl.compileShader(fragShader);

        // Create a shader program object to store
        // the combined shader program
        var shaderProgram = gl.createProgram();

        // Attach a vertex shader
        gl.attachShader(shaderProgram, vertShader);

        // Attach a fragment shader
        gl.attachShader(shaderProgram, fragShader);

        // Link both the programs
        gl.linkProgram(shaderProgram);

        // Use the combined shader program object
        gl.useProgram(shaderProgram);

        /*======= Associating shaders to buffer objects =======*/

        // Bind vertex buffer object
        gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

        // Bind index buffer object
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);

        // Get the attribute location
        var coord = gl.getAttribLocation(shaderProgram, 'coordinates');

        // Point an attribute to the currently bound VBO
        gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);

        // Enable the attribute
        gl.enableVertexAttribArray(coord);

        /*=========Drawing the triangle===========*/

        // Clear the canvas
        gl.clearColor(0.5, 0.5, 0.5, 0.9);

        // Enable the depth test
        gl.enable(gl.DEPTH_TEST);

        // Clear the color buffer bit
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Set the view port
        gl.viewport(0, 0, canvas.width, canvas.height);

        // Draw the triangle
        gl.drawElements(gl.TRIANGLE_STRIP, indices.length, gl.UNSIGNED_SHORT, 0);
    });
</script>

<canvas bind:this={canvas} width="1920" height="1080" />
