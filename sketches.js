// 首页英雄区域动画
function heroSketch(p) {
    let particles = [];
    let mouseX = 0;
    let mouseY = 0;
    
    p.setup = function() {
        const canvas = p.createCanvas(400, 400);
        canvas.parent('hero-sketch');
        p.colorMode(p.HSB, 360, 100, 100, 1);
        
        // 初始化粒子
        for (let i = 0; i < 50; i++) {
            particles.push(new Particle());
        }
    };
    
    p.draw = function() {
        p.background(0, 0, 0, 0.1);
        
        // 更新鼠标位置
        mouseX = p.mouseX;
        mouseY = p.mouseY;
        
        // 更新和绘制粒子
        for (let particle of particles) {
            particle.update();
            particle.display();
        }
    };
    
    p.mouseMoved = function() {
        // 添加新的粒子
        if (particles.length < 100) {
            particles.push(new Particle(p.mouseX, p.mouseY));
        }
    };
    
    class Particle {
        constructor(x, y) {
            this.x = x || p.random(p.width);
            this.y = y || p.random(p.height);
            this.vx = p.random(-2, 2);
            this.vy = p.random(-2, 2);
            this.size = p.random(2, 8);
            this.hue = p.random(360);
            this.life = 255;
            this.maxLife = 255;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            // 边界检测
            if (this.x < 0 || this.x > p.width) this.vx *= -1;
            if (this.y < 0 || this.y > p.height) this.vy *= -1;
            
            // 鼠标吸引
            let d = p.dist(this.x, this.y, mouseX, mouseY);
            if (d < 100) {
                let angle = p.atan2(mouseY - this.y, mouseX - this.x);
                this.vx += p.cos(angle) * 0.5;
                this.vy += p.sin(angle) * 0.5;
            }
            
            // 限制速度
            this.vx = p.constrain(this.vx, -5, 5);
            this.vy = p.constrain(this.vy, -5, 5);
            
            // 生命周期
            this.life -= 1;
        }
        
        display() {
            p.push();
            p.translate(this.x, this.y);
            p.fill(this.hue, 80, 90, this.life / this.maxLife);
            p.noStroke();
            p.ellipse(0, 0, this.size);
            p.pop();
        }
    }
}

// 作品1: 动态粒子系统
function sketch1Sketch(p) {
    let particles = [];
    let attractors = [];
    
    p.setup = function() {
        const canvas = p.createCanvas(800, 500);
        canvas.parent('current-sketch');
        p.colorMode(p.HSB, 360, 100, 100, 1);
        
        // 初始化粒子
        for (let i = 0; i < 200; i++) {
            particles.push(new Particle());
        }
        
        // 初始化吸引子
        for (let i = 0; i < 3; i++) {
            attractors.push(new Attractor());
        }
    };
    
    p.draw = function() {
        p.background(0, 0, 0, 0.1);
        
        // 更新吸引子
        for (let attractor of attractors) {
            attractor.update();
            attractor.display();
        }
        
        // 更新粒子
        for (let particle of particles) {
            // 应用吸引子力
            for (let attractor of attractors) {
                particle.applyForce(attractor.attract(particle));
            }
            
            particle.update();
            particle.display();
        }
    };
    
    p.mousePressed = function() {
        // 添加新的吸引子
        attractors.push(new Attractor(p.mouseX, p.mouseY));
        if (attractors.length > 5) {
            attractors.splice(0, 1);
        }
    };
    
    class Particle {
        constructor() {
            this.pos = p.createVector(p.random(p.width), p.random(p.height));
            this.vel = p.createVector(p.random(-2, 2), p.random(-2, 2));
            this.acc = p.createVector(0, 0);
            this.maxSpeed = 4;
            this.size = p.random(3, 8);
            this.hue = p.random(360);
        }
        
        applyForce(force) {
            this.acc.add(force);
        }
        
        update() {
            this.vel.add(this.acc);
            this.vel.limit(this.maxSpeed);
            this.pos.add(this.vel);
            this.acc.mult(0);
            
            // 边界环绕
            if (this.pos.x < 0) this.pos.x = p.width;
            if (this.pos.x > p.width) this.pos.x = 0;
            if (this.pos.y < 0) this.pos.y = p.height;
            if (this.pos.y > p.height) this.pos.y = 0;
        }
        
        display() {
            p.push();
            p.translate(this.pos.x, this.pos.y);
            p.fill(this.hue, 80, 90, 0.8);
            p.noStroke();
            p.ellipse(0, 0, this.size);
            p.pop();
        }
    }
    
    class Attractor {
        constructor(x, y) {
            this.pos = p.createVector(x || p.random(p.width), y || p.random(p.height));
            this.mass = p.random(10, 30);
            this.hue = p.random(360);
        }
        
        attract(particle) {
            let force = p5.Vector.sub(this.pos, particle.pos);
            let distance = force.mag();
            distance = p.constrain(distance, 5, 200);
            
            let strength = (0.5 * this.mass * particle.size) / (distance * distance);
            force.normalize();
            force.mult(strength);
            
            return force;
        }
        
        update() {
            // 缓慢移动
            this.pos.x += p.random(-1, 1);
            this.pos.y += p.random(-1, 1);
        }
        
        display() {
            p.push();
            p.translate(this.pos.x, this.pos.y);
            p.fill(this.hue, 60, 80, 0.3);
            p.noStroke();
            p.ellipse(0, 0, this.mass * 2);
            p.pop();
        }
    }
}

// 作品2: 分形树生成器
function sketch2Sketch(p) {
    let angle = 0;
    let angleSlider;
    
    p.setup = function() {
        const canvas = p.createCanvas(800, 500);
        canvas.parent('current-sketch');
        p.colorMode(p.HSB, 360, 100, 100, 1);
        
        angleSlider = p.createSlider(0, p.PI, p.PI / 4, 0.01);
        angleSlider.position(20, 20);
    };
    
    p.draw = function() {
        p.background(0, 0, 0, 0.1);
        p.translate(p.width / 2, p.height);
        
        angle = angleSlider.value();
        branch(120);
    };
    
    function branch(len) {
        p.stroke(p.map(len, 10, 120, 0, 360), 80, 90, 0.8);
        p.strokeWeight(p.map(len, 10, 120, 1, 8));
        p.line(0, 0, 0, -len);
        p.translate(0, -len);
        
        if (len > 4) {
            p.push();
            p.rotate(angle);
            branch(len * 0.67);
            p.pop();
            
            p.push();
            p.rotate(-angle);
            branch(len * 0.67);
            p.pop();
        }
    }
}

// 作品3: 声音可视化
function sketch3Sketch(p) {
    let fft;
    let mic;
    let spectrum = [];
    
    p.setup = function() {
        const canvas = p.createCanvas(800, 500);
        canvas.parent('current-sketch');
        p.colorMode(p.HSB, 360, 100, 100, 1);
        
        // 创建音频输入
        mic = new p5.AudioIn();
        mic.start();
        
        // 创建FFT分析器
        fft = new p5.FFT();
        fft.setInput(mic);
    };
    
    p.draw = function() {
        p.background(0, 0, 0, 0.1);
        
        // 获取频谱数据
        spectrum = fft.analyze();
        
        // 绘制频谱
        let barWidth = p.width / spectrum.length;
        for (let i = 0; i < spectrum.length; i++) {
            let barHeight = p.map(spectrum[i], 0, 255, 0, p.height);
            let hue = p.map(i, 0, spectrum.length, 0, 360);
            
            p.push();
            p.translate(i * barWidth, p.height);
            p.fill(hue, 80, 90, 0.8);
            p.noStroke();
            p.rect(0, -barHeight, barWidth - 1, barHeight);
            p.pop();
        }
        
        // 绘制波形
        p.push();
        p.translate(0, p.height / 2);
        p.stroke(0, 0, 100, 0.8);
        p.strokeWeight(2);
        p.noFill();
        p.beginShape();
        for (let i = 0; i < spectrum.length; i++) {
            let x = p.map(i, 0, spectrum.length, 0, p.width);
            let y = p.map(spectrum[i], 0, 255, -100, 100);
            p.vertex(x, y);
        }
        p.endShape();
        p.pop();
    };
    
    p.mousePressed = function() {
        // 切换音频输入
        if (mic.enabled) {
            mic.stop();
        } else {
            mic.start();
        }
    };
}

// 作品4: 神经网络可视化
function sketch4Sketch(p) {
    let neurons = [];
    let connections = [];
    let dataPoints = [];
    
    p.setup = function() {
        const canvas = p.createCanvas(800, 500);
        canvas.parent('current-sketch');
        p.colorMode(p.HSB, 360, 100, 100, 1);
        
        // 创建神经元
        for (let i = 0; i < 20; i++) {
            neurons.push(new Neuron());
        }
        
        // 创建连接
        for (let i = 0; i < neurons.length; i++) {
            for (let j = i + 1; j < neurons.length; j++) {
                if (p.random() < 0.3) {
                    connections.push(new Connection(neurons[i], neurons[j]));
                }
            }
        }
        
        // 创建数据点
        for (let i = 0; i < 50; i++) {
            dataPoints.push(new DataPoint());
        }
    };
    
    p.draw = function() {
        p.background(0, 0, 0, 0.1);
        
        // 更新和绘制数据点
        for (let point of dataPoints) {
            point.update();
            point.display();
        }
        
        // 更新和绘制连接
        for (let connection of connections) {
            connection.update();
            connection.display();
        }
        
        // 更新和绘制神经元
        for (let neuron of neurons) {
            neuron.update();
            neuron.display();
        }
    };
    
    p.mousePressed = function() {
        // 添加新的数据点
        dataPoints.push(new DataPoint(p.mouseX, p.mouseY));
    };
    
    class Neuron {
        constructor() {
            this.pos = p.createVector(p.random(p.width), p.random(p.height));
            this.vel = p.createVector(p.random(-1, 1), p.random(-1, 1));
            this.activation = 0;
            this.hue = p.random(360);
        }
        
        update() {
            this.pos.add(this.vel);
            
            // 边界检测
            if (this.pos.x < 0 || this.pos.x > p.width) this.vel.x *= -1;
            if (this.pos.y < 0 || this.pos.y > p.height) this.vel.y *= -1;
            
            // 激活值衰减
            this.activation *= 0.95;
        }
        
        display() {
            p.push();
            p.translate(this.pos.x, this.pos.y);
            p.fill(this.hue, 80, 90, 0.8 + this.activation);
            p.noStroke();
            p.ellipse(0, 0, 15 + this.activation * 10);
            p.pop();
        }
    }
    
    class Connection {
        constructor(from, to) {
            this.from = from;
            this.to = to;
            this.strength = p.random(0.1, 1);
        }
        
        update() {
            // 传递激活
            let distance = p.dist(this.from.pos.x, this.from.pos.y, this.to.pos.x, this.to.pos.y);
            if (distance < 100) {
                this.to.activation += this.strength * 0.1;
            }
        }
        
        display() {
            let distance = p.dist(this.from.pos.x, this.from.pos.y, this.to.pos.x, this.to.pos.y);
            if (distance < 100) {
                p.stroke(0, 0, 100, this.strength * 0.5);
                p.strokeWeight(this.strength * 2);
                p.line(this.from.pos.x, this.from.pos.y, this.to.pos.x, this.to.pos.y);
            }
        }
    }
    
    class DataPoint {
        constructor(x, y) {
            this.pos = p.createVector(x || p.random(p.width), y || p.random(p.height));
            this.vel = p.createVector(p.random(-2, 2), p.random(-2, 2));
            this.size = p.random(3, 8);
            this.hue = p.random(360);
        }
        
        update() {
            this.pos.add(this.vel);
            
            // 边界环绕
            if (this.pos.x < 0) this.pos.x = p.width;
            if (this.pos.x > p.width) this.pos.x = 0;
            if (this.pos.y < 0) this.pos.y = p.height;
            if (this.pos.y > p.height) this.pos.y = 0;
            
            // 激活附近的神经元
            for (let neuron of neurons) {
                let distance = p.dist(this.pos.x, this.pos.y, neuron.pos.x, neuron.pos.y);
                if (distance < 50) {
                    neuron.activation += 0.1;
                }
            }
        }
        
        display() {
            p.push();
            p.translate(this.pos.x, this.pos.y);
            p.fill(this.hue, 80, 90, 0.6);
            p.noStroke();
            p.ellipse(0, 0, this.size);
            p.pop();
        }
    }
}

// 预览sketches
function sketch1PreviewSketch(p) {
    let particles = [];
    
    p.setup = function() {
        const canvas = p.createCanvas(300, 200);
        canvas.parent('sketch1-preview');
        p.colorMode(p.HSB, 360, 100, 100, 1);
        
        for (let i = 0; i < 30; i++) {
            particles.push(new PreviewParticle());
        }
    };
    
    p.draw = function() {
        p.background(0, 0, 0, 0.1);
        
        for (let particle of particles) {
            particle.update();
            particle.display();
        }
    };
    
    class PreviewParticle {
        constructor() {
            this.x = p.random(p.width);
            this.y = p.random(p.height);
            this.vx = p.random(-1, 1);
            this.vy = p.random(-1, 1);
            this.size = p.random(2, 5);
            this.hue = p.random(360);
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > p.width) this.vx *= -1;
            if (this.y < 0 || this.y > p.height) this.vy *= -1;
        }
        
        display() {
            p.fill(this.hue, 80, 90, 0.8);
            p.noStroke();
            p.ellipse(this.x, this.y, this.size);
        }
    }
}

function sketch2PreviewSketch(p) {
    p.setup = function() {
        const canvas = p.createCanvas(300, 200);
        canvas.parent('sketch2-preview');
        p.colorMode(p.HSB, 360, 100, 100, 1);
    };
    
    p.draw = function() {
        p.background(0, 0, 0, 0.1);
        p.translate(p.width / 2, p.height);
        
        branch(60);
    };
    
    function branch(len) {
        p.stroke(p.map(len, 5, 60, 0, 360), 80, 90, 0.8);
        p.strokeWeight(p.map(len, 5, 60, 1, 4));
        p.line(0, 0, 0, -len);
        p.translate(0, -len);
        
        if (len > 3) {
            p.push();
            p.rotate(p.PI / 4);
            branch(len * 0.67);
            p.pop();
            
            p.push();
            p.rotate(-p.PI / 4);
            branch(len * 0.67);
            p.pop();
        }
    }
}

function sketch3PreviewSketch(p) {
    p.setup = function() {
        const canvas = p.createCanvas(300, 200);
        canvas.parent('sketch3-preview');
        p.colorMode(p.HSB, 360, 100, 100, 1);
    };
    
    p.draw = function() {
        p.background(0, 0, 0, 0.1);
        
        // 模拟频谱数据
        let barWidth = p.width / 20;
        for (let i = 0; i < 20; i++) {
            let barHeight = p.map(p.noise(i * 0.1, p.frameCount * 0.01), 0, 1, 5, p.height * 0.8);
            let hue = p.map(i, 0, 20, 0, 360);
            
            p.fill(hue, 80, 90, 0.8);
            p.noStroke();
            p.rect(i * barWidth, p.height - barHeight, barWidth - 1, barHeight);
        }
    };
}

function sketch4PreviewSketch(p) {
    let neurons = [];
    
    p.setup = function() {
        const canvas = p.createCanvas(300, 200);
        canvas.parent('sketch4-preview');
        p.colorMode(p.HSB, 360, 100, 100, 1);
        
        for (let i = 0; i < 8; i++) {
            neurons.push(new PreviewNeuron());
        }
    };
    
    p.draw = function() {
        p.background(0, 0, 0, 0.1);
        
        // 绘制连接
        for (let i = 0; i < neurons.length; i++) {
            for (let j = i + 1; j < neurons.length; j++) {
                let distance = p.dist(neurons[i].x, neurons[i].y, neurons[j].x, neurons[j].y);
                if (distance < 80) {
                    p.stroke(0, 0, 100, 0.3);
                    p.strokeWeight(1);
                    p.line(neurons[i].x, neurons[i].y, neurons[j].x, neurons[j].y);
                }
            }
        }
        
        // 绘制神经元
        for (let neuron of neurons) {
            neuron.update();
            neuron.display();
        }
    };
    
    class PreviewNeuron {
        constructor() {
            this.x = p.random(p.width);
            this.y = p.random(p.height);
            this.vx = p.random(-0.5, 0.5);
            this.vy = p.random(-0.5, 0.5);
            this.hue = p.random(360);
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > p.width) this.vx *= -1;
            if (this.y < 0 || this.y > p.height) this.vy *= -1;
        }
        
        display() {
            p.fill(this.hue, 80, 90, 0.8);
            p.noStroke();
            p.ellipse(this.x, this.y, 8);
        }
    }
} 