const simulation = new Simulation();
function animate() {
    simulation.update();
    simulation.draw();
    requestAnimationFrame(animate);
}
animate();