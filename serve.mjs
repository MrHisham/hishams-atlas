import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(fileURLToPath(new URL('./dist/',import.meta.url)));
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.svg':'image/svg+xml','.wasm':'application/wasm'};
const server=createServer(async(req,res)=>{try{const requested=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const target=path.resolve(root,'.'+requested);if(!target.startsWith(root+path.sep)&&target!==root){res.writeHead(403).end();return}let file=target;if((await stat(file)).isDirectory())file=path.join(file,'index.html');const data=await readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(data)}catch{res.writeHead(404).end('Not found')}});
const port=Number(process.env.PORT||4173);server.listen(port,'127.0.0.1',()=>console.log(`Hisham’s Atlas: http://127.0.0.1:${port}/\nKeep this window open. Press Ctrl+C to stop.`));server.on('error',e=>{console.error(e.message);process.exitCode=1});
