class Object {
    constructor(moving, gl, scale, center, pos, tex, norm, pos_ind, tex_ind, norm_ind) {
        this.moving = moving;
        this.gl = gl;
        pos = pos.map((point) => point * scale);
        this.center = center;
        this.full = [];  //по блокам

        for(let i=0; i < pos_ind.length; i++)
        {
            this.full.push(pos[pos_ind[i]*3]);
            this.full.push(pos[pos_ind[i]*3+1]);
            this.full.push(pos[pos_ind[i]*3+2]);
        }
        //console.log(this.full.length);//14946
        for(let i=0; i < tex_ind.length; i++)
        {
            this.full.push(tex[tex_ind[i]*2]);
            this.full.push(tex[tex_ind[i]*2+1]);
        }
        for(let i=0; i < norm_ind.length; i++)
        {
            this.full.push(norm[norm_ind[i]*3]);
            this.full.push(norm[norm_ind[i]*3+1]);
            this.full.push(norm[norm_ind[i]*3+2]);
        }

        // создание буфера вершин
        this.fullBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.fullBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.full), gl.STATIC_DRAW);
        
        this.full_vertex_count = pos_ind.length;
        //console.log(this.full_vertex_count);//14946
        this.full_texture_count = tex_ind.length;
    }

    getBuffers() {
        return {
            full: this.fullBuffer,
            full_vertex_count: this.full_vertex_count,
        };
    }

    setVertexes(programInfo) {
        const gl = this.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.fullBuffer);
        
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
        gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
        
        gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
        gl.vertexAttribPointer(programInfo.attribLocations.textureCoord, 2, gl.FLOAT, false, 0, this.full_vertex_count*3 * Float32Array.BYTES_PER_ELEMENT);
        
        gl.enableVertexAttribArray(programInfo.attribLocations.normal);
        gl.vertexAttribPointer(programInfo.attribLocations.normal, 3, gl.FLOAT, false, 0, (this.full_vertex_count*3+this.full_texture_count*2) * Float32Array.BYTES_PER_ELEMENT);
    }

    toPosition(Matrix) {
        this.translate(Matrix, this.center);
    }

    translate(Matrix, translation) {
        return mat4.translate(Matrix, Matrix, translation);
    }

    rotate(Matrix, rad, axis) {
        return mat4.rotate(Matrix, Matrix, rad, axis);
    }

    rotateAround(Matrix, rad, point) {
        const translation = this.center.map((p, i) => p - point[i]);
        this.translate(Matrix, translation.map(p => -p));
        this.rotate(Matrix, rad, [0, 1, 0]);
        this.translate(Matrix, translation);
        return Matrix;
    }
}

//============================================================================================================
const shaderFunctions = `
float lambert(vec3 normal, vec3 lightPosition, float power) {
    return max(dot(normal, normalize(lightPosition)), 0.0) * power;
}`

var cubeVertexShader = `
attribute vec4 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
varying highp vec2 vTextureCoord;
varying highp vec3 vNormal;
varying vec4 vPosition;
${shaderFunctions}
void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vTextureCoord = aTextureCoord;
    vNormal = aNormal;
    vPosition = aVertexPosition;
}`

var cubeFragmentShader = `
precision highp float;
uniform sampler2D uSampler;
varying highp vec2 vTextureCoord;
varying highp vec3 vNormal;
varying vec4 vPosition;

uniform lowp int uColorBlend;
uniform lowp int uTargetCube;
uniform mat4 uModelViewMatrix;
uniform vec3 uLightDirection;
//uniform vec3 uViewPosition;

${shaderFunctions}
void main(void) {
    gl_FragColor = texture2D(uSampler, vTextureCoord);

    vec3 positionEye3 = vec3(uModelViewMatrix * vPosition);
    vec3 lightDirection = normalize(uLightDirection - positionEye3);
    float light = lambert(vNormal, lightDirection, 1.0); //light power

    if (uColorBlend == 1 && uTargetCube == 1) {
        gl_FragColor = vec4(gl_FragColor.rgb * vec3(1.0, 0.0, 0.0), 1.0);
    }
    gl_FragColor.rgb *= light;
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
                textureCoord: this.gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
                normal: this.gl.getAttribLocation(shaderProgram, 'aNormal'),
            },
            uniformLocations: {
                projectionMatrix: this.gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
                modelViewMatrix: this.gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
                sampler: this.gl.getUniformLocation(shaderProgram, 'uSampler'),
                colorBlend: this.gl.getUniformLocation(shaderProgram, 'uColorBlend'),
                TargetCube: this.gl.getUniformLocation(shaderProgram, 'uTargetCube'),
                
                viewPosition: this.gl.getUniformLocation(shaderProgram, 'uViewPosition'),
                lightDirection: this.gl.getUniformLocation(shaderProgram, 'uLightDirection'),
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
            this.drawScene([textureMark42, textureKatarina, textureCatOrange, textureBrusch,textureBrusch,textureBrusch,textureBrusch, textureBrusch,textureBrusch,textureBrusch,textureBrusch, textureBrusch,textureBrusch,textureBrusch,textureBrusch]);
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
        const sqCentr  =[0, -7, -15];
        var i = 0;
        if(isLoading)
        {
            console.log("Loading models from obj");
            this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
        }
        else
        {
            this.objects = [ //constructor(moving, gl, scale, center, pos, tex, norm, pos_ind, tex_ind, norm_ind)
                new Object(true, this.gl, 2, curPositionCenterMark42, pos, tex, norm, pos_ind, tex_ind, norm_ind), //true
                new Object(false, this.gl, 0.6, curPositionCenterKatarina, posKatarina, texKatarina, normKatarina, pos_indKatarina, tex_indKatarina, norm_indKatarina),
                new Object(false, this.gl, 0.25, curPositionCenterAlienAnimal, posAlienAnimal, texAlienAnimal, normAlienAnimal, pos_indAlienAnimal, tex_indAlienAnimal, norm_indAlienAnimal),
    
                new Object(false, this.gl, 3, [sqCentr[0]+3, sqCentr[1], sqCentr[2]+3],SquarePositions,SquareTextureCoordinates,SquareNormals,SquareTriangles, SquareTriangles,SquareTriangles),
                new Object(false, this.gl, 3, [sqCentr[0]-3, sqCentr[1], sqCentr[2]+3],SquarePositions,SquareTextureCoordinates,SquareNormals,SquareTriangles, SquareTriangles,SquareTriangles),
                new Object(false, this.gl, 3, [sqCentr[0]+3, sqCentr[1], sqCentr[2]-3],SquarePositions,SquareTextureCoordinates,SquareNormals,SquareTriangles, SquareTriangles,SquareTriangles),
                new Object(false, this.gl, 3, [sqCentr[0]-3, sqCentr[1], sqCentr[2]-3],SquarePositions,SquareTextureCoordinates,SquareNormals,SquareTriangles, SquareTriangles,SquareTriangles),

                new Object(false, this.gl, 3, [sqCentr[0]+9, sqCentr[1], sqCentr[2]+3],SquarePositions,SquareTextureCoordinates,SquareNormals,SquareTriangles, SquareTriangles,SquareTriangles),
                new Object(false, this.gl, 3, [sqCentr[0]-9, sqCentr[1], sqCentr[2]+3],SquarePositions,SquareTextureCoordinates,SquareNormals,SquareTriangles, SquareTriangles,SquareTriangles),
                new Object(false, this.gl, 3, [sqCentr[0]+9, sqCentr[1], sqCentr[2]-3],SquarePositions,SquareTextureCoordinates,SquareNormals,SquareTriangles, SquareTriangles,SquareTriangles),
                new Object(false, this.gl, 3, [sqCentr[0]-9, sqCentr[1], sqCentr[2]-3],SquarePositions,SquareTextureCoordinates,SquareNormals,SquareTriangles, SquareTriangles,SquareTriangles),

                new Object(false, this.gl, 3, [sqCentr[0]+15, sqCentr[1], sqCentr[2]+3],SquarePositions,SquareTextureCoordinates,SquareNormals,SquareTriangles, SquareTriangles,SquareTriangles),
                new Object(false, this.gl, 3, [sqCentr[0]-15, sqCentr[1], sqCentr[2]+3],SquarePositions,SquareTextureCoordinates,SquareNormals,SquareTriangles, SquareTriangles,SquareTriangles),
                new Object(false, this.gl, 3, [sqCentr[0]+15, sqCentr[1], sqCentr[2]-3],SquarePositions,SquareTextureCoordinates,SquareNormals,SquareTriangles, SquareTriangles,SquareTriangles),
                new Object(false, this.gl, 3, [sqCentr[0]-15, sqCentr[1], sqCentr[2]-3],SquarePositions,SquareTextureCoordinates,SquareNormals,SquareTriangles, SquareTriangles,SquareTriangles),
            ];
            this.objects.forEach(obj => {
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
                this.gl.activeTexture(this.gl.TEXTURE0);
                // Связываем текстуру с регистром
                this.gl.bindTexture(this.gl.TEXTURE_2D, textures[i]);
    
                const buffers = obj.getBuffers();
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers.full);
                if(i == 1)
                    TargetCube = 1;
                else
                    TargetCube = 0;

                this.gl.useProgram(this.programInfo.program);

                this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
                this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);
                this.gl.drawArrays(this.gl.TRIANGLES, 0, buffers.full_vertex_count);
                this.gl.uniform1i(this.programInfo.uniformLocations.sampler, 0);
                this.gl.uniform1i(this.programInfo.uniformLocations.colorBlend, colorBlend);
                this.gl.uniform1i(this.programInfo.uniformLocations.TargetCube, TargetCube);                
                
                this.gl.uniform3fv(this.programInfo.uniformLocations.lightDirection, lightDirection);
                this.gl.uniform3fv(this.programInfo.uniformLocations.viewPosition, viewPosition);

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
viewPosition = [0.0, 0.0, 10.0];
lightDirection = [0.0, 10.0, 0.0];
curPositionCenterMark42 = [0, -3.95, -13];
curPositionCenterKatarina = [-5, -3.95, -13];
curPositionCenterAlienAnimal = [5, -3.95, -13];
colorBlend = 0;
TargetCube = 0;
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
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        }
    };
    image.crossOrigin = "anonymous"
    image.src = url;
    return texture;
}

const imageMark42 = document.getElementById("texMark42");
const imageBrusch = document.getElementById("texBrusch");
const imageKatarina = document.getElementById("texKatarina");
const imageCatOrange = document.getElementById("texCatOrange");
// const imageMemCat = document.getElementById("texMemCat");
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
SquareNormals = [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0];
SquareTriangles = [0,1,2, 0,2,3];
        

//Mark42=================================================================================================================================
let isLoading = true;
let pos = [];
let tex = [];
let norm = [];
let pos_ind = [];
let tex_ind = [];
let norm_ind = [];

//Katarina=================================================================================================================================
let isLoadingKatarina = true;
let posKatarina = [];
let texKatarina = [];
let normKatarina = [];
let pos_indKatarina = [];
let tex_indKatarina = [];
let norm_indKatarina = [];

//AlienAnimal=================================================================================================================================
let isLoadingAlienAnimal = true;
let posAlienAnimal = [];
let texAlienAnimal = [];
let normAlienAnimal = [];
let pos_indAlienAnimal= [];
let tex_indAlienAnimal = [];
let norm_indAlienAnimal = [];

function main() {//ПОЧИСТИ OBJ ОТ ДВОЙНЫХ ПРОБЕЛОВ!!
    fetch('./obj_models/Mark42.obj') //Mark42 cube
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
                    pos_ind.push(parseFloat(splitLine[1].split("/")[0])-1);
                    pos_ind.push(parseFloat(splitLine[2].split("/")[0])-1);
                    pos_ind.push(parseFloat(splitLine[3].split("/")[0])-1);

                    tex_ind.push(parseFloat(splitLine[1].split("/")[1])-1);
                    tex_ind.push(parseFloat(splitLine[2].split("/")[1])-1);
                    tex_ind.push(parseFloat(splitLine[3].split("/")[1])-1);

                    norm_ind.push(parseFloat(splitLine[1].split("/")[2])-1);
                    norm_ind.push(parseFloat(splitLine[2].split("/")[2])-1);
                    norm_ind.push(parseFloat(splitLine[3].split("/")[2])-1);
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
    fetch('./obj_models/Katarina.obj')
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
                        normKatarina.push(parseFloat(splitLine[1]));
                        normKatarina.push(parseFloat(splitLine[2]));
                        normKatarina.push(parseFloat(splitLine[3]));//их нет(
                        break
                    case 'vt':
                        texKatarina.push(parseFloat(splitLine[1]));
                        texKatarina.push(parseFloat(splitLine[2]));
                        break
                    case 'v':
                        posKatarina.push(parseFloat(splitLine[1]));
                        posKatarina.push(parseFloat(splitLine[2]));
                        posKatarina.push(parseFloat(splitLine[3]));
                        break
                    case 'f':
                        pos_indKatarina.push(parseFloat(splitLine[1].split("/")[0])-1);
                        pos_indKatarina.push(parseFloat(splitLine[2].split("/")[0])-1);
                        pos_indKatarina.push(parseFloat(splitLine[3].split("/")[0])-1);

                        tex_indKatarina.push(parseFloat(splitLine[1].split("/")[1])-1);
                        tex_indKatarina.push(parseFloat(splitLine[2].split("/")[1])-1);
                        tex_indKatarina.push(parseFloat(splitLine[3].split("/")[1])-1);

                        norm_indKatarina.push(parseFloat(splitLine[1].split("/")[2])-1);
                        norm_indKatarina.push(parseFloat(splitLine[2].split("/")[2])-1);
                        norm_indKatarina.push(parseFloat(splitLine[3].split("/")[2])-1);

                        break
                    default:
                        break
                    }
            });
        })
        .finally(function () {
            isLoadingKatarina = false;
            console.log("Model Katarina parsing finished");   
        });
    fetch('./obj_models/AlienAnimal.obj') //AlienAnimal Cat
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
                        pos_indAlienAnimal.push(parseFloat(splitLine[1].split("/")[0])-1);
                        pos_indAlienAnimal.push(parseFloat(splitLine[2].split("/")[0])-1);
                        pos_indAlienAnimal.push(parseFloat(splitLine[3].split("/")[0])-1);

                        tex_indAlienAnimal.push(parseFloat(splitLine[1].split("/")[1])-1);
                        tex_indAlienAnimal.push(parseFloat(splitLine[2].split("/")[1])-1);
                        tex_indAlienAnimal.push(parseFloat(splitLine[3].split("/")[1])-1);

                        norm_indAlienAnimal.push(parseFloat(splitLine[1].split("/")[2])-1);
                        norm_indAlienAnimal.push(parseFloat(splitLine[2].split("/")[2])-1);
                        norm_indAlienAnimal.push(parseFloat(splitLine[3].split("/")[2])-1);
                        
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
