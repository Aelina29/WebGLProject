class Cube {
    constructor(color, moving, gl, size, cubePosition, pos_obj, tex_obj, pos_ind_obj, tex_ind_obj) {
        this.moving = moving;
        this.gl = gl;
        this.positions = pos_obj.map((point) => point * size);

        this.position = cubePosition;
        this.positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.positions), this.gl.STATIC_DRAW);


        this.triangles = pos_ind_obj;
        this.triangleBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.triangleBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.triangles), this.gl.STATIC_DRAW);
	
        this.numTextureCoordinates = tex_obj;
        this.numTextureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.numTextureCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.numTextureCoordinates), gl.STATIC_DRAW);
    }

    getBuffers() {
        return {
            position: this.positionBuffer,
            //color: this.colorBuffer,
            indices: this.triangleBuffer,
            raw_indices: this.triangles,
        };
    }

    setVertexes(programInfo) {
        const gl = this.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition,3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
        
        gl.bindBuffer(this.gl.ARRAY_BUFFER, this.numTextureCoordBuffer);
        gl.vertexAttribPointer(programInfo.attribLocations.numTextureCoord, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(programInfo.attribLocations.numTextureCoord);
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
//attribute vec2 aTextureCoord;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
attribute vec2 aNumTextureCoord;
varying highp vec2 vNumTextureCoord;
uniform mat4 uTextureMatrix;
void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    //vNumTextureCoord = ((uTextureMatrix) * vec4(aNumTextureCoord, 0.0 , 1.0)).xy;
    vNumTextureCoord = aNumTextureCoord;
}`

var cubeFragmentShader = `
precision highp float;
uniform sampler2D uSampler1;
uniform sampler2D uSampler2;
uniform float uAlpha;
varying highp vec2 vNumTextureCoord;
uniform lowp int uColorBlend;
uniform lowp int uTargetCube;
void main(void) {
    gl_FragColor = texture2D(uSampler1, vNumTextureCoord);
    if (uColorBlend == 1 && uTargetCube == 1) {
        gl_FragColor = vec4(gl_FragColor.rgb * vec3(1.0, 0.0, 0.0), 1.0);
    }
}`

//============================================================================================================

const ROTATION_SPEED = 0.015;
const MOVE_SPEED = 0.05;
let currentSpeedRotation = 0;
let currentSpeedX = 0;
let currentSpeedY = 0;
let currentSpeedZ = 0;

window.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft')              //<-, влево поворот
        currentSpeedRotation = -ROTATION_SPEED;
    else if (event.key === 'ArrowRight')        //->, вправо поворот
        currentSpeedRotation = ROTATION_SPEED;
    else if (event.key.toLowerCase() === 'a' || event.key.toLowerCase() === 'ф')   //A Ф, лево
        currentSpeedX = -MOVE_SPEED;
    else if (event.key.toLowerCase() === 'd' || event.key.toLowerCase() === 'в')   //D В, правл
        currentSpeedX = MOVE_SPEED;
    else if (event.key.toLowerCase() === 's' || event.key.toLowerCase() === 'ы')   //S Ы, низ
        currentSpeedY = -MOVE_SPEED;
    else if (event.key.toLowerCase() === 'w' || event.key.toLowerCase() === 'ц')   //W Ц, верх
        currentSpeedY = MOVE_SPEED;  
    else if (event.key === 'ArrowUp')   //стрелка вверх, дальше
        currentSpeedZ = -MOVE_SPEED;
    else if (event.key === 'ArrowDown')   //стрелка вниз, ближе
        currentSpeedZ = MOVE_SPEED;          
});
window.addEventListener('keyup', event => {
    if (event.key === 'ArrowLeft')              //<-, влево поворот
        currentSpeedRotation = 0;
    else if (event.key === 'ArrowRight')        //->, вправо поворот
        currentSpeedRotation = 0;
    else if (event.key.toLowerCase() === 'a' || event.key.toLowerCase() === 'ф')   //A, лево
        currentSpeedX = 0;
    else if (event.key.toLowerCase() === 'd' || event.key.toLowerCase() === 'в')   //D, правл
        currentSpeedX = 0;
    else if (event.key.toLowerCase() === 's' || event.key.toLowerCase() === 'ы')   //S, низ
        currentSpeedY = 0;
    else if (event.key.toLowerCase() === 'w' || event.key.toLowerCase() === 'ц')   //W, верх
        currentSpeedY = 0;  
    else if (event.key === 'ArrowUp')   //стрелка вверх, дальше
        currentSpeedZ = 0;
    else if (event.key === 'ArrowDown')   //стрелка вниз, ближе
        currentSpeedZ = 0;  
});

const rotateEachCube = (obj, Matrix, rad) => obj.rotate(Matrix, rad, [0, 1, 0]);

//============================================================================================================

class Scene {
    constructor(webgl_context, vertex_shader, fragment_shader) {
        this.gl = webgl_context;
        const shaderProgram = this.initShadersProgram(vertex_shader, fragment_shader);
        this.programInfo = {
            program: shaderProgram,
            attribLocations: {
                vertexPosition: this.gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
                numTextureCoord: this.gl.getAttribLocation(shaderProgram, 'aNumTextureCoord'),
            },
            uniformLocations: {
                projectionMatrix: this.gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
                modelViewMatrix: this.gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
                sampler1: this.gl.getUniformLocation(shaderProgram, 'uSampler1'),
                sampler2: this.gl.getUniformLocation(shaderProgram, 'uSampler2'),    
                textureMatrix: this.gl.getUniformLocation(shaderProgram, 'uTextureMatrix'),
                alpha: this.gl.getUniformLocation(shaderProgram, 'uAlpha'),                
                colorBlend: this.gl.getUniformLocation(shaderProgram, 'uColorBlend'),
                TargetCube: this.gl.getUniformLocation(shaderProgram, 'uTargetCube'),
            }
        }
        this.objects = [];
        this.fieldOfView = 45 * Math.PI / 180;
        this.aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
        this.zNear = 0.1;
        this.zFar = 100.0;
    }

    start() {
        const textureMark42 = loadTexture(this.gl, imageMark42.src);
        const textureBrusch = loadTexture(this.gl, imageBrusch.src);
        const textureKatarina = loadTexture(this.gl, imageKatarina.src);
        const textureCatOrange = loadTexture(this.gl, imageCatOrange.src);
        const textureGradient = loadTexture(this.gl, imageGradient.src);
        const render = () => {
            this.drawScene( [textureBrusch, textureBrusch, textureBrusch, textureBrusch,textureBrusch, textureBrusch, textureBrusch, textureBrusch,textureBrusch, textureBrusch, textureBrusch, textureBrusch, textureMark42, textureKatarina, textureCatOrange]);
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
        //
        const sqCentr  =[0, -7, -15];
        if(isLoading)// && isLoadingAlienAnimal && isLoadingCapShield)
        {
            console.log("Loading models from obj");
            this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
        }
        else
        {
            this.objects = [
                new Cube([1.0, 1.0, 1.0, 1], false, this.gl, 3, [sqCentr[0]+3, sqCentr[1], sqCentr[2]+3],SquarePositions,SquareTextureCoordinates,SquareTriangles, SquareTriangles),
                new Cube([1.0, 1.0, 1.0, 1], false, this.gl, 3, [sqCentr[0]-3, sqCentr[1], sqCentr[2]+3],SquarePositions,SquareTextureCoordinates,SquareTriangles, SquareTriangles),
                new Cube([1.0, 1.0, 1.0, 1], false, this.gl, 3, [sqCentr[0]+3, sqCentr[1], sqCentr[2]-3],SquarePositions,SquareTextureCoordinates,SquareTriangles, SquareTriangles),
                new Cube([1.0, 1.0, 1.0, 1], false, this.gl, 3, [sqCentr[0]-3, sqCentr[1], sqCentr[2]-3],SquarePositions,SquareTextureCoordinates,SquareTriangles, SquareTriangles),

                new Cube([1.0, 1.0, 1.0, 1], false, this.gl, 3, [sqCentr[0]+9, sqCentr[1], sqCentr[2]+3],SquarePositions,SquareTextureCoordinates,SquareTriangles, SquareTriangles),
                new Cube([1.0, 1.0, 1.0, 1], false, this.gl, 3, [sqCentr[0]-9, sqCentr[1], sqCentr[2]+3],SquarePositions,SquareTextureCoordinates,SquareTriangles, SquareTriangles),
                new Cube([1.0, 1.0, 1.0, 1], false, this.gl, 3, [sqCentr[0]+9, sqCentr[1], sqCentr[2]-3],SquarePositions,SquareTextureCoordinates,SquareTriangles, SquareTriangles),
                new Cube([1.0, 1.0, 1.0, 1], false, this.gl, 3, [sqCentr[0]-9, sqCentr[1], sqCentr[2]-3],SquarePositions,SquareTextureCoordinates,SquareTriangles, SquareTriangles),

                new Cube([1.0, 1.0, 1.0, 1], false, this.gl, 3, [sqCentr[0]+15, sqCentr[1], sqCentr[2]+3],SquarePositions,SquareTextureCoordinates,SquareTriangles, SquareTriangles),
                new Cube([1.0, 1.0, 1.0, 1], false, this.gl, 3, [sqCentr[0]-15, sqCentr[1], sqCentr[2]+3],SquarePositions,SquareTextureCoordinates,SquareTriangles, SquareTriangles),
                new Cube([1.0, 1.0, 1.0, 1], false, this.gl, 3, [sqCentr[0]+15, sqCentr[1], sqCentr[2]-3],SquarePositions,SquareTextureCoordinates,SquareTriangles, SquareTriangles),
                new Cube([1.0, 1.0, 1.0, 1], false, this.gl, 3, [sqCentr[0]-15, sqCentr[1], sqCentr[2]-3],SquarePositions,SquareTextureCoordinates,SquareTriangles, SquareTriangles),
                
                new Cube([1.0, 1.0, 1.0, 1], true, this.gl, 2, curPositionCenterMark42, pos,tex,pos_ind, tex_ind),//true
                new Cube([1.0, 1.0, 1.0, 1], false, this.gl, 0.6, curPositionCenterKatarina, posCapShield, texCapShield, pos_indCapShield, tex_indCapShield),
                new Cube([1.0, 0.0, 0.0, 1], false, this.gl, scaleAlienAnimal, curPositionCenterAlienAnimal, posAlienAnimal, texAlienAnimal, pos_indAlienAnimal, tex_indAlienAnimal),

            ]; 
            this.objects.forEach(obj => {
                const textureMatrix = mat4.create();
                // совмещаем координаты
                mat4.translate(textureMatrix, textureMatrix, [0.5, 0.5, 0.0]);
                mat4.rotate(textureMatrix, textureMatrix, 0, [0, 0, 1.0]);
                mat4.translate(textureMatrix, textureMatrix, [-0.5, -0.5, 0.0]);
    
                var modelViewMatrix = mat4.create();
                
                //движение
                if(obj.moving){
                    if(curPositionCenterMark42[1]<=-3.95 && currentSpeedY<0) currentSpeedY = 0;
                    curPositionCenterMark42 = [curPositionCenterMark42[0]+currentSpeedX, curPositionCenterMark42[1]+currentSpeedY, curPositionCenterMark42[2]+currentSpeedZ];
                    obj.position = curPositionCenterMark42;
                    //console.log(obj.position);
                }
                obj.toPosition(modelViewMatrix);
                if(obj.moving){
                    rotateEachCube(obj, modelViewMatrix, curRotation);
                }
                

       
                obj.setVertexes(this.programInfo);
    
                // Указываем WebGL, что мы используем текстурный регистр 1
                this.gl.activeTexture(this.gl.TEXTURE1);
                // Связываем текстуру с регистром
                this.gl.bindTexture(this.gl.TEXTURE_2D, textures[4]);
                this.gl.activeTexture(this.gl.TEXTURE0);
                this.gl.bindTexture(this.gl.TEXTURE_2D, textures[i]);
    
                const buffers = obj.getBuffers();
                this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
                if(i == this.objects.length-2)
                    TargetCube = 1;
                else
                    TargetCube = 0;

                this.gl.useProgram(this.programInfo.program);

                this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
                this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);
                this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.textureMatrix, false, textureMatrix);
                this.gl.drawElements(this.gl.TRIANGLES, buffers.raw_indices.length, this.gl.UNSIGNED_SHORT, 0);
                this.gl.uniform1i(this.programInfo.uniformLocations.sampler1, 0);
                this.gl.uniform1i(this.programInfo.uniformLocations.sampler2, 1);
                this.gl.uniform1f(this.programInfo.uniformLocations.alpha, alpha);
                this.gl.uniform1i(this.programInfo.uniformLocations.colorBlend, colorBlend);
                this.gl.uniform1i(this.programInfo.uniformLocations.TargetCube, TargetCube);                
                
                i++;
            });
            curRotation += currentSpeedRotation;
            check_intersection();
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
curRotation = 0.0;
curPositionCenterMark42 = [0, -3.95, -13];
curPositionCenterKatarina = [-5, -3.95, -13];
curPositionCenterAlienAnimal = [5, -3.95, -13];
scaleAlienAnimal  = 0.25;
intersection = 0;
let colorBlend = 0;
let TargetCube = 0;
function check_intersection()
{
    let distance = Math.sqrt(Math.pow(curPositionCenterAlienAnimal[0]-curPositionCenterMark42[0],2)+Math.pow(curPositionCenterAlienAnimal[1]-curPositionCenterMark42[1],2)+Math.pow(curPositionCenterAlienAnimal[2]-curPositionCenterMark42[2],2));
    //console.log(distance);
    let del = 0.1;
    if(distance <= 3.75)//2.9410882339705524) 4.589662296945164
    {
        //alert("intersection");
        //intersection++;
        //console.log(intersection);
        colorBlend = 1;
    }        
    else
    {
        colorBlend = 0;
    }
}

//=========================================================================================================================

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

const imageMark42 = document.getElementById("texMark42");
const imageBrusch = document.getElementById("texBrusch");
const imageKatarina = document.getElementById("texKatarina");
const imageCatOrange = document.getElementById("texCatOrange");
const imageGradient = document.getElementById("texGradient");

//Square=================================================================================================================================
SquarePositions = [
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
    1.0,  1.0,  1.0,
    1.0,  1.0, -1.0,
];
SquareTextureCoordinates = [
    0.0, 1.0,
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
];        
SquareTriangles = [0,1,2, 0,2,3,];

//Mark42=================================================================================================================================
let isLoading = true;
let pos = [];
let tex = [];
let norm = [];
let pos_ind = [];
let tex_ind = [];
let norm_ind = [];

//CapShield=================================================================================================================================
let isLoadingCapShield = true;
let posCapShield = [];
let texCapShield = [];
let normCapShield = [];
let pos_indCapShield = [];
let tex_indCapShield = [];
let norm_indCapShield = [];

//AlienAnimal=================================================================================================================================
let isLoadingAlienAnimal = true;
let posAlienAnimal = [];
let texAlienAnimal = [];
let normAlienAnimal = [];
let pos_indAlienAnimal= [];
let tex_indAlienAnimal = [];
let norm_indAlienAnimal = [];

function main() {//ПОЧИСТИ OBJ ОТ ДВОЙНЫХ ПРОБЕЛОВ!!
    fetch('./obj_models/Mark42.obj')
        .then(response => response.text())
        .then(data => {
            //console.log(data);
            const lines = data.split('\n').join('\r').split('\r');
            let splitLine = [];
            lines.forEach(function(line) {
                //console.log(line);
                splitLine = line.split(' ');
                switch(splitLine[0]) {                    
                case 'vn':
                    norm.push(parseFloat(splitLine[1]));
                    norm.push(parseFloat(splitLine[2]));
                    norm.push(parseFloat(splitLine[3]));
                    break
                case 'vt':
                    tex.push(parseFloat(splitLine[1]));
                    tex.push(parseFloat(splitLine[2]));
                    break
                case 'v':
                    pos.push(parseFloat(splitLine[1]));
                    pos.push(parseFloat(splitLine[2]));
                    pos.push(parseFloat(splitLine[3]));
                    break
                case 'f':
                    pos_ind.push(parseFloat(splitLine[1].split("/")[0])-1, parseFloat(splitLine[2].split("/")[0])-1, parseFloat(splitLine[3].split("/")[0]-1));
                    tex_ind.push(parseFloat(splitLine[1].split("/")[1])-1, parseFloat(splitLine[2].split("/")[1])-1, parseFloat(splitLine[3].split("/")[2]-1));
                    norm_ind.push(parseFloat(splitLine[1].split("/")[2])-1, parseFloat(splitLine[2].split("/")[2])-1, parseFloat(splitLine[3].split("/")[2]-1));
                    break
                default:
                    break
                }
            });
        })
        .finally(function () {
            isLoading = false;
            console.log("Model Mark42 parsing finished");   
        });
    fetch('./obj_models/Katarina.obj') //Mjolnir //CapShield
        .then(response => response.text())
        .then(data => {
            //console.log(data);
            const lines = data.split('\n').join('\r').split('\r');
            let splitLine = [];
            lines.forEach(function(line) {
                //console.log(line);
                splitLine = line.split(' ');
                switch(splitLine[0]) {                    
                    case 'vn':
                        normCapShield.push(parseFloat(splitLine[1]));
                        normCapShield.push(parseFloat(splitLine[2]));
                        normCapShield.push(parseFloat(splitLine[3]));//их нет(
                        break
                    case 'vt':
                        texCapShield.push(parseFloat(splitLine[1]));
                        texCapShield.push(parseFloat(splitLine[2]));
                        break
                    case 'v':
                        posCapShield.push(parseFloat(splitLine[1]));
                        posCapShield.push(parseFloat(splitLine[2]));
                        posCapShield.push(parseFloat(splitLine[3]));
                        break
                    case 'f':
                        pos_indCapShield.push(parseFloat(splitLine[1].split("/")[0])-1, parseFloat(splitLine[2].split("/")[0])-1, parseFloat(splitLine[3].split("/")[0]-1));
                        tex_indCapShield.push(parseFloat(splitLine[1].split("/")[1])-1, parseFloat(splitLine[2].split("/")[1])-1, parseFloat(splitLine[3].split("/")[2]-1));
                        norm_indCapShield.push(parseFloat(splitLine[1].split("/")[2])-1, parseFloat(splitLine[2].split("/")[2])-1, parseFloat(splitLine[3].split("/")[2]-1));
                        break
                    default:
                        break
                    }
            });
        })
        .finally(function () {
            isLoadingCapShield = false;
            console.log("Model CapShield parsing finished");   
        });
    fetch('./obj_models/AlienAnimal.obj')
        .then(response => response.text())
        .then(data => {
            //console.log(data);
            const lines = data.split('\n').join('\r').split('\r');
            let splitLine = [];
            lines.forEach(function(line) {
                //console.log(line);
                splitLine = line.split(' ');
                switch(splitLine[0]) {                    
                    case 'vn':
                        normAlienAnimal.push(parseFloat(splitLine[1]));
                        normAlienAnimal.push(parseFloat(splitLine[2]));
                        normAlienAnimal.push(parseFloat(splitLine[3]));//их нет(
                        break
                    case 'vt':
                        texAlienAnimal.push(parseFloat(splitLine[1]));
                        texAlienAnimal.push(parseFloat(splitLine[2]));
                        break
                    case 'v':
                        posAlienAnimal.push(parseFloat(splitLine[1]));
                        posAlienAnimal.push(parseFloat(splitLine[2]));
                        posAlienAnimal.push(parseFloat(splitLine[3]));
                        break
                    case 'f':
                        pos_indAlienAnimal.push(parseFloat(splitLine[1].split("/")[0])-1, parseFloat(splitLine[2].split("/")[0])-1, parseFloat(splitLine[3].split("/")[0]-1));
                        tex_indAlienAnimal.push(parseFloat(splitLine[1].split("/")[1])-1, parseFloat(splitLine[2].split("/")[1])-1, parseFloat(splitLine[3].split("/")[2]-1));
                        norm_indAlienAnimal.push(parseFloat(splitLine[1].split("/")[2])-1, parseFloat(splitLine[2].split("/")[2])-1, parseFloat(splitLine[3].split("/")[2]-1));
                        break
                    default:
                        break
                    }
            });
        })
        .finally(function () {
            isLoadingAlienAnimal = false;
            console.log("Model AlienAnimal parsing finished");   
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
