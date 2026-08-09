const { execSync } = require('child_process');
try {
    execSync('npm run build', { stdio: 'pipe' });
    console.log("SUCCESS");
} catch (e) {
    console.log("STDERR:", e.stderr ? e.stderr.toString() : "None");
    console.log("STDOUT:", e.stdout ? e.stdout.toString() : "None");
}
