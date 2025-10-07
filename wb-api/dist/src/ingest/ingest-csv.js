"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const axios_1 = require("axios");
function parseCSV(text) {
    const lines = text.split(/\r?\n/).filter(l => l.trim().length);
    const headers = lines.shift().split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    return lines.map(line => {
        const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
        const row = {};
        headers.forEach((h, i) => { var _a; return row[h] = (_a = cols[i]) !== null && _a !== void 0 ? _a : ''; });
        return row;
    });
}
async function main() {
    var _a;
    const [, , csvPath, cityArg, stateArg] = process.argv;
    if (!csvPath || !cityArg || !stateArg) {
        console.error('Usage: npm run ingest:csv -- <path-to-file.csv> <CITY> <STATE>');
        process.exit(1);
    }
    const absPath = path.resolve(csvPath);
    if (!fs.existsSync(absPath)) {
        console.error(`❌ File not found: ${absPath}`);
        process.exit(1);
    }
    const file = fs.readFileSync(absPath, 'utf8');
    const rows = parseCSV(file);
    const items = rows.filter(r => r.title && r.price);
    const payload = { city: cityArg, state: stateArg, items };
    const API_BASE = process.env.API_BASE || 'http://localhost:3000/api/v1';
    console.log(`📦 Sending ${items.length} rows from ${csvPath} to ${API_BASE}/ingest/bulk...`);
    try {
        const res = await axios_1.default.post(`${API_BASE}/ingest/bulk`, payload, { headers: { 'Content-Type': 'application/json' } });
        console.log('✅ Done:', res.data);
    }
    catch (err) {
        console.error('❌ Failed:', ((_a = err.response) === null || _a === void 0 ? void 0 : _a.data) || err.message);
    }
}
main();
//# sourceMappingURL=ingest-csv.js.map