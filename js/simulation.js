class Simulation {
    constructor() {
        this.particles = [];
        this.canvas = document.getElementById('simulationCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        this.initParticles();
        this.isPaused = false;
        this.mouseX = 0;
        this.mouseY = 0;

        window.addEventListener('resize', () => this.resizeCanvas());
        window.addEventListener('mousemove', (e) => this.updateMousePosition(e));
        window.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        CONFIG.canvasWidth = this.canvas.width;
        CONFIG.canvasHeight = this.canvas.height;
    }

    updateMousePosition(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
    }

    handleKeyPress(e) {
        if (e.code === 'Space') {
            this.isPaused = !this.isPaused;
        } else if (e.key >= '1' && e.key <= '9') {
            const type = parseInt(e.key) - 1;
            if (type < CONFIG.particleTypes) {
                this.spawnParticle(this.mouseX, this.mouseY, type);
            }
        }
    }

    spawnParticle(x, y, type) {
        this.particles.push(new Particle(x, y, type));
    }

    initParticles() {
        for (let i = 0; i < CONFIG.particleCount; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const type = Math.floor(Math.random() * CONFIG.particleTypes);
            this.particles.push(new Particle(x, y, type));
        }
    }

    update() {
        if (this.isPaused) return;

        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                this.interact(this.particles[i], this.particles[j]);
            }
        }

        this.particles = this.particles.filter(p => p.isAlive);

        for (const particle of this.particles) {
            particle.update();
            if (Math.random() < 0.005) {
                particle.castMagic(this.particles);
            }
        }
    }

    interact(p1, p2) {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < CONFIG.interactionRadius) {
            const force = CONFIG.attractionMatrix[p1.type][p2.type] * CONFIG.maxForce;
            const fx = (dx / distance) * force;
            const fy = (dy / distance) * force;
            p1.applyForce(fx, fy);
            p2.applyForce(-fx, -fy);
        }
    }

    splitParticle(particle) {
        if (Math.random() < 0.001) {
            const newParticle = new Particle(particle.x, particle.y, particle.type);
            this.particles.push(newParticle);
            if (this.particles.length > CONFIG.particleCount * 1.5) {
                this.particles.splice(0, 1);
            }
        }
    }

    draw() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        for (const particle of this.particles) {
            if (!isFinite(particle.x) || !isFinite(particle.y)) continue;

            if (particle.blackHoleRadius > 0) {
                Effects.blackHole(this.ctx, particle);
            }

            if (!particle.shieldActive) {
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                this.ctx.fillStyle = ['red', 'green', 'blue', 'yellow', 'purple', 'cyan', 'magenta', 'orange'][particle.type];
                this.ctx.fill();
            }

            if (particle.shieldActive) {
                Effects.shield(this.ctx, particle);
            }

            if (particle.pentagramProgress > 0) {
                Effects.pentagram(this.ctx, particle, particle.pentagramProgress);
            }

            if (particle.type === 1) {
                Effects.trail(this.ctx, particle);
            }
            if (particle.type === 6) {
                Effects.blackHole(this.ctx, particle);
            }

            if (particle.type === 3) {
                Effects.glow(this.ctx, particle);
            }
            if (particle.magicCooldown > 0) {
                Effects.magicAura(this.ctx, particle);
            }

            if (particle.lightningTarget) {
                Effects.lightning(this.ctx, particle, particle.lightningTarget);
                particle.lightningTarget = null;
            }

            // Draw health bar
            const healthBarWidth = 20;
            const healthBarHeight = 3;
            this.ctx.fillStyle = 'red';
            this.ctx.fillRect(particle.x - healthBarWidth / 2, particle.y - 10, healthBarWidth, healthBarHeight);
            this.ctx.fillStyle = 'green';
            this.ctx.fillRect(particle.x - healthBarWidth / 2, particle.y - 10, healthBarWidth * (particle.health / 10), healthBarHeight);

            if (particle.type === 11) {
                Effects.supernova(this.ctx, particle);
            }
            if (particle.type === 12) {
                Effects.timeWarp(this.ctx, particle);
            }
            if (particle.type === 13) {
                Effects.quantumEntanglement(this.ctx, particle);
            }

            if (particle.type === 14 && particle.atomActive) {
                Effects.atom(this.ctx, particle);
            }
        }
    }
}