#!/usr/bin/env node
/** Subset licensed local fonts with FontTools. Put source files in assets/fonts/source. */
import { readdir, mkdir } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { basename, extname, join } from 'node:path';
const source='assets/fonts/source', output='public/fonts';
await mkdir(output,{recursive:true});
let entries;
try { entries=await readdir(source); } catch { console.log(`Add licensed font files to ${source}; nothing to subset yet.`); process.exit(0); }
const fonts=entries.filter((file)=>['.woff2','.ttf','.otf'].includes(extname(file).toLowerCase()));
for(const file of fonts){
 const args=[join(source,file),`--output-file=${join(output,basename(file,extname(file))+'.woff2')}`,'--flavor=woff2','--layout-features=*','--unicodes=U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2190-21FF,U+2212,U+FEFF,U+FFFD','--name-IDs=0,1,2,4,6','--name-legacy','--notdef-glyph','--notdef-outline','--recommended-glyphs'];
 await new Promise((resolve,reject)=>{const child=spawn('pyftsubset',args,{stdio:'inherit'});child.on('error',reject);child.on('exit',(code)=>code===0?resolve():reject(new Error(`pyftsubset failed for ${file}: ${code}`)));});
}
console.log(`Subset ${fonts.length} local font file(s).`);