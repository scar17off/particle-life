class Particle {
    constructor(x, y, type) {
        this.setPosition(x, y);
        this.vx = 0;
        this.vy = 0;
        this.type = type;
        this.size = CONFIG.particleMinSize;
        this.age = 0;
        this.health = 10;
        this.isAlive = true;
        this.magicCooldown = 0;
        this.blackHoleRadius = 0;
        this.shieldActive = false;
        this.pentagramProgress = 0;
        this.vortexProgress = 0;
        this.chainExplosions = [];
        this.fractalPoints = [];
        this.supernovaProgress = null;
        this.supernovaInterval = null;
        this.timeWarpActive = false;
        this.entangledParticle = null;
        this.atomActive = false;
        this.atomProgress = 0;
        this.atomAngle = 0;
    }

    setPosition(x, y) {
        this.x = isFinite(x) ? x : Math.random() * CONFIG.canvasWidth;
        this.y = isFinite(y) ? y : Math.random() * CONFIG.canvasHeight;
    }

    update() {
        if (!this.isAlive) return;

        this.x += this.vx;
        this.y += this.vy;

        // Wrap around screen edges
        this.x = (this.x + CONFIG.canvasWidth) % CONFIG.canvasWidth;
        this.y = (this.y + CONFIG.canvasHeight) % CONFIG.canvasHeight;

        // Ensure position is always finite
        if (!isFinite(this.x) || !isFinite(this.y)) {
            this.setPosition();
            this.vx = this.vy = 0;
        }

        this.age++;
        this.size = Math.max(CONFIG.particleMinSize, Math.min(this.size, CONFIG.particleMaxSize));
        if (this.magicCooldown > 0) this.magicCooldown--;
    }

    applyForce(fx, fy) {
        this.vx += fx;
        this.vy += fy;
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > CONFIG.maxSpeed) {
            this.vx = (this.vx / speed) * CONFIG.maxSpeed;
            this.vy = (this.vy / speed) * CONFIG.maxSpeed;
        }
        // Ensure velocity components are finite
        if (!isFinite(this.vx) || !isFinite(this.vy)) {
            this.vx = this.vy = 0;
        }
    }

    castMagic(particles) {
        if (this.magicCooldown > 0 || !this.isAlive) return;
        this.magicCooldown = CONFIG.magicCooldown;
        switch (this.type) {
            case 0: this.fireball(particles); break;
            case 1: this.heal(particles); break;
            case 2: this.teleport(); break;
            case 3: this.shield(); break;
            case 4: this.raid(particles); break;
            case 5: this.lightning(particles); break;
            case 6: this.blackHole(particles); break;
            case 7: this.pentagram(particles); break;
            case 8: this.vortex(particles); break;
            case 9: this.timeWarp(particles); break;
            case 10: this.fractalize(particles); break;
            case 11: this.supernova(particles); break;
            case 12: this.timeWarp(particles); break;
            case 13: this.quantumEntanglement(particles); break;
            case 14: this.createAtom(particles); break;
        }
    }

    fireball(particles) {
        const range = 100;
        particles.forEach(p => {
            if (p !== this && p.isAlive && this.distanceTo(p) < range) {
                p.applyForce((p.x - this.x) * 0.1, (p.y - this.y) * 0.1);
                if (p.takeDamage) {
                    p.takeDamage(CONFIG.damageAmount);
                }
            }
        });
    }

    heal(particles) {
        const range = 50;
        particles.forEach(p => {
            if (p !== this && p.isAlive && this.distanceTo(p) < range) {
                p.health = Math.min(p.health + CONFIG.healAmount, 10);
            }
        });
    }

    teleport() {
        this.setPosition(Math.random() * CONFIG.canvasWidth, Math.random() * CONFIG.canvasHeight);
    }

    shield() {
        this.shieldActive = true;
        setTimeout(() => this.shieldActive = false, 5000);
    }

    raid(particles) {
        const range = 30;
        particles.forEach(p => {
            if (p !== this && p.isAlive && this.distanceTo(p) < range) {
                p.takeDamage(CONFIG.damageAmount * 2);
            }
        });
    }

    lightning(particles) {
        const targets = particles.filter(p => p !== this && p.isAlive && this.distanceTo(p) < 150);
        if (targets.length > 0) {
            const target = targets[Math.floor(Math.random() * targets.length)];
            if (target.takeDamage) {
                target.takeDamage(CONFIG.damageAmount * 1.5);
            }
            this.lightningTarget = target;
        }
    }

    blackHole(particles) {
        this.blackHoleRadius = 100;
        setTimeout(() => {
            particles.forEach(p => {
                if (p !== this && p.isAlive && this.distanceTo(p) < this.blackHoleRadius) {
                    p.setPosition(this.x + (Math.random() - 0.5) * 10, this.y + (Math.random() - 0.5) * 10);
                    p.vx = p.vy = 0;
                }
            });
            this.blackHoleRadius = 0;
        }, 3000);
    }

    pentagram(particles) {
        this.pentagramProgress = 0;
        const interval = setInterval(() => {
            this.pentagramProgress += 0.05;
            if (this.pentagramProgress >= 1) {
                clearInterval(interval);
                particles.forEach(p => {
                    if (p !== this && p.isAlive && this.distanceTo(p) < 100) {
                        p.takeDamage(CONFIG.damageAmount * 2);
                    }
                });
            }
        }, 50);
    }

    vortex(particles) {
        const radius = 100;
        const force = 0.1;
        particles.forEach(p => {
            if (p !== this && p.isAlive && this.distanceTo(p) < radius) {
                const angle = Math.atan2(p.y - this.y, p.x - this.x);
                p.applyForce(-Math.sin(angle) * force, Math.cos(angle) * force);
            }
        });
        this.vortexProgress = 1;
        setTimeout(() => this.vortexProgress = 0, 3000);
    }

    explosiveChain(particles) {
        this.chainExplosions = [{x: this.x, y: this.y, time: 0}];
        const explode = (x, y, depth) => {
            if (depth > 3) return;
            setTimeout(() => {
                this.chainExplosions.push({x, y, time: 0});
                particles.forEach(p => {
                    if (p !== this && p.isAlive && Math.hypot(p.x - x, p.y - y) < 50) {
                        p.takeDamage(CONFIG.damageAmount);
                        explode(p.x, p.y, depth + 1);
                    }
                });
            }, depth * 200);
        };
        explode(this.x, this.y, 0);
    }

    fractalize(particles) {
        this.fractalPoints = [{x: this.x, y: this.y}];
        const createFractal = (x, y, angle, depth) => {
            if (depth > 5) return;
            const newX = x + Math.cos(angle) * 20 / (depth + 1);
            const newY = y + Math.sin(angle) * 20 / (depth + 1);
            this.fractalPoints.push({x: newX, y: newY});
            createFractal(newX, y, angle - Math.PI / 6, depth + 1);
            createFractal(newX, y, angle + Math.PI / 6, depth + 1);
        };
        createFractal(this.x, this.y, -Math.PI / 2, 0);
        setTimeout(() => this.fractalPoints = [], 3000);
    }

    supernova(particles) {
        this.supernovaProgress = 0;
        this.supernovaInterval = setInterval(() => {
            this.supernovaProgress += 0.05;
            if (this.supernovaProgress >= 1) {
                clearInterval(this.supernovaInterval);
                particles.forEach(p => {
                    if (p !== this && p.isAlive && this.distanceTo(p) < 200) {
                        p.takeDamage(CONFIG.damageAmount * 3);
                    }
                });
                this.supernovaProgress = null;
            }
        }, 50);
    }

    timeWarp(particles) {
        this.timeWarpActive = true;
        setTimeout(() => {
            particles.forEach(p => {
                if (p !== this && p.isAlive && this.distanceTo(p) < 150) {
                    p.age -= 100;
                    if (p.age < 0) p.age = 0;
                }
            });
            this.timeWarpActive = false;
        }, 3000);
    }

    quantumEntanglement(particles) {
        const target = particles.find(p => p !== this && p.isAlive && this.distanceTo(p) < 100);
        if (target) {
            this.entangledParticle = target;
            target.entangledParticle = this;
            setTimeout(() => {
                this.entangledParticle = null;
                target.entangledParticle = null;
            }, 5000);
        }
    }

    createAtom(particles) {
        this.atomActive = true;
        this.atomProgress = 0;
        const interval = setInterval(() => {
            this.atomProgress += 0.02;
            this.atomAngle += 0.1;
            if (this.atomProgress >= 1) {
                clearInterval(interval);
                this.atomActive = false;
            }
            particles.forEach(p => {
                if (p !== this && p.isAlive && this.distanceTo(p) <= CONFIG.atomRadius) {
                    p.takeDamage(CONFIG.atomDamage);
                }
            });
        }, 50);
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.isAlive = false;
        }
    }

    distanceTo(other) {
        const dx = other.x - this.x;
        const dy = other.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}