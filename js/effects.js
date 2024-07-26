class Effects {
    static safeGradient(ctx, x, y, r1, r2, color1, color2) {
        if (!isFinite(x) || !isFinite(y) || !isFinite(r1) || !isFinite(r2)) {
            return null;
        }
        try {
            const gradient = ctx.createRadialGradient(x, y, r1, x, y, r2);
            gradient.addColorStop(0, color1);
            gradient.addColorStop(1, color2);
            return gradient;
        } catch (error) {
            console.warn('Error creating gradient:', error);
            return null;
        }
    }

    static glow(ctx, particle) {
        const gradient = this.safeGradient(
            ctx, particle.x, particle.y, 0, particle.size * 2,
            'rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0)'
        );
        if (gradient) {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
        }
    }

    static magicAura(ctx, particle) {
        const gradient = this.safeGradient(
            ctx, particle.x, particle.y, 0, particle.size * 3,
            'rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.2)'
        );
        if (gradient) {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
        }
    }

    static blackHole(ctx, particle) {
        const gradient = this.safeGradient(
            ctx, particle.x, particle.y, 0, particle.blackHoleRadius,
            'rgba(0, 0, 0, 0.8)', 'rgba(0, 0, 0, 0)'
        );
        if (gradient) {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.blackHoleRadius, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
        }
    }

    static trail(ctx, particle) {
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(particle.x - particle.vx * 5, particle.y - particle.vy * 5);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.stroke();
    }

    static lightning(ctx, source, target) {
        if (!source || !target) return;
        
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        const midX = (source.x + target.x) / 2;
        const midY = (source.y + target.y) / 2;
        const offsetX = (Math.random() - 0.5) * 30;
        const offsetY = (Math.random() - 0.5) * 30;
        ctx.quadraticCurveTo(midX + offsetX, midY + offsetY, target.x, target.y);
        ctx.strokeStyle = 'rgba(255, 255, 0, 0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    static shield(ctx, particle) {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size + 5, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    static pentagram(ctx, particle, progress) {
        const radius = 50;
        const points = 5;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2 * progress);
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
        ctx.stroke();

        if (progress >= 1) {
            ctx.beginPath();
            for (let i = 0; i < points * 2; i++) {
                const angle = (i * 4 * Math.PI) / (points * 2) - Math.PI / 2;
                const r = i % 2 === 0 ? radius : radius / 2;
                const x = particle.x + r * Math.cos(angle);
                const y = particle.y + r * Math.sin(angle);
                ctx[i === 0 ? 'moveTo' : 'lineTo'](x, y);
            }
            ctx.closePath();
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(particle.x, particle.y, radius * 1.2, 0, Math.PI * 2);
            const gradient = ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, radius * 1.2
            );
            gradient.addColorStop(0, 'rgba(255, 0, 0, 0.5)');
            gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
            ctx.fillStyle = gradient;
            ctx.fill();
        }
    }

    static supernova(ctx, particle) {
        if (particle.supernovaProgress === null || particle.supernovaProgress === undefined) return;
        const radius = particle.supernovaProgress * 200;
        const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, radius
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.3, 'rgba(255, 200, 100, 0.8)');
        gradient.addColorStop(0.7, 'rgba(255, 100, 50, 0.5)');
        gradient.addColorStop(1, 'rgba(255, 50, 0, 0)');
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
    }

    static timeWarp(ctx, particle) {
        if (!particle.timeWarpActive) return;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 150, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.setLineDash([]);

        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const x1 = particle.x + Math.cos(angle) * 140;
            const y1 = particle.y + Math.sin(angle) * 140;
            const x2 = particle.x + Math.cos(angle) * 160;
            const y2 = particle.y + Math.sin(angle) * 160;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.8)';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }

    static quantumEntanglement(ctx, particle) {
        if (!particle.entangledParticle) return;
        const target = particle.entangledParticle;
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(target.x, target.y);
        ctx.strokeStyle = 'rgba(255, 0, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);

        const midX = (particle.x + target.x) / 2;
        const midY = (particle.y + target.y) / 2;
        ctx.beginPath();
        ctx.arc(midX, midY, 10, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 0, 255, 0.8)';
        ctx.fill();
    }

    static atom(ctx, particle) {
        if (!particle.atomActive) return;

        const radius = CONFIG.atomRadius * particle.atomProgress;
        
        // Draw the outer circle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw the electron orbits
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.ellipse(
                particle.x, particle.y,
                radius * 0.8, radius * 0.5,
                i * Math.PI / 3 + particle.atomAngle, 0, Math.PI * 2
            );
            ctx.strokeStyle = 'rgba(0, 200, 255, 0.7)';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw the electron
            const electronAngle = particle.atomAngle + i * (Math.PI * 2 / 3);
            const electronX = particle.x + Math.cos(electronAngle) * radius * 0.8;
            const electronY = particle.y + Math.sin(electronAngle) * radius * 0.5;
            ctx.beginPath();
            ctx.arc(electronX, electronY, 3, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 200, 255, 1)';
            ctx.fill();
        }

        // Draw the nucleus
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 100, 100, 1)';
        ctx.fill();
    }
}