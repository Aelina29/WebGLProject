class Cube {
    // constructor(gl, size, color, cubePosition) {
    //     this.gl = gl;
    //     this.positions = ([
    //         // Front face
    //         -1.0, -1.0,  1.0,
    //         1.0, -1.0,  1.0,
    //         1.0,  1.0,  1.0,
    //         -1.0,  1.0,  1.0,
    //         // Back face
    //         -1.0, -1.0, -1.0,
    //         -1.0,  1.0, -1.0,
    //         1.0,  1.0, -1.0,
    //         1.0, -1.0, -1.0,
    //         // Top face
    //         -1.0,  1.0, -1.0,
    //         -1.0,  1.0,  1.0,
    //         1.0,  1.0,  1.0,
    //         1.0,  1.0, -1.0,
    //         // Bottom face
    //         -1.0, -1.0, -1.0,
    //         1.0, -1.0, -1.0,
    //         1.0, -1.0,  1.0,
    //         -1.0, -1.0,  1.0,
    //         // Right face
    //         1.0, -1.0, -1.0,
    //         1.0,  1.0, -1.0,
    //         1.0,  1.0,  1.0,
    //         1.0, -1.0,  1.0,
    //         // Left face
    //         -1.0, -1.0, -1.0,
    //         -1.0, -1.0,  1.0,
    //         -1.0,  1.0,  1.0,
    //         -1.0,  1.0, -1.0,
    //     ]).map((point) => point * size);
    //     this.position = cubePosition;
    //     this.positionBuffer = this.gl.createBuffer();
    //     this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    //     this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.positions), this.gl.STATIC_DRAW);

    //     this.numTextureCoordinates = [
    //         // Front
    //         0.0, 0.0,
    //         1.0, 0.0,
    //         1.0, 1.0,
    //         0.0, 1.0,
    //         // Back
    //         1.0, 0.0,
    //         1.0, 1.0,
    //         0.0, 1.0,
    //         0.0, 0.0,
    //         // Top
    //         0.0, 1.0,
    //         0.0, 0.0,
    //         1.0, 0.0,
    //         1.0, 1.0,
    //         // Bottom
    //         1.0, 1.0,
    //         0.0, 1.0,
    //         0.0, 0.0,
    //         1.0, 0.0,
    //         // Right
    //         1.0, 0.0,
    //         1.0, 1.0,
    //         0.0, 1.0,
    //         0.0, 0.0,
    //         // Left
    //         0.0, 0.0,
    //         1.0, 0.0,
    //         1.0, 1.0,
    //         0.0, 1.0,
    //     ];        
    //     this.iceTextureCoordinates = [
    //         // Front
    //         0.0, 0.0,
    //         1.0, 0.0,
    //         1.0, 1.0,
    //         0.0, 1.0,
    //         // Back
    //         0.0, 0.0,
    //         1.0, 0.0,
    //         1.0, 1.0,
    //         0.0, 1.0,
    //         // Top
    //         0.0, 0.0,
    //         1.0, 0.0,
    //         1.0, 1.0,
    //         0.0, 1.0,
    //         // Bottom
    //         0.0, 0.0,
    //         1.0, 0.0,
    //         1.0, 1.0,
    //         0.0, 1.0,
    //         // Right
    //         0.0, 0.0,
    //         1.0, 0.0,
    //         1.0, 1.0,
    //         0.0, 1.0,
    //         // Left
    //         0.0, 0.0,
    //         1.0, 0.0,
    //         1.0, 1.0,
    //         0.0, 1.0,
    //     ];

    //     this.faceColors = new Array(6).fill(color);
    //     this.colors = this.faceColors.flatMap(color => [...color, ...color, ...color, ...color]);
    //     this.colorBuffer = this.gl.createBuffer();
    //     this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
    //     this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.colors), this.gl.STATIC_DRAW);

    //     this.triangles = [
    //         0,  1,  2,      0,  2,  3,    // front
    //         4,  5,  6,      4,  6,  7,    // back
    //         8,  9,  10,     8,  10, 11,   // top
    //         12, 13, 14,     12, 14, 15,   // bottom
    //         16, 17, 18,     16, 18, 19,   // right
    //         20, 21, 22,     20, 22, 23,     // left
    //     ];
    //     this.triangleBuffer = this.gl.createBuffer();
    //     this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.triangleBuffer);
    //     this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.triangles), this.gl.STATIC_DRAW);
	
    //     this.numTextureCoordBuffer = gl.createBuffer();
    //     gl.bindBuffer(gl.ARRAY_BUFFER, this.numTextureCoordBuffer);
    //     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.numTextureCoordinates), gl.STATIC_DRAW);
    
    //     this.iceTextureCoordBuffer = gl.createBuffer();
    //     gl.bindBuffer(gl.ARRAY_BUFFER, this.iceTextureCoordBuffer);
    //     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.iceTextureCoordinates), gl.STATIC_DRAW);    
    // }

    constructor(gl, size, color, cubePosition, pos_obj, tex_obj, pos_ind_obj, tex_ind_obj) {
        this.gl = gl;
        this.positions = pos_obj.map((point) => point * size);
        this.position = cubePosition;
        this.positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.positions), this.gl.STATIC_DRAW);

        this.numTextureCoordinates = tex_obj;        
        this.iceTextureCoordinates = tex_obj;

        this.faceColors = new Array(6).fill(color);
        this.colors = this.faceColors.flatMap(color => [...color, ...color, ...color, ...color]);
        this.colorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.colors), this.gl.STATIC_DRAW);

        this.triangles = pos_ind_obj;
        this.triangleBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.triangleBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.triangles), this.gl.STATIC_DRAW);
	
        this.numTextureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.numTextureCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.numTextureCoordinates), gl.STATIC_DRAW);
    
        this.iceTextureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.iceTextureCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.iceTextureCoordinates), gl.STATIC_DRAW);    
    }

    getBuffers() {
        return {
            position: this.positionBuffer,
            color: this.colorBuffer,
            indices: this.triangleBuffer,
            raw_indices: this.triangles,
        };
    }

    setVertexes(programInfo) {
        const gl = this.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition,3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
        
        gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        gl.vertexAttribPointer(programInfo.attribLocations.vertexColor,4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
        
        gl.bindBuffer(this.gl.ARRAY_BUFFER, this.numTextureCoordBuffer);
        gl.vertexAttribPointer(
            programInfo.attribLocations.numTextureCoord,
            2,
            gl.FLOAT,
            false,//false in prezent
            0,
            0);
        gl.enableVertexAttribArray(programInfo.attribLocations.numTextureCoord);

        gl.bindBuffer(this.gl.ARRAY_BUFFER, this.iceTextureCoordBuffer);
        gl.vertexAttribPointer(
            programInfo.attribLocations.iceTextureCoord,
            2,
            gl.FLOAT,
            false,//false in prezenr
            0,
            0);
        gl.enableVertexAttribArray(programInfo.attribLocations.iceTextureCoord);
    }

    toPosition(Matrix) {
        this.translate(Matrix, this.position);
    }

    translate(Matrix, translation) {
        return mat4.translate(Matrix, Matrix, translation);
    }

    rotate(Matrix, rad, axis) {
        return mat4.rotate(Matrix, Matrix, rad, axis);
    }

    rotateAround(Matrix, rad, point) {
        const translation = this.position.map((p, i) => p - point[i]);
        this.translate(Matrix, translation.map(p => -p));
        this.rotate(Matrix, rad, [0, 1, 0]);
        this.translate(Matrix, translation);
        return Matrix;
    }
}

//============================================================================================================

var cubeVertexShader = `
attribute vec4 aVertexPosition;
attribute vec4 aVertexColor;
//attribute vec2 aTextureCoord;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
attribute vec2 aNumTextureCoord;
attribute vec2 aIceTextureCoord;
varying highp vec2 vNumTextureCoord;
varying highp vec2 vIceTextureCoord;
uniform mat4 uTextureMatrix;
varying vec4 vColor;
void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vNumTextureCoord = ((uTextureMatrix) * vec4(aNumTextureCoord, 0.0 , 1.0)).xy;
    vIceTextureCoord = ((uTextureMatrix) * vec4(aIceTextureCoord, 0.0 , 1.0)).xy;
    vColor = aVertexColor;
}`

var cubeFragmentShader = `
precision highp float;
uniform sampler2D uSampler1;
uniform sampler2D uSampler2;
uniform lowp int uColorBlend;
uniform lowp int uTextureBlend;
uniform float uAlpha;
varying highp vec2 vNumTextureCoord;
varying highp vec2 vIceTextureCoord;
varying vec4 vColor;
void main(void) {
    gl_FragColor = texture2D(uSampler1, vNumTextureCoord);
    if (uColorBlend == 1) {
        gl_FragColor = vec4(gl_FragColor.rgb * vColor.rgb, vColor.a);
    }
    if (uTextureBlend == 1) {
       // gl_FragColor = vec4(gl_FragColor.rgb * vColor.rgb, vColor.a);
        
        vec4 textureColor2 = texture2D(uSampler2, vIceTextureCoord);
        gl_FragColor = vec4(textureColor2.rgb * gl_FragColor.rgb, uAlpha);
    }
}`

//============================================================================================================

const ROTATION_SPEED = 0.015;
const MOVE_SPEED = 0.05;
let currentSpeedRotation = 0;
let currentSpeedX = 0;
let currentSpeedY = 0;
let currentSpeedZ = 0;
let currentMode = 0;
curRotations = [0.0, 0.0, 0.0];
curPositionCenter = [0, -2, -10];

window.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft')              //<-, влево поворот
        currentSpeedRotation = -ROTATION_SPEED;
    else if (event.key === 'ArrowRight')        //->, вправо поворот
        currentSpeedRotation = ROTATION_SPEED;
    else if (event.key.toLowerCase() === 'a')   //A, лево
        currentSpeedX = -MOVE_SPEED;
    else if (event.key.toLowerCase() === 'd')   //D, правл
        currentSpeedX = MOVE_SPEED;
    else if (event.key.toLowerCase() === 's')   //S, низ
        currentSpeedY = -MOVE_SPEED;
    else if (event.key.toLowerCase() === 'w')   //W, верх
        currentSpeedY = MOVE_SPEED;  
    else if (event.key === 'ArrowUp')   //стрелка вверх, дальше
        currentSpeedZ = MOVE_SPEED;
    else if (event.key === 'ArrowDown')   //стрелка вниз, ближе
        currentSpeedZ = -MOVE_SPEED;          
});
window.addEventListener('keyup', event => {
    if (event.key === 'ArrowLeft')              //<-, влево поворот
        currentSpeedRotation = 0;
    else if (event.key === 'ArrowRight')        //->, вправо поворот
        currentSpeedRotation = 0;
    else if (event.key.toLowerCase() === 'a')   //A, лево
        currentSpeedX = 0;
    else if (event.key.toLowerCase() === 'd')   //D, правл
        currentSpeedX = 0;
    else if (event.key.toLowerCase() === 's')   //S, низ
        currentSpeedY = 0;
    else if (event.key.toLowerCase() === 'w')   //W, верх
        currentSpeedY = 0;  
    else if (event.key === 'ArrowUp')   //стрелка вверх, дальше
        currentSpeedZ = 0;
    else if (event.key === 'ArrowDown')   //стрелка вниз, ближе
        currentSpeedZ = 0;  
});

[...document.querySelectorAll('input[type="radio"]')].forEach(el => el.addEventListener('change', event => {
    if (event.target.checked) {
        currentMode = Number(event.target.value);
    }
}));

const rotateEachCube = (obj, Matrix, rad) => obj.rotate(Matrix, rad, [0, 1, 0]);
const rotatePedestalAroundSelfCenter = (obj, Matrix, rad) => {
    obj.rotateAround(Matrix, rad, [0, 0, -10]);
}
const rotatePedestalAroundWorldCenter = (obj, Matrix, rad) => {
    obj.rotateAround(Matrix, rad, [0, 0, 0]);
}

//============================================================================================================

class Scene {
    constructor(webgl_context, vertex_shader, fragment_shader) {
        this.gl = webgl_context;
        const shaderProgram = this.initShadersProgram(vertex_shader, fragment_shader);
        this.programInfo = {
            program: shaderProgram,
            attribLocations: {
                vertexPosition: this.gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
                vertexColor: this.gl.getAttribLocation(shaderProgram, 'aVertexColor'),
                numTextureCoord: this.gl.getAttribLocation(shaderProgram, 'aNumTextureCoord'),
                iceTextureCoord: this.gl.getAttribLocation(shaderProgram, 'aIceTextureCoord'),
            },
            uniformLocations: {
                projectionMatrix: this.gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
                modelViewMatrix: this.gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
                sampler1: this.gl.getUniformLocation(shaderProgram, 'uSampler1'),
                sampler2: this.gl.getUniformLocation(shaderProgram, 'uSampler2'),    
                textureMatrix: this.gl.getUniformLocation(shaderProgram, 'uTextureMatrix'),
                colorBlend: this.gl.getUniformLocation(shaderProgram, 'uColorBlend'),
                textureBlend: this.gl.getUniformLocation(shaderProgram, 'uTextureBlend'),
                alpha: this.gl.getUniformLocation(shaderProgram, 'uAlpha'),
            }
        }
        this.objects = [];
        //console.log( this.objects[0]);
        this.fieldOfView = 45 * Math.PI / 180;
        this.aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
        this.zNear = 0.1;
        this.zFar = 100.0;
    }

    start() {
        const texture1 = loadTexture(this.gl, image1.src);
        const texture2 = loadTexture(this.gl, image2.src);
        const texture3 = loadTexture(this.gl, image3.src);
        const texture4 = loadTexture(this.gl, image4.src);
        const textureMark42 = loadTexture(this.gl, imageMark42.src);
        const render = () => {
            this.drawScene( [textureMark42, texture1, texture3, texture2, textureMark42]);
            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);
    }

    drawScene(textures) {
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clearDepth(1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        const projectionMatrix = mat4.create();
        mat4.perspective(projectionMatrix, this.fieldOfView, this.aspect, this.zNear, this.zFar);
        var i = 0;
        if(isLoading)
        {
            console.log("Loading models from obj");
            this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
        }
        else
        {                  
            //size color position of center
            this.objects = [
                new Cube(this.gl, 3, [1.0, 0.0, 0.0, 1], [0, -2, -10],pos,tex,pos_ind, tex_ind),
                //new Cube(this.gl, 1, [1.0, 0.0, 0.0, 1], [0, 0, -10]), // red down
                // new Cube(this.gl, 1, [1.0, 0.0, 0.0, 1], [0, 2, -10]), // red up
                // new Cube(this.gl, 1, [0.0, 1.0, 0.0, 1], [-2, 0, -10]), // green
                // new Cube(this.gl, 1, [0.0, 0.0, 1.0, 1], [2, 0, -10]), // blue
            ]; 
            this.objects.forEach(obj => {
                const textureMatrix = mat4.create();
                // совмещаем координаты
                mat4.translate(textureMatrix, textureMatrix, [0.5, 0.5, 0.0]);
                mat4.rotate(textureMatrix, textureMatrix, 0, [0, 0, 1.0]);
                mat4.translate(textureMatrix, textureMatrix, [-0.5, -0.5, 0.0]);
    
                var modelViewMatrix = mat4.create();
                
                //движение
                curPositionCenter = [curPositionCenter[0]+currentSpeedX, curPositionCenter[1]+currentSpeedY, curPositionCenter[2]+currentSpeedZ];
                obj.position = curPositionCenter;
                //console.log(obj.position);
                obj.toPosition(modelViewMatrix);
                rotatePedestalAroundWorldCenter(obj, modelViewMatrix, curRotations[2]);
                rotatePedestalAroundSelfCenter(obj, modelViewMatrix, curRotations[1]);
                rotateEachCube(obj, modelViewMatrix, curRotations[0]);

       
                obj.setVertexes(this.programInfo);
    
                // Указываем WebGL, что мы используем текстурный регистр 1
                this.gl.activeTexture(this.gl.TEXTURE1);
                // Связываем текстуру с регистром
                this.gl.bindTexture(this.gl.TEXTURE_2D, textures[4]);
                this.gl.activeTexture(this.gl.TEXTURE0);
                this.gl.bindTexture(this.gl.TEXTURE_2D, textures[i]);
                i++;
    
                const buffers = obj.getBuffers();
                this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
                this.gl.useProgram(this.programInfo.program);
                this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
                this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);
                this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.textureMatrix, false, textureMatrix);
                this.gl.drawElements(this.gl.TRIANGLES, buffers.raw_indices.length, this.gl.UNSIGNED_SHORT, 0);
                this.gl.uniform1i(this.programInfo.uniformLocations.sampler1, 0);
                this.gl.uniform1i(this.programInfo.uniformLocations.sampler2, 1);
                this.gl.uniform1i(this.programInfo.uniformLocations.colorBlend, colorBlend);
                this.gl.uniform1i(this.programInfo.uniformLocations.textureBlend, textureBlend);
                this.gl.uniform1f(this.programInfo.uniformLocations.alpha, alpha);
            });
            curRotations[currentMode] += currentSpeedRotation;
        }
    }  

    initShadersProgram(vertexShaderCode, fragmentShaderCode) {
        const vertexShader = this.loadShader(this.gl, this.gl.VERTEX_SHADER, vertexShaderCode);
        const fragmentShader = this.loadShader(this.gl, this.gl.FRAGMENT_SHADER, fragmentShaderCode);
        const shaderProgram = this.gl.createProgram();
        this.gl.attachShader(shaderProgram, vertexShader);
        this.gl.attachShader(shaderProgram, fragmentShader);
        this.gl.linkProgram(shaderProgram);
        if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
            alert('Unable to initialize the shader program: ' + this.gl.getProgramInfoLog(shaderProgram));
            return null;
        }
        return shaderProgram;
    }

    loadShader(gl, type, source) {
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
}

//=========================================================================================================================



let textureBlend = 0;
function setTexture() {
    textureBlend = Number(!textureBlend);
    //console.log("textureBlend = "+textureBlend);
}
document.querySelector('#add-material').addEventListener('click', setTexture);

let colorBlend = 0;
function setColor() {
    colorBlend = Number(!colorBlend);
    //console.log("colorBlend = "+colorBlend);
}
document.querySelector('#add-color').addEventListener('click', setColor);

let alpha = 1.0;

// У WebGL1 разные требования к изображениям, имеющим размер степени 2 и к не имеющим размер степени 2
function isPowerOf2(value) {
    return (value & (value - 1)) === 0;
}

function loadTexture(gl, url) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 255, 255]);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);
    //console.log(url);
    const image = new Image();
    image.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        // указываем как текстура должна позиционироваться. Так, в данном случае
        // передаем в качестве параметра значение gl.UNPACK_FLIP_Y_WEBGL - этот параметр указывает методу
        // gl.texImage2D(), что изображение надо перевернуть относительно горизонтальной оси.
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);

        if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
            // Размер соответствует степени 2
            gl.generateMipmap(gl.TEXTURE_2D);
        } else {
            // устанавливаем натяжение по краям
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }
    };
    image.crossOrigin = "anonymous"
    image.src = url;
    //image.src = "https://webglfundamentals.org/webgl/resources/f-texture.png";
    return texture;
}

const image1 = document.getElementById("tex1");
const image2 = document.getElementById("tex2");
const image3 = document.getElementById("tex3");
const image4 = document.getElementById("tex4");
const imageMark42 = document.getElementById("texMark42");

//=================================================================================================================================

let isLoading = true;
let pos = [];
let tex = [];
let norm = [];
let pos_ind = [];
let tex_ind = [];
let norm_ind = [];

function main() {
    fetch('Mark42.obj')
        .then(response => response.text())
        .then(data => {
            //console.log(data);
            const lines = data.split('\n');
            let splitLine = [];
            lines.forEach(function(line) {
                //console.log(line);
                splitLine = line.split(' ');
                switch(splitLine[0]) {                    
                case 'vn':
                    norm.push(splitLine[1], splitLine[2], splitLine[3]);
                    break
                case 'vt':
                    tex.push(splitLine[1], splitLine[2]);
                    break
                case 'v':
                    pos.push(splitLine[1], splitLine[2], splitLine[3]);
                    break
                case 'f':
                    pos_ind.push(splitLine[1].split("/")[0]-1, splitLine[2].split("/")[0]-1, splitLine[3].split("/")[0]-1);
                    tex_ind.push(splitLine[1].split("/")[1]-1, splitLine[2].split("/")[1]-1, splitLine[3].split("/")[2]-1);
                    norm_ind.push(splitLine[1].split("/")[2]-1, splitLine[2].split("/")[2]-1, splitLine[3].split("/")[2]-1);
                    break
                default:
                    break
                }
            });
        })
        .finally(function () {
            isLoading = false;
            console.log("Models parsing finished");   
        });
    const canvas = document.querySelector('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it.');
        return;
    }
    let sc = new Scene(gl, cubeVertexShader, cubeFragmentShader).start();
}
main();
