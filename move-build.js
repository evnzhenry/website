const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'frontend', '.next');
const dest = path.join(__dirname, '.next');

// Remove existing dest if it exists
if (fs.existsSync(dest)) {
    fs.rmSync(dest, { recursive: true, force: true });
}

// Move (or copy/remove) the directory
try {
    fs.renameSync(src, dest);
    console.log('Successfully moved .next to root');
} catch (err) {
    // If rename fails (e.g. cross-device), try copy & remove
    try {
        fs.cpSync(src, dest, { recursive: true });
        fs.rmSync(src, { recursive: true, force: true });
        console.log('Successfully copied and moved .next to root');
    } catch (e) {
        console.error('Failed to move .next build artifact:', e);
        process.exit(1);
    }
}
