const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) { 
            results.push(file);
        }
    });
    return results;
}

const files = walk('./src');
let changedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let newContent = content.replace(/from\s+(['"])(@\/components\/ui\/|\.\/)([A-Z][A-Za-z0-9_-]*)(['"])/g, (match, q1, prefix, name, q2) => {
        return `from ${q1}${prefix}${name.toLowerCase()}${q2}`;
    });
    
    // Also handle dynamic imports or requires if any, though regex above catches most from "@..."
    newContent = newContent.replace(/import\((['"])(@\/components\/ui\/|\.\/)([A-Z][A-Za-z0-9_-]*)(['"])\)/g, (match, q1, prefix, name, q2) => {
        return `import(${q1}${prefix}${name.toLowerCase()}${q2})`;
    });

    if (content !== newContent) {
        fs.writeFileSync(file, newContent);
        changedCount++;
        console.log(`Updated ${file}`);
    }
});
console.log(`Done. Updated ${changedCount} files.`);
