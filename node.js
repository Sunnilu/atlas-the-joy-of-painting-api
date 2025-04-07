const fs = require('fs');

// Load and parse package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
console.log("Project Name:", packageJson.name);
console.log("Scripts:", packageJson.scripts);
console.log("Dependencies:", packageJson.dependencies);

// Load and parse package-lock.json
const lockJson = JSON.parse(fs.readFileSync('package-lock.json', 'utf8'));
console.log("All Locked Dependencies:");
Object.keys(lockJson.dependencies).forEach(dep => {
    console.log(`${dep}: ${lockJson.dependencies[dep].version}`);
});
